document.addEventListener('DOMContentLoaded', async () => {
    const carreiraSelect = document.getElementById('carreira');
    const form = document.getElementById('form-horarios');
    const uteisDiv = document.getElementById('horarios-uteis');
    const sabadoDiv = document.getElementById('horarios-sabado');
    const domingoDiv = document.getElementById('horarios-domingo');

    // Horários de partida por tipo de dia
    const horarios = {
        weekday: ["07:00", "08:00", "09:00", "12:00", "17:00", "18:00"],
        saturday: ["08:00", "10:00", "12:00", "16:00"],
        sunday: ["09:00", "18:00"]
    };

    // Preenche o select de carreiras (rotas)
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
        carreiraSelect.innerHTML = '<option>Erro ao carregar carreiras</option>';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        uteisDiv.innerHTML = sabadoDiv.innerHTML = domingoDiv.innerHTML = '';

        const routeId = carreiraSelect.value;
        if (!routeId) return;

        // Busca as paragens da rota
        let stops = [];
        try {
            const stopsRes = await fetch(`http://localhost:3000/api/routes/${routeId}/stops`);
            stops = await stopsRes.json();
        } catch {
            uteisDiv.innerHTML = '<div class="alert alert-danger">Erro ao carregar paragens.</div>';
            return;
        }
        if (!Array.isArray(stops) || stops.length === 0) {
            uteisDiv.innerHTML = '<div class="alert alert-info">Sem paragens para esta rota.</div>';
            return;
        }

        // Função para gerar horários de passagem
        function gerarHorariosPassagem(horaPartida, numParagens) {
            const [h, m] = horaPartida.split(':').map(Number);
            let minutos = h * 60 + m;
            const horariosParagens = [];
            for (let i = 0; i < numParagens; i++) {
                horariosParagens.push(
                    String(Math.floor(minutos / 60)).padStart(2, '0') + ':' +
                    String(minutos % 60).padStart(2, '0')
                );
                minutos += 4 + Math.floor(Math.random() * 2); // 4-5 minutos entre paragens
            }
            return horariosParagens;
        }

        // Função para gerar tabela 
        function makeTable(title, horas) {
            let html = `<h4 class="mt-4 mb-2 text-center">${title}</h4>`;
            html += `<div class="table-responsive"><table class="table table-bordered table-striped align-middle" style="min-width:900px"><thead><tr><th style="min-width:90px">Partida</th>`;
            stops.forEach(stop => html += `<th>${stop.stop_name}</th>`);
            html += `</tr></thead><tbody>`;
            horas.forEach(hora => {
                const horariosParagens = gerarHorariosPassagem(hora, stops.length);
                html += `<tr><td><b>${hora}</b></td>`;
                horariosParagens.forEach(hp => html += `<td>${hp}</td>`);
                html += `</tr>`;
            });
            html += `</tbody></table></div>`;
            return html;
        }

        uteisDiv.innerHTML = makeTable("Dias Úteis", horarios.weekday);
        sabadoDiv.innerHTML = makeTable("Sábados", horarios.saturday);
        domingoDiv.innerHTML = makeTable("Domingos e Feriados", horarios.sunday);
    });
});