import { loadCondutorRequests } from '../loaders/condutorApiLoaders.js';


export function setupCondutorFormHandlers() {
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
}