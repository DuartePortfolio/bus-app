import { loadTrips, loadRoutes, loadStops, loadVehicles, loadAltTrajectories, loadWeather, loadUsers, loadAdminRequests } from '../loaders/apiLoaders.js';

const filterTripsForm = document.getElementById('filter-trips-form');
const filterRoutesForm = document.getElementById('filter-routes-form');
const filterStopsForm = document.getElementById('filter-stops-form');
const filterVehiclesForm = document.getElementById('filter-vehicles-form');
const filterAltTrajForm = document.getElementById('filter-alttraj-form');
const filterWeatherForm = document.getElementById('filter-weather-form');
const filterUsersForm = document.getElementById('filter-users-form');
const filterRequestsForm = document.getElementById('filter-requests-form');

export function setupFilterHandlers() {
        
    // filter trips event listener
    if (filterTripsForm) {
        filterTripsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const filters = {
                route_name: document.getElementById('filter-trip-route-name').value,
                vehicle_plate: document.getElementById('filter-trip-vehicle-plate').value,
                alt_trajectory_text: document.getElementById('filter-trip-alt-text').value
            };
            // Remove empty filters
            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });
            bootstrap.Modal.getInstance(document.getElementById('filterTripsModal')).hide();
            loadTrips(filters);
        });
    }

    // filter routes event listener
    if (filterRoutesForm) {
        filterRoutesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const filters = {
                route_name: document.getElementById('filter-route-route-name').value.trim(),
            };
            // Remove empty filters
            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });
            bootstrap.Modal.getInstance(document.getElementById('filterRoutesModal')).hide();
            loadRoutes(filters);
        });
    }

    // filter stops event listener
    if (filterStopsForm) {
        filterStopsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const filters = {
                stop_name: document.getElementById('filter-stop-name').value,
                latitude: document.getElementById('filter-stop-latitude').value,
                longitude: document.getElementById('filter-stop-longitude').value
            };
            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });
            bootstrap.Modal.getInstance(document.getElementById('filterStopsModal')).hide();
            loadStops(filters);
        });
    }

    // filter vehicles event listener
    if (filterVehiclesForm) {
        filterVehiclesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const filters = {
                plate_number: document.getElementById('filter-vehicle-plate').value,
                capacity: document.getElementById('filter-vehicle-capacity').value
            };
            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });
            bootstrap.Modal.getInstance(document.getElementById('filterVehiclesModal')).hide();
            loadVehicles(filters);
        });
    }

    // filter alt trajectories event listener
    if (filterAltTrajForm) {
        filterAltTrajForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const filters = {
                stop_id_1: document.getElementById('filter-alttraj-stop1').value,
                stop_id_2: document.getElementById('filter-alttraj-stop2').value,
                alt_trajectory: document.getElementById('filter-alttraj-desc').value
            };
            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });
            bootstrap.Modal.getInstance(document.getElementById('filterAltTrajModal')).hide();
            loadAltTrajectories(filters);
        });
    }

    // filter weather event listener
    if (filterWeatherForm) {
        filterWeatherForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const filters = {
            reading_id: document.getElementById('filter-weather-id').value,
            temperature: document.getElementById('filter-weather-temperature').value,
            rain: document.getElementById('filter-weather-rain').value,
            wind: document.getElementById('filter-weather-wind').value,
            datetime: document.getElementById('filter-weather-date').value,
            location: document.getElementById('filter-weather-location').value,
            notes: document.getElementById('filter-weather-notes').value
            };
            Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
            });
            bootstrap.Modal.getInstance(document.getElementById('filterWeatherModal')).hide();
            loadWeather(filters);
        });
    }

    // filter users event listener
    if (filterUsersForm) {
        filterUsersForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const filters = {
                name: document.getElementById('filter-user-name').value,
                email: document.getElementById('filter-user-email').value,
                role: document.getElementById('filter-user-role').value
            };
            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });
            bootstrap.Modal.getInstance(document.getElementById('filterUsersModal')).hide();
            loadUsers(filters);
        });
    }

    // filter requests event listener
    if (filterRequestsForm) {
        filterRequestsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const filters = {
                driver: document.getElementById('filter-request-driver').value,
                category: document.getElementById('filter-request-category').value,
                status: document.getElementById('filter-request-status').value
            };
            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });
            bootstrap.Modal.getInstance(document.getElementById('filterRequestsModal')).hide();
            loadAdminRequests(filters);
        });
    }
}