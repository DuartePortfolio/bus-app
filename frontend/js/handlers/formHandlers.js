import { loadTrips, loadRoutes, loadStops, loadVehicles, loadAltTrajectories, loadWeather, loadUsers, loadAdminRequests } from '../loaders/apiLoaders.js';

const addTripForm = document.querySelector('.viagem-form');
// const addRouteForm = document.querySelector('.rota-form');
const addStopForm = document.querySelector('.paragem-form');
const addVehicleForm = document.querySelector('.veiculo-form');
const addAltTrajectoryForm = document.querySelector('.trajetoria-alternativa-form');
const addWeatherForm = document.querySelector('.meteorologia-form');
const addUserForm = document.querySelector('.utilizador-form');


export function setupFormHandlers() {


    // event listener for request edit form submission
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


    // add trip form even listener
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

    // add route form event listener
    /* addRouteForm.addEventListener('submit', async (e) => {
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
    }); */

    // add stop form event listener
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

    // add vehicle form event listener
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

    // add alternative trajectory form event listener
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

    // add weather register form event listener
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

    // add user form event listener
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

}