document.addEventListener('DOMContentLoaded', async () => {
    const carreiraSelect = document.getElementById('carreira');
    const stopsTableDiv = document.getElementById('stops-table');

    try {
        const res = await fetch('http://localhost:3000/api/routes');
        const routes = await res.json();
        routes.forEach(route => {
            const option = document.createElement('option');
            option.value = route.route_id;
            option.textContent = route.route_name;
            carreiraSelect.appendChild(option);
        });
    } catch (err) {
        carreiraSelect.innerHTML = '<option>Erro ao carregar rotas</option>';
    }

    carreiraSelect.addEventListener('change', async function () {
        const routeId = this.value;
        stopsTableDiv.innerHTML = 'A carregar paragens...';
        try {
            const res = await fetch(`http://localhost:3000/api/routes/${routeId}/stops`);
            const stops = await res.json();
            if (!Array.isArray(stops) || stops.length === 0) {
                stopsTableDiv.innerHTML = '<p>Sem paragens para esta rota.</p>';
                return;
            }
            let table = `<table class="table table-striped table-bordered"><thead><tr><th>#</th><th>Nome da Paragem</th></tr></thead><tbody>`;
            stops.forEach((stop, idx) => {
                table += `<tr><td>${idx + 1}</td><td>${stop.stop_name}</td></tr>`;
            });
            table += '</tbody></table>';
            stopsTableDiv.innerHTML = table;
        } catch (err) {
            stopsTableDiv.innerHTML = '<p>Erro ao carregar paragens.</p>';
        }
    });
});