import { loadCondutorTrips, loadCondutorAltTrips, loadCondutorRequests, loadUserName, getUserIdFromToken } from './loaders/condutorApiLoaders.js';
import { setupCondutorFormHandlers } from './handlers/condutorFormHandlers.js';
import { setupCondutorFilterHandlers } from './handlers/condutorFilterHandlers.js';

document.addEventListener('DOMContentLoaded', () => {
    const driverId = getUserIdFromToken();
    if (!driverId) {
        alert('Session expired. Please log in again.');
        window.location.href = 'login.html';
        return;
    }

    setupCondutorFormHandlers();
    setupCondutorFilterHandlers();

    loadCondutorRequests();
    loadCondutorTrips({ driver_id: driverId });
    loadCondutorAltTrips(driverId);
    loadUserName();
});

document.addEventListener('DOMContentLoaded', () => {
    const driverId = getUserIdFromToken()
    if (!driverId) {
        alert('Session expired. Please log in again.')
        window.location.href = 'login.html'
        return
    }

    const loginLink = document.getElementById('nav-login-link');
    const token = localStorage.getItem('token');
    if (loginLink && token) {
        loginLink.textContent = 'Perfil';
        loginLink.href = 'perfil.html';
    }


    loadCondutorRequests();
    loadCondutorTrips({ driver_id: driverId })
    loadCondutorAltTrips(driverId);
    loadUserName();
});