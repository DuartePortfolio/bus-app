import { loadTrips, loadRoutes, loadStops, loadVehicles, loadAltTrajectories, loadWeather, loadUsers, loadAdminRequests } from '../loaders/apiLoaders.js';

const addTripForm = document.querySelector('.viagem-form');
// const addRouteForm = document.querySelector('.rota-form');
const addStopForm = document.querySelector('.paragem-form');
const addVehicleForm = document.querySelector('.veiculo-form');
const addAltTrajectoryForm = document.querySelector('.trajetoria-alternativa-form');
const addWeatherForm = document.querySelector('.meteorologia-form');
const addUserForm = document.querySelector('.utilizador-form');


export function setupFormHandlers() {
    // event listener for rotes edit form submission
    document.getElementById('admin-trip-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            const id = document.getElementById('admin-trip-id').value;
            const time = document.getElementById('admin-trip-time').value;
            const route_id = document.getElementById('admin-trip-route').value;
            const vehicle = document.getElementById('admin-trip-vehicle').value;
            const driver = document.getElementById('admin-trip-driver').value;
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:3000/api/trips/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ route_id, vehicle, driver, time })
                });
                
                if (res.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('adminTripModal')).hide();
                    loadTrips();
                } else {
                    const error = await res.json();
                    alert(error.error || 'Error updating stop');
                }
            } catch (err) {
                alert('Internal server error');
            }
    });
    // event listener for rotes edit form submission
    document.getElementById('admin-route-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            const id = document.getElementById('admin-route-id').value;
            const route_name = document.getElementById('admin-route-name').value;
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:3000/api/routes/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ route_name })
                });
                
                if (res.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('adminRouteModal')).hide();
                    loadRoutes();
                } else {
                    const error = await res.json();
                    alert(error.error || 'Error updating stop');
                }
            } catch (err) {
                alert('Internal server error');
            }
    });
    // event listener for stops edit form submission
    document.getElementById('admin-stop-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            const id = document.getElementById('admin-stop-id').value;
            const stop_name = document.getElementById('admin-stop-name').value;
            
            const latitude = document.getElementById('admin-stop-latitude').value;
            const longitude = document.getElementById('admin-stop-longitude').value;
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:3000/api/stops/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ stop_name, latitude, longitude })
                });
                console.log({ stop_name, latitude, longitude });
                
                if (res.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('adminStopModal')).hide();
                    loadStops();
                } else {
                    const error = await res.json();
                    alert(error.error || 'Error updating stop');
                }
            } catch (err) {
                alert('Internal server error');
            }
    });
    // event listener for vehicle edit form submission
    document.getElementById('admin-vehicle-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            const id = document.getElementById('admin-vehicle-id').value;
            const plate = document.getElementById('admin-vehicle-plate').value;
            const capacity = document.getElementById('admin-vehicle-capacity').value;
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:3000/api/vehicles/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ plate, capacity })
                });
                
                if (res.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('adminVehicleModal')).hide();
                    loadVehicles();
                } else {
                    const error = await res.json();
                    alert(error.error || 'Error updating user');
                }
            } catch (err) {
                alert('Internal server error');
            }
    });
// event listener for alternative trajectory edit form submission
// nao funciona por alguma razao
    document.getElementById('admin-altTraj-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            const id = document.getElementById('admin-altTraj-id').value;
            const stop1 = document.getElementById('admin-altTraj-stop1').value;
            const stop2 = document.getElementById('admin-altTraj-stop2').value;
            const description = document.getElementById('admin-altTraj-name').value;
            
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:3000/api/alternative_trajectories/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ stop1, stop2, description })
                });
                
                if (res.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('adminAltTrajModal')).hide();
                    loadAltTrajectories();
                } else {
                    const error = await res.json();
                    alert(error.error || 'Error updating user');
                }
            } catch (err) {
                alert('Internal server error');
            }
    });
    // event listener for weather edit form submission
    document.getElementById('admin-weather-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            const id = document.getElementById('admin-weather-id').value;
            const temperature = document.getElementById('admin-weather-temperature').value;
            const rain = document.getElementById('admin-weather-rain').value;
            const wind = document.getElementById('admin-weather-wind').value;
            const location = document.getElementById('admin-weather-location').value;
            const notes = document.getElementById('admin-weather-notes').value;
            const datetime = document.getElementById('admin-weather-datetime').value;
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:3000/api/weather/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ temperature, rain, wind, location, notes, datetime })
                });
                if (res.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('adminWeatherModal')).hide();
                    loadWeather();
                } else {
                    const error = await res.json();
                    alert(error.error || 'Error updating user');
                }
            } catch (err) {
                alert('Internal server error');
            }
    });
    // event listener for user edit form submission
    document.getElementById('admin-user-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            const id = document.getElementById('admin-user-id').value;
            const name = document.getElementById('admin-user-name').value;
            const email = document.getElementById('admin-user-email').value;
            const role = document.getElementById('admin-user-role').value;
            const contact = document.getElementById('admin-user-contact').value;
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:3000/api/users/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, email, role, contact })
                });
                if (res.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('adminUserModal')).hide();
                    loadUsers();
                } else {
                    const error = await res.json();
                    alert(error.error || 'Error updating user');
                }
            } catch (err) {
                alert('Internal server error');
            }
    });
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