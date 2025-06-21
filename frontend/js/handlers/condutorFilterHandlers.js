import { loadCondutorTrips, loadCondutorRequests, getUserIdFromToken } from '../loaders/condutorApiLoaders.js';

export function setupCondutorFilterHandlers() {
    const driverId = getUserIdFromToken();
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
            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });
            bootstrap.Modal.getInstance(document.getElementById('filterTripsModal')).hide();
            loadCondutorTrips(filters);
        });
    }    
}