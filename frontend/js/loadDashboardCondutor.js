async function loadCondutorTrips(driverId) {
    const tbody = document.getElementById('condutor-trips-tbody');
    tbody.innerHTML = '<tr><td colspan="7">A carregar...</td></tr>';
    try {
        const res = await fetch(`http://localhost:3000/api/trips?driver_id=${driverId}`);
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
        const res = await fetch(`http://localhost:3000/api/trips?driver_id=${driverId}`);
        const trips = await res.json();
        tbody.innerHTML = '';
        let found = false;
        trips.forEach(trip => {
            if (trip.alternative_trajectories && trip.alternative_trajectories.length) {
                trip.alternative_trajectories.forEach(trajectory => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${trajectory.alt_trajectory_id}</td>
                        <td>${trajectory.stop_id_1}</td>
                        <td></td>
                        <td>${trajectory.stop_id_2}</td>
                        <td></td>
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

// temp
loadCondutorTrips(4);
loadCondutorAltTrips(4);