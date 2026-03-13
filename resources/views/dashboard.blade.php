@extends('layouts.app')

@section('title', 'Dashboard')
@section('page-title', 'My Dashboard')

@section('content')
<div class="dashboard-container">

    <!-- Main Header -->
    <div class="dashboard-header">
        <h2 class="dashboard-title">Smart Farm IoT Dashboard</h2>
        <p class="dashboard-subtitle">Real-time monitoring and control of your farm's devices.</p>
    </div>

    <!-- Section: Farm Overview -->
    <div class="section-header">
        <h3>Farm Overview</h3>
    </div>
    <div class="grid-container-4-col">
        <!-- Stat Card: Total Devices -->
        <div class="stat-card">
            <div class="card-icon icon-bg-gray">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.87H8.25a3.375 3.375 0 00-3.285 2.87l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008z" /></svg>
            </div>
            <div class="card-content">
                <p class="card-title">Total Devices</p>
                <p id="total-devices-metric" class="card-metric">-</p>
            </div>
        </div>

        <!-- Stat Card: Devices Online -->
        <div class="stat-card">
            <div class="card-icon icon-bg-green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.136 12.006a8.25 8.25 0 0113.728 0M2.01 8.974a11.25 11.25 0 0119.98 0M12 21.75c-2.485 0-4.5-4.03-4.5-9S9.515 3.75 12 3.75s4.5 4.03 4.5 9-2.015 9-4.5 9z" /></svg>
            </div>
            <div class="card-content">
                <p class="card-title">Devices Online</p>
                <p id="devices-online-metric" class="card-metric">-</p>
            </div>
        </div>

        <!-- Stat Card: Alerts -->
        <div class="stat-card">
            <div class="card-icon icon-bg-yellow">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
            </div>
            <div class="card-content">
                <p class="card-title">Alerts</p>
                <p id="alerts-metric" class="card-metric">-</p>
            </div>
        </div>

        <!-- Stat Card: Devices Offline -->
        <div class="stat-card">
            <div class="card-icon icon-bg-red">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.75c-2.485 0-4.5-4.03-4.5-9S9.515 3.75 12 3.75s4.5 4.03 4.5 9-2.015 9-4.5 9zm-2.625-8.625a.75.75 0 011.06-1.06L12 11.44l1.565-1.566a.75.75 0 111.06 1.06L13.06 12l1.566 1.565a.75.75 0 11-1.06 1.06L12 12.56l-1.565 1.565a.75.75 0 01-1.06-1.06L10.94 12 9.375 10.375z" /></svg>
            </div>
            <div class="card-content">
                <p class="card-title">Devices Offline</p>
                <p id="devices-offline-metric" class="card-metric">-</p>
            </div>
        </div>
    </div>

    <!-- Section: Device Control -->
    <div class="section-header">
        <h3>Device Control</h3>
    </div>
    <div class="grid-container-4-col">
        <!-- Control Card: Temperature -->
        <div class="control-card temp-card">
            <p class="card-title">Greenhouse Temp</p>
            <p id="temperature-reading" class="temp-reading">-<span class="degree">&deg;C</span></p>
            <p class="card-subtitle">Last updated: just now</p>
        </div>

        <!-- Control Card: Water Pump -->
        <div class="control-card action-card">
            <p class="card-title">Main Water Pump</p>
            <button id="water-pump-button" class="control-button">-</button>
            <p id="water-pump-status" class="card-subtitle">Status: -</p>
        </div>

        <!-- Control Card: Lights -->
        <div class="control-card action-card">
            <p class="card-title">Lighting System</p>
            <button id="lighting-system-button" class="control-button">-</button>
            <p id="lighting-system-status" class="card-subtitle">Status: -</p>
        </div>

        <!-- Control Card: Add New Device -->
        <div id="add-new-device-card" class="control-card add-new-card">
             <div class="add-new-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </div>
            <p class="add-new-text">Add New Device</p>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Fetch and Display Dynamic Stats ---
    const authToken = localStorage.getItem('auth_token');

    if (authToken) {
        axios.get('/api/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': 'application/json',
            }
        })
        .then(response => {
            const stats = response.data;
            
            // Update Stat Cards
            document.getElementById('total-devices-metric').textContent = stats.totalDevices;
            document.getElementById('devices-online-metric').textContent = stats.devicesOnline;
            document.getElementById('alerts-metric').textContent = stats.alerts;
            document.getElementById('devices-offline-metric').textContent = stats.devicesOffline;
            
            // Update Temperature Card
            document.getElementById('temperature-reading').innerHTML = `${Math.round(stats.greenhouseTemp)}<span class="degree">&deg;C</span>`;

            // Update Control Card initial states
            updateControl('water-pump', stats.waterPumpStatus);
            updateControl('lighting-system', stats.lightingStatus);
        })
        .catch(error => {
            console.error('Failed to fetch dashboard stats:', error);
            if (error.response && error.response.status === 401) {
                // Token might be expired or invalid, redirect to login
                window.location.href = '/login';
            }
        });
    } else {
        // If no token, redirect to login page
        console.log('No auth token found, redirecting to login.');
        window.location.href = '/login';
    }

    // --- 2. Make Controls Interactive ---
    const waterPumpBtn = document.getElementById('water-pump-button');
    const lightingSystemBtn = document.getElementById('lighting-system-button');
    const addNewDeviceCard = document.getElementById('add-new-device-card');

    waterPumpBtn.addEventListener('click', () => {
        const currentStatus = waterPumpBtn.textContent.trim();
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        updateControl('water-pump', newStatus);
        // In a real app, you would make an API call here to update the device state.
        console.log(`Water pump toggled to ${newStatus}`);
    });

    lightingSystemBtn.addEventListener('click', () => {
        const currentStatus = lightingSystemBtn.textContent.trim();
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        updateControl('lighting-system', newStatus);
        console.log(`Lighting system toggled to ${newStatus}`);
    });
    
    addNewDeviceCard.addEventListener('click', () => {
        alert('Feature in development: This will open a modal to add a new IoT device.');
    });

    // --- 3. Helper Function ---
    function updateControl(controlId, status) {
        const button = document.getElementById(`${controlId}-button`);
        const statusText = document.getElementById(`${controlId}-status`);

        if (button && statusText) {
            const upperStatus = status.toUpperCase();
            button.textContent = upperStatus;
            statusText.textContent = `Status: ${upperStatus === 'ON' ? 'Active' : 'Inactive'}`;
            
            if (upperStatus === 'ON') {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    }
});
</script>
@endpush
