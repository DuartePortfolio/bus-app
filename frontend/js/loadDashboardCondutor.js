function getUserIdFromToken() {
    const token = localStorage.getItem('token')
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.user_id
    } catch {
        return null
    }
}

async function loadCondutorTrips(filters = {}) {
    const tbody = document.getElementById('condutor-trips-tbody');
    tbody.innerHTML = '<tr><td colspan="7">A carregar...</td></tr>';
    try {
        let url = 'http://localhost:3000/api/trips';
        const params = new URLSearchParams();
        if (filters.driver_id) params.append('driver_id', filters.driver_id);
        if (filters.route_name) params.append('route_name', filters.route_name);
        if (filters.vehicle_plate) params.append('vehicle_plate', filters.vehicle_plate);
        if (filters.alt_trajectory_text) params.append('alt_trajectory_text', filters.alt_trajectory_text);
        if ([...params].length) url += '?' + params.toString();

        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const trips = await res.json();
        tbody.innerHTML = '';
        trips.forEach(trip => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${trip.trip_id}</td>
                <td>${trip.start_time}</td>
                <td>${trip.route?.route_name || trip.route_id}</td>
                <td>${trip.vehicle?.plate_number || trip.vehicle_id}</td>
                <td>${trip.alternative_trajectories?.map(t => t.alt_trajectory).join(', ') || '—'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar viagens do condutor.</td></tr>';
    }
}

async function loadCondutorAltTrips(driverId) {
    const tbody = document.getElementById('condutor-alttrajectories-tbody');
    tbody.innerHTML = '<tr><td colspan="7">A carregar...</td></tr>';
    try {
        const res = await fetch(`http://localhost:3000/api/trips?driver_id=${driverId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }); 
        const trips = await res.json();
        tbody.innerHTML = '';
        let found = false;
        trips.forEach(trip => {
            if (trip.alternative_trajectories && trip.alternative_trajectories.length) {
                trip.alternative_trajectories.forEach(trajectory => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${trajectory.alt_trajectory_id}</td>
                        <td></td>
                        <td>${trajectory.stop1?.stop_name || trajectory.stop_id_1 || '—'}</td>
                        <td></td>
                        <td>${trajectory.stop2?.stop_name || trajectory.stop_id_2 || '—'}</td>
                        <td></td>
                        <td>${trajectory.alt_trajectory}</td>
                    `;
                    tbody.appendChild(tr);
                    found = true;
                });
            }
        });
        if (!found) {
            tbody.innerHTML = '<tr><td colspan="7">Sem trajetos alternativos.</td></tr>';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar trajetos alternativos.</td></tr>';
    }
}

async function loadCondutorRequests() {
    const tbody = document.getElementById('condutor-requests-tbody');
    tbody.innerHTML = '<tr><td colspan="6">A carregar...</td></tr>';
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/requests', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }); 
        const requests = await res.json();
        tbody.innerHTML = '';
        if (!Array.isArray(requests) || requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Sem pedidos.</td></tr>';
            return;
        }
        requests.forEach(req => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${req.request_id}</td>
                <td>${req.category}</td>
                <td>${req.title}</td>
                <td>${req.message}</td>
                <td>${req.status}</td>
                <td>${req.response || '—'}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-delete-request" data-id="${req.request_id}">Apagar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-delete-request').forEach(btn => {
            btn.addEventListener('click', async function () {
                if (!confirm('Are you sure you want to delete this request?')) return;
                const id = this.getAttribute('data-id');
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch(`http://localhost:3000/api/requests/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        loadCondutorRequests();
                    } else {
                        const error = await res.json();
                        alert(error.error || 'Error deleting request');
                    }
                } catch (err) {
                    alert('Internal server error');
                }
            });
        });

    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6">Erro ao carregar pedidos.</td></tr>';
    }
}

async function loadUserName() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.user_id;
        const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const user = await res.json();
            const welcome = document.getElementById('welcome-msg');
            if (welcome) {
                welcome.textContent = `Bem-vindo, ${user.name}`;
            }
        }
    } catch (err) {
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const driverId = getUserIdFromToken()
    if (!driverId) {
        alert('Session expired. Please log in again.')
        window.location.href = 'login.html'
        return
    }


    const btnCreate = document.getElementById('btn-create-request');
    const requestModal = new bootstrap.Modal(document.getElementById('requestModal'));
    btnCreate.addEventListener('click', () => {
        document.getElementById('request-form').reset();
        requestModal.show();
    });

    // Submit request form
    document.getElementById('request-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const category = document.getElementById('request-category').value;
        const title = document.getElementById('request-title').value;
        const message = document.getElementById('request-message').value;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3000/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ category, title, message })
            });
            if (res.ok) {
                requestModal.hide();
                loadCondutorRequests();
            } else {
                const error = await res.json();
                alert(error.error || 'Erro ao enviar pedido.');
            }
        } catch (err) {
            alert('Erro ao comunicar com o servidor.');
        }
    });

    // Filter modal logic for trips
    const filterTripsForm = document.getElementById('filter-trips-form');
    if (filterTripsForm) {
        filterTripsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const filters = {
                driver_id: driverId,
                route_name: document.getElementById('filter-trip-route-name').value,
                vehicle_plate: document.getElementById('filter-trip-vehicle-plate').value,
                alt_trajectory_text: document.getElementById('filter-trip-alt-text').value
            };
            // Remove empty filters
            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });
            bootstrap.Modal.getInstance(document.getElementById('filterTripsModal')).hide();
            loadCondutorTrips(filters);
        });
    }    

    loadCondutorRequests();
    loadCondutorTrips({ driver_id: driverId })
    loadCondutorAltTrips(driverId);
    loadUserName();
});