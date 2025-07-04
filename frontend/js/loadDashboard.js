import { loadTrips, loadRoutes, loadStops, loadVehicles, loadAltTrajectories, loadWeather, loadUsers, loadAdminRequests, loadUserName } from './loaders/apiLoaders.js';
import { setupFormHandlers } from './handlers/formHandlers.js';
import { setupFilterHandlers } from './handlers/filterHandlers.js';


window.addEventListener('DOMContentLoaded', () => {

    // set the calendar input to today's date
    const calendar = document.getElementById('adminCalendar');
    if (calendar) {
        const today = new Date().toISOString().split('T')[0];
        calendar.value = today;
    }
    calendar.addEventListener('change', function () {
        loadTrips({ start_time: this.value });
    });

    const loginLink = document.getElementById('nav-login-link');
    const token = localStorage.getItem('token');
    if (loginLink && token) {
        loginLink.textContent = 'Perfil';
        loginLink.href = 'perfil.html';
    }

    setupFormHandlers();
    setupFilterHandlers();
    loadTrips();
    loadRoutes();
    loadStops();
    loadVehicles();
    loadAltTrajectories();
    loadWeather();
    loadUsers();
    loadAdminRequests();
    loadUserName();

});