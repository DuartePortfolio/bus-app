// Available stops are now stored as objects { id, name }
// Only the points where we *populate* and *render* those stops have been updated;
// All drag‑and‑drop logic continues to work with stop names (strings).

const busStopsList = document.getElementById('bus-stops-list');
const addStopBtn   = document.getElementById('add-stop');
const routeDropArea = document.getElementById('route-drop-area');
const createRouteBtn = document.getElementById('create-route');
const routeNameInput = document.getElementById('route-name');
const routeTitle     = document.getElementById('route-title');

const routeArea = document.querySelector('.route-area');
const saveBtn   = document.createElement('button');
const loadBtn   = document.createElement('button');

saveBtn.textContent = 'Save Route';
loadBtn.textContent = 'Load Route';

saveBtn.id = 'save-route';
loadBtn.id = 'load-route';
routeArea.append(saveBtn, loadBtn);

// ───────────────────────────────────────────────────────────────────────────────
// GLOBAL STATE
// ───────────────────────────────────────────────────────────────────────────────
/** @type {{ id:number, name:string }[]} */
let availableStops = [];
/** @type {(string|{ id:number, name:string })[]} */
let routeStops = [];
let currentRouteName = '';
let currentRouteId   = null;

// ───────────────────────────────────────────────────────────────────────────────
// RENDER HELPERS
// ───────────────────────────────────────────────────────────────────────────────
function renderRouteStops() {
    routeDropArea.innerHTML = '';
    if (routeStops.length === 0) {
        routeDropArea.innerHTML = '<p>Drag bus stops here to build your route</p>';
        return;
    }
    routeStops.forEach((stop, idx) => {
        const stopDiv = document.createElement('div');
        stopDiv.className = 'bus-stop';
        const stopsInfo = JSON.parse(localStorage.getItem('availableStopsInfo') || '{}');
        stopDiv.textContent = typeof stop === 'string'
            ? stop
            : stopsInfo[stop.name]?.name || stop.name || 'Unknown Stop';

        stopDiv.draggable = true;
        stopDiv.dataset.idx = idx;
        stopDiv.addEventListener('dragstart', e => {
            e.dataTransfer.setData('route-idx', idx);
            e.dataTransfer.effectAllowed = 'move';
        });

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '🗑️';
        removeBtn.onclick = () => {
            routeStops.splice(idx, 1);
            renderRouteStops();
        };
        stopDiv.appendChild(removeBtn);
        routeDropArea.appendChild(stopDiv);
    });
}

function renderAvailableStops() {
    busStopsList.innerHTML = '';
    availableStops.forEach((stop, idx) => {
        const stopDiv = document.createElement('div');
        stopDiv.className = 'bus-stop';
        stopDiv.textContent = stop.name;            // <—— now uses .name
        stopDiv.dataset.stop = stop.name;           // dataset carries the name string
        stopDiv.addEventListener('mousedown', e => startDrag(e, stopDiv, 'available', idx));
        busStopsList.appendChild(stopDiv);
    });
}

