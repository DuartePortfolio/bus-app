async function loadTrips() {
    const tbody = document.getElementById('trips-tbody');
    tbody.innerHTML = '<tr><td colspan="7">A carregar...</td></tr>';
    try {

        const res = await fetch('http://localhost:3000/api/trips', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const trips = await res.json();
        tbody.innerHTML = '';
        trips.forEach(trip => {
            const altTraj = trip.alternative_trajectories && trip.alternative_trajectories.length
                ? trip.alternative_trajectories.map(t => t.alt_trajectory).join(', ')
                : '—';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${trip.trip_id}</td>
                <td>${trip.start_time}</td>
                <td>${trip.route?.route_name || trip.route_id}</td>
                <td>${trip.vehicle?.plate_number || trip.vehicle_id}</td>
                <td>${trip.driver?.name || trip.driver_id}</td>
                <td>${altTraj}</td>
                <td>
                    <button class="btn btn-primary btn-sm btn-edit-trip actionBtn"
                        data-id="${trip.trip_id}"
                        data-time="${trip.start_time}"
                        data-route="${trip.route?.route_name || trip.route_id}"
                        data-vehicle="${trip.vehicle?.plate_number || trip.vehicle_id}"
                        data-driver="${trip.driver?.name || trip.driver_id}"
                        data-alttraj="${altTraj}">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-delete-trip actionBtn" data-id="${trip.trip_id}">Apagar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Add event listeners for edit buttons
        tbody.querySelectorAll('.btn-edit-trip').forEach(btn => {
            btn.addEventListener('click', function () {
                document.getElementById('admin-trip-id').value = this.getAttribute('data-id');
                document.getElementById('admin-trip-time').value = this.getAttribute('data-time');
                document.getElementById('admin-trip-route').value = this.getAttribute('data-route');
                document.getElementById('admin-trip-vehicle').value = this.getAttribute('data-vehicle');
                document.getElementById('admin-trip-driver').value = this.getAttribute('data-driver');
                document.getElementById('admin-trip-alttraj').value = this.getAttribute('data-alttraj');
                const modal = new bootstrap.Modal(document.getElementById('adminTripModal'));
                modal.show();
            });
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar viagens.</td></tr>';
    }
}

async function loadRoutes() {
    const tbody = document.getElementById('routes-tbody');
    tbody.innerHTML = '<tr><td colspan="3">A carregar...</td></tr>';
    try {
        const res = await fetch('http://localhost:3000/api/routes', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const routes = await res.json();
        tbody.innerHTML = '';
        routes.forEach(route => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${route.route_id}</td>
                <td>${route.route_name}</td>
                <td>${route.route_stops}</td>
                <td>
                    <button class="btn btn-primary btn-sm btn-edit-route actionBtn"
                        data-id="${route.route_id}"
                        data-name="${route.route_name}"
                        data-stops="${route.route_stops}">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-delete-route actionBtn" data-id="${route.route_id}">Apagar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-edit-route').forEach(btn => {
            btn.addEventListener('click', function () {
                document.getElementById('admin-route-id').value = this.getAttribute('data-id');
                document.getElementById('admin-route-name').value = this.getAttribute('data-name');
                document.getElementById('admin-route-stops').value = this.getAttribute('data-stops');
                const modal = new bootstrap.Modal(document.getElementById('adminRouteModal'));
                modal.show();
            });
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar rotas.</td></tr>';
    }
}

async function loadStops() {
    const tbody = document.getElementById('stops-tbody');
    tbody.innerHTML = '<tr><td colspan="5">A carregar...</td></tr>';
    try {
        const res = await fetch('http://localhost:3000/api/stops', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const stops = await res.json();
        tbody.innerHTML = '';
        stops.forEach(stop => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${stop.stop_id}</td>
                <td>${stop.latitude}</td>
                <td>${stop.longitude}</td>
                <td>${stop.stop_name}</td>
                <td><button class="icon-btn" title="Editar">&#9998;</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar paragens.</td></tr>';
    }
}

async function loadVehicles() {
    const tbody = document.getElementById('vehicles-tbody');
    tbody.innerHTML = '<tr><td colspan="4">A carregar...</td></tr>';
    try {
        const res = await fetch('http://localhost:3000/api/vehicles', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const vehicles = await res.json();
        tbody.innerHTML = '';
        vehicles.forEach(vehicle => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${vehicle.vehicle_id}</td>
                <td>${vehicle.plate_number}</td>
                <td>${vehicle.capacity}</td>
                <td><button class="icon-btn" title="Editar">&#9998;</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar veículos.</td></tr>';
    }
}

async function loadAltTrajectories() {
    const tbody = document.getElementById('alternative-trajectories-tbody');
    tbody.innerHTML = '<tr><td colspan="5">A carregar...</td></tr>';
    try {
        const res = await fetch('http://localhost:3000/api/alternative_trajectories', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const altTrajectories = await res.json();
        tbody.innerHTML = '';
        altTrajectories.forEach(trajectory => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${trajectory.alt_trajectory_id}</td>
                <td>${trajectory.stop_id_1}</td>
                <td>${trajectory.stop_id_2}</td>
                <td>${trajectory.alt_trajectory}</td>
                <td><button class="icon-btn" title="Editar">&#9998;</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar trajetos alternativos.</td></tr>';
    }
}

async function loadWeather() {
    const tbody = document.getElementById('weather-tbody');
    tbody.innerHTML = '<tr><td colspan="8">A carregar...</td></tr>';
    try {
        const res = await fetch('http://localhost:3000/api/weather', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const weather = await res.json();
        tbody.innerHTML = '';
        weather.forEach(reading => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${reading.reading_id}</td>
                <td>${reading.datetime}</td>
                <td>${reading.temperature}</td>
                <td>${reading.rain}</td>
                <td>${reading.wind}</td>
                <td>${reading.location}</td>
                <td>${reading.notes}</td>                
                <td><button class="icon-btn" title="Editar">&#9998;</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="8">Erro ao carregar meteorologia.</td></tr>';
    }
}

async function loadUsers() {
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '<tr><td colspan="6">A carregar...</td></tr>';
    try {
        const res = await fetch('http://localhost:3000/api/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const users = await res.json();
        tbody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.user_id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.contact}</td>
                <td><button class="icon-btn" title="Editar">&#9998;</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6">Erro ao carregar veículos.</td></tr>';
    }
}

async function loadAdminRequests() {
    const tbody = document.getElementById('admin-requests-tbody');
    tbody.innerHTML = '<tr><td colspan="8">A carregar...</td></tr>';
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/requests', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const requests = await res.json();
        tbody.innerHTML = '';
        if (!Array.isArray(requests) || requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">Sem pedidos.</td></tr>';
            return;
        }
        requests.forEach(req => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${req.request_id}</td>
                <td>${req.driver?.name || req.driver_id}</td>
                <td>${req.category}</td>
                <td>${req.title}</td>
                <td>${req.message}</td>
                <td>${req.status}</td>
                <td>${req.response || '—'}</td>
                <td>
                    <button class="btn btn-primary btn-sm btn-edit-request"
                        data-id="${req.request_id}"
                        data-status="${req.status}"
                        data-response="${req.response || ''}">
                        Editar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Add event listeners for edit buttons
        tbody.querySelectorAll('.btn-edit-request').forEach(btn => {
            btn.addEventListener('click', function () {
                document.getElementById('admin-request-id').value = this.getAttribute('data-id');
                document.getElementById('admin-request-status').value = this.getAttribute('data-status');
                document.getElementById('admin-request-response').value = this.getAttribute('data-response');
                const modal = new bootstrap.Modal(document.getElementById('adminRequestModal'));
                modal.show();
            });
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="8">Erro ao carregar pedidos.</td></tr>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAdminRequests();

    document.getElementById('admin-request-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const id = document.getElementById('admin-request-id').value;
        const status = document.getElementById('admin-request-status').value;
        const response = document.getElementById('admin-request-response').value;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3000/api/requests/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, response })
            });
            if (res.ok) {
                bootstrap.Modal.getInstance(document.getElementById('adminRequestModal')).hide();
                loadAdminRequests();
            } else {
                const error = await res.json();
                alert(error.error || 'Error updating request');
            }
        } catch (err) {
            alert('Internal server error');
        }
    });
});

// Add object event listener
const addTripForm = document.querySelector('.viagem-form');
const addRouteForm = document.querySelector('.rota-form');
const addStopForm = document.querySelector('.paragem-form');
const addVehicleForm = document.querySelector('.veiculo-form');
const addAltTrajectoryForm = document.querySelector('.trajetoria-alternativa-form');
const addWeatherForm = document.querySelector('.meteorologia-form');
const addUserForm = document.querySelector('.utilizador-form');

addTripForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addTripForm);
    const data = {
        start_time: formData.get('start_time'),
        route_id: formData.get('route_id'),
        vehicle_id: formData.get('vehicle_id'),
        driver_id: formData.get('driver_id'),
        trajectory_id: formData.get('trajectory_id') // se existir
    };    
    try {
        const res = await fetch('http://localhost:3000/api/trips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            addTripForm.reset();
            loadTrips(); 
            alert('Trip added successfully!');
        } else {
            const error = await res.json();
            alert(`Error: ${error.error || error.message || 'Erro desconhecido.'}`);
        }
    } catch (err) {
        alert('Internal server error');
    }
});

addRouteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addRouteForm);
    const data = {
        route_name: formData.get('route_name'),
    };    
    try {
        const res = await fetch('http://localhost:3000/api/routes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            addTripForm.reset();
            loadRoutes();
            alert('Route added successfully!');
        } else {
            const error = await res.json();
            alert(`Error: ${error.error || error.message || 'Erro desconhecido.'}`);
        }
    } catch (err) {
        alert('Internal server error');
    }
});

addStopForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addStopForm);
    const data = {
        latitude: formData.get('latitude'),
        longitude: formData.get('longitude'),
        stop_name: formData.get('stop_name'),
    };    
    try {
        const res = await fetch('http://localhost:3000/api/stops', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            addTripForm.reset();
            loadStops(); 
            alert('Stop added successfully!');
        } else {
            const error = await res.json();
            alert(`Error: ${error.error || error.message || 'Erro desconhecido.'}`);
        }
    } catch (err) {
        alert('Internal server error');
    }
});

addVehicleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addVehicleForm);
    const data = {
        plate_number: formData.get('plate_number'),
        capacity: formData.get('capacity')
    };    
    try {
        const res = await fetch('http://localhost:3000/api/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            addVehicleForm.reset();
            loadVehicles(); 
            alert('Vehicle added successfully!');
        } else {
            const error = await res.json();
            alert(`Error: ${error.error || error.message || 'Erro desconhecido.'}`);
        }
    } catch (err) {
        alert('Internal server error');
    }
});

addAltTrajectoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addAltTrajectoryForm);
    const data = {
        stop_id_1: formData.get('stop_id_1'),
        stop_id_2: formData.get('stop_id_2'),
        alt_trajectory: formData.get('alt_trajectory')
    };    
    try {
        const res = await fetch('http://localhost:3000/api/alternative_trajectories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            addAltTrajectoryForm.reset();
            loadAltTrajectories(); 
            alert('Trajectory added successfully!');
        } else {
            const error = await res.json();
            alert(`Error: ${error.error || error.message || 'Erro desconhecido.'}`);
        }
    } catch (err) {
        alert('Internal server error');
    }
});

addWeatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addWeatherForm);
    const data = {
        temperature: formData.get('temperature'),
        rain: formData.get('rain'),
        wind: formData.get('wind'),
        location: formData.get('location'),
        notes: formData.get('notes'),
        datetime: formData.get('datetime')
    };    
    try {
        const res = await fetch('http://localhost:3000/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            addWeatherForm.reset();
            loadWeather(); 
            alert('Weather reading added successfully!');
        } else {
            const error = await res.json();
            alert(`Error: ${error.error || error.message || 'Erro desconhecido.'}`);
        }
    } catch (err) {
        alert('Internal server error');
    }
});

addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addUserForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
        contact: formData.get('contact')
    };    
    try {
        const res = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            addUserForm.reset();
            loadUsers(); 
            alert('User added successfully!');
        } else {
            const error = await res.json();
            alert(`Error: ${error.error || error.message || 'Erro desconhecido.'}`);
        }
    } catch (err) {
        alert('Internal server error');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    loadTrips();
    loadRoutes();
    loadStops();
    loadVehicles();
    loadAltTrajectories();
    loadWeather();
    loadUsers();
});