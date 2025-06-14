async function loadTrips() {
    const tbody = document.getElementById('trips-tbody');
    tbody.innerHTML = '<tr><td colspan="7">A carregar...</td></tr>';
    try {
        const res = await fetch('http://localhost:3000/api/trips');
        const trips = await res.json();
        tbody.innerHTML = '';
        trips.forEach(trip => {
            // Get alternative trajectories as a comma-separated string
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
                <td><button class="icon-btn" title="Editar">&#9998;</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar viagens.</td></tr>';
    }
}

async function loadRoutes() {
    const tbody = document.getElementById('routes-tbody');
    tbody.innerHTML = '<tr><td colspan="3">A carregar...</td></tr>';
    try {
        const res = await fetch('http://localhost:3000/api/routes');
        const routes = await res.json();
        tbody.innerHTML = '';
        routes.forEach(route => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${route.route_id}</td>
                <td>${route.route_name}</td>
                <td><button class="icon-btn" title="Editar">&#9998;</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar rotas.</td></tr>';
    }
}

async function loadStops() {
    const tbody = document.getElementById('stops-tbody');
    tbody.innerHTML = '<tr><td colspan="5">A carregar...</td></tr>';
    try {
        const res = await fetch('http://localhost:3000/api/stops');
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
        const res = await fetch('http://localhost:3000/api/vehicles');
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
        const res = await fetch('http://localhost:3000/api/alternative_trajectories');
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
        const res = await fetch('http://localhost:3000/api/weather');
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
        const res = await fetch('http://localhost:3000/api/users');
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

window.addEventListener('DOMContentLoaded', () => {
    loadTrips();
    loadRoutes();
    loadStops();
    loadVehicles();
    loadAltTrajectories();
    loadWeather();
    loadUsers();
});