// ───────────────────────────────────────────────────────────────────────────────
// LOAD STOPS FROM API (updated to store objects)
// ───────────────────────────────────────────────────────────────────────────────
async function loadStops() {
    const container = busStopsList;
    container.innerHTML = '<div>A carregar...</div>';

    try {
        const res = await fetch('http://localhost:3000/api/stops', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');

        const stops = await res.json();
        container.innerHTML = '';
        availableStops = []; // reset
        const stopsByName = {};

        stops.forEach((s, idx) => {
            const obj = { id: s.stop_id, name: s.stop_name };
            availableStops.push(obj);               // ♻️ push object
            stopsByName[obj.name] = obj;            // store for lookup

            const stopDiv = document.createElement('div');
            stopDiv.className = 'bus-stop';
            stopDiv.textContent = obj.name;
            stopDiv.dataset.stop = obj.name;
            stopDiv.addEventListener('mousedown', e => startDrag(e, stopDiv, 'available', idx));
            container.appendChild(stopDiv);
        });

        localStorage.setItem('availableStopsInfo', JSON.stringify(stopsByName));
    } catch (err) {
        console.error(err);
        container.innerHTML = '<div>Erro ao carregar paragens.</div>';
    }
}

// ───────────────────────────────────────────────────────────────────────────────
// DRAG & DROP CORE (only minor tweak for payload)
// ───────────────────────────────────────────────────────────────────────────────

function handleDragStartAvailable(e) {
    // give this drag a unique flavour
    e.dataTransfer.setData('text/bus-stop', e.target.dataset.stop);
    e.dataTransfer.effectAllowed = 'copy';
}

// Drag from route stops (for reordering)
function handleDragStartRoute(e) {
    e.dataTransfer.setData('route-idx', e.target.dataset.idx);
    e.dataTransfer.effectAllowed = 'move';
}

// Allow dropping on the route area
routeDropArea.addEventListener('dragover', e => {
    const ok = e.dataTransfer.types.includes('text/bus-stop') ||
               e.dataTransfer.types.includes('route-idx');
    if (ok) e.preventDefault();            // tell browser it’s droppable
});

// Drop from available stops to route
routeDropArea.addEventListener('drop', (e) => {
    e.preventDefault();

    const newStop  = e.dataTransfer.getData('text/bus-stop');
    const fromIdxStr = e.dataTransfer.getData('route-idx');
    const fromIdx = fromIdxStr ? parseInt(fromIdxStr, 10) : null;

    /* ---- 1. figure out where the cursor is in the list ---------- */
    const blocks = Array.from(routeDropArea.querySelectorAll('.bus-stop'));
    let toIdx = 0;            // default to top
    for (const el of blocks) {
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        if (e.clientY > centerY) toIdx++; else break;
    }
    // Result: # items whose centre is above the cursor => insert index

    /* ---- 2. add a brand‑new stop -------------------------------- */
    // if (newStop) {
    //     console.log(routeStops);
    //     console.log(newStop);
        
    //     const alreadyThere = routeStops[currentRouteName].some(
    //         s => (typeof s === 'string' ? s === newStop : s.name === newStop)
    //     );
    //     if (!alreadyThere) {
    //         routeStops.splice(toIdx, 0, newStop);
    //         renderRouteStops();
    //     }
    //     return;
    // }

    /* ---- 3. re‑order an existing stop --------------------------- */
    if (fromIdx !== null && fromIdx >= 0 && fromIdx < routeStops.length) {
        const [moved] = routeStops.splice(fromIdx, 1);
        if (fromIdx < toIdx) toIdx--;   // list shrank above the target line
        routeStops.splice(toIdx, 0, moved);
        renderRouteStops();
    }
});



// Reorder within route
function handleDragOverRoute(e) {
    e.preventDefault();
}

function handleDropRoute(e) {
    e.preventDefault();
    const fromIdx = e.dataTransfer.getData('route-idx');
    if (fromIdx !== '') {
        const toIdx = e.target.dataset.idx;
        if (fromIdx !== toIdx) {
            const [moved] = routeStops.splice(fromIdx, 1);
            routeStops.splice(toIdx, 0, moved);
            renderRouteStops();
        }
    }
}

let dragOrigin = null;
let draggingElem = null;
let dragType = null; // 'available' | 'route'
let dragIdx  = null;



function startDrag(e, elem, type, idx) {
    e.preventDefault();

    // visual ghost
    draggingElem = elem.cloneNode(true);
    draggingElem.classList.add('dragging');
    Object.assign(draggingElem.style, {
        position: 'absolute', pointerEvents: 'none', zIndex: 1000,
        width: `${elem.offsetWidth}px`, height: `${elem.offsetHeight}px`
    });
    document.getElementById('modalAdicionarRota').appendChild(draggingElem);

    dragType = type;
    dragIdx  = idx;

    // — payload uses *name string* for available stops so existing logic stays intact
    const payloadName = type === 'available'
        ? availableStops[idx].name
        : (typeof routeStops[idx] === 'object' ? routeStops[idx].name : routeStops[idx]);

    e.dataTransfer?.setData('application/json', JSON.stringify({ type, idx, name: payloadName }));

    moveDraggingElem(e);
    document.addEventListener('mousemove', moveDraggingElem);
    document.addEventListener('mouseup',   endDrag);
}

function moveDraggingElem(e) {
    if (!draggingElem) return;
    draggingElem.style.left = `${e.x - 400}px`;
    draggingElem.style.top  = `${e.y - 40}px`;
}

function endDrag(e) {
    if (!draggingElem) return;

    const dropRect = routeDropArea.getBoundingClientRect();
    let insertIdx = null;

    if (
        e.clientX >= dropRect.left &&
        e.clientX <= dropRect.right &&
        e.clientY >= dropRect.top &&
        e.clientY <= dropRect.bottom
    ) {
        const children = Array.from(routeDropArea.children);
        insertIdx = children.length;

        for (let i = 0; i < children.length; i++) {
            const rect = children[i].getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            if (e.clientY < centerY) {
                insertIdx = i;
                break;
            }
        }

        if (dragType === 'available') {
            const stop = availableStops[dragIdx];
            
            if (!routeStops.some(obj => JSON.stringify(obj) === JSON.stringify(stop))) {
                routeStops.splice(insertIdx, 0, stop);
            }
        } else if (dragType === 'route') {
            const [moved] = routeStops.splice(dragIdx, 1);
            if (dragIdx < insertIdx) insertIdx--; // list shrank above
            routeStops.splice(insertIdx, 0, moved);
        }

        renderRouteStops();

        // Optional bounce effect
        setTimeout(() => {
            const stopElem = routeDropArea.children[insertIdx];
            if (stopElem) stopElem.classList.add('bounce');
            setTimeout(() => {
                if (stopElem) stopElem.classList.remove('bounce');
            }, 400);
        }, 10);
    }

    // Clean up drag state
    draggingElem.remove();
    draggingElem = null;
    dragOrigin = null;
    dragType = null;
    dragIdx = null;
    document.removeEventListener('mousemove', moveDraggingElem);
    document.removeEventListener('mouseup', endDrag);
}

// Add new bus stop to available stops
// addStopBtn.addEventListener('click', () => {
//     const name = newStopName.value.trim();
//     if (name && !availableStops.includes(name)) {
//         availableStops.push(name);
//         renderAvailableStops();
//         newStopName.value = '';
//     }
// });

// Create a new route via API
createRouteBtn.addEventListener('click', async () => {
    currentRouteName = routeNameInput.value.trim();
    if (!currentRouteName) {
        alert('Please enter a route name.');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/routes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ route_name: currentRouteName })
        });

        if (!res.ok) throw new Error('Failed to create route');
        const data = await res.json(); // assuming { route_id, route_name, ... }

        routeTitle.textContent = `Route: ${currentRouteName}`;
        routeStops = [];
        renderRouteStops();

        // Save the new route ID globally so we can use it when saving stops
        currentRouteId = data.route_id;

        alert(`Route "${currentRouteName}" created successfully!`);

    } catch (err) {
        console.error(err);
        alert('Error creating route.');
    }
});


// Save route being worked on
saveBtn.addEventListener('click', async () => {
    if (!currentRouteId || !currentRouteName || routeStops.length === 0) {
        alert('Please create a route and add stops before saving.');
        return;
    }

    try {
        await deleteAllStopsFromRoute(currentRouteId); // ✅ fully finish deletions

        const stopsInfo = JSON.parse(localStorage.getItem('availableStopsInfo') || '{}');

        for (let i = 0; i < routeStops.length; i++) {
            const stopEntry = routeStops[i];
            const stopName = typeof stopEntry === 'string' ? stopEntry : stopEntry.name;
            const stopId = (typeof stopEntry === 'object' && stopEntry.id) || (stopsInfo[stopName]?.id);

            if (!stopId) {
                console.warn(`No ID found for stop "${stopName}" - skipped`);
                continue;
            }

            const res = await fetch(`http://localhost:3000/api/routes/${currentRouteId}/stops`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    stop_id: stopId,
                    stop_order: i + 1
                })
            });

            if (!res.ok) {
                throw new Error(`Failed to save stop "${stopName}"`);
            }
        }

        alert(`Route "${currentRouteName}" saved with ${routeStops.length} stops!`);

        console.log('Calling refreshSavedRoutes...');
        await refreshSavedRoutes(); // ✅ only refresh localStorage *after* everything is done
        console.log('refreshSavedRoutes completed');

    } catch (err) {
        console.error(err);
        alert('Error saving route stops.');
    }
});



// --- Fetch all routes *and* their stops ------------------------------------
async function refreshSavedRoutes() {
    console.log('>>> ENTERED refreshSavedRoutes');
    try {
        const res = await fetch('http://localhost:3000/api/routes', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const routes = await res.json();
        let savedRoutes = {};

        for (const route of routes) {
            const stopsRes = await fetch(`http://localhost:3000/api/routes/${route.route_id}/stops`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const stopsData = await stopsRes.json();

            // Save both stops and route_id
            savedRoutes[route.route_name] = {
                route_id: route.route_id,
                stops: stopsData.map(s => ({
                    id: s.stop_id,
                    name: s.stop_name
                }))
            };
        }

        localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
        console.log('savedRoutes written to localStorage:', savedRoutes);
    } catch (err) {
        console.error("Oops! Failed to load routes:", err);
    }
}


// --- Load Route Logic ---
loadBtn.addEventListener('click', () => {
    let savedRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '{}');
    const names = Object.keys(savedRoutes);
    if (names.length === 0) {
        alert('No saved routes found.');
        return;
    }
    // Create a simple select dialog
    const select = document.createElement('select');
    select.style.margin = '10px';
    names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.left = '50%';
    dialog.style.top = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.background = '#fff';
    dialog.style.padding = '20px';
    dialog.style.border = '2px solid #007bff';
    dialog.style.zIndex = 10000;
    dialog.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
    dialog.innerHTML = '<b>Select a route to load:</b><br>';
    dialog.appendChild(select);
    const okBtn = document.createElement('button');
    okBtn.textContent = 'Load';
    okBtn.style.marginLeft = '10px';
    dialog.appendChild(okBtn);
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.marginLeft = '5px';
    dialog.appendChild(cancelBtn);
    document.body.appendChild(dialog);

    okBtn.onclick = () => {
    const name = select.value;
    if (name && savedRoutes[name]) {
        currentRouteName = name;
        routeTitle.textContent = `Route: ${currentRouteName}`;
        routeStops = savedRoutes[name].stops.slice(); // assuming stops are inside .stops now
        currentRouteId = savedRoutes[name].route_id;

        // Save route_id to localStorage for future use
        localStorage.setItem('currentRouteId', currentRouteId);
        localStorage.setItem('currentRouteName', currentRouteName);

        renderRouteStops();
    }
    dialog.remove();
};
    cancelBtn.onclick = () => dialog.remove();
});



async function deleteAllStopsFromRoute(routeId) {
    const savedRoutes = JSON.parse(localStorage.getItem("savedRoutes") || '{}');
    const stops = savedRoutes[currentRouteName]?.stops || [];

    for (const stop of stops) {
        const stopId = stop.id;

        const response = await fetch(`http://localhost:3000/api/routes/${routeId}/stops/${stopId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to delete stop ${stopId}:`, error);
        }
    }

    console.log('Finished deleting all stops from route.');
}



loadStops();
refreshSavedRoutes();
renderRouteStops();




