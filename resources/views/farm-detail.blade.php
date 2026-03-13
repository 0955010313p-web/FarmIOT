@extends('layouts.app')

@section('title', 'Farm Details')

@section('page-title')
    <a href="{{ route('farms') }}" class="text-blue-500 hover:underline">My Farms</a> / {{ $farm->name }}
@endsection

@section('content')
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

    {{-- Add New Device Form --}}
    <div class="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Add a New Device</h3>
        <form id="add-device-form">
            <div class="mb-4">
                <label for="device-name" class="block text-sm font-medium text-gray-400 mb-1">Device Name</label>
                <input type="text" id="device-name" name="name" class="w-full bg-gray-900 text-white rounded-md p-2 border border-gray-700 focus:ring-blue-500 focus:border-blue-500" required>
            </div>
            <div class="mb-4">
                <label for="device-type" class="block text-sm font-medium text-gray-400 mb-1">Device Type</label>
                <select id="device-type" name="type" class="w-full bg-gray-900 text-white rounded-md p-2 border border-gray-700 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Sensor">Sensor</option>
                    <option value="Actuator">Actuator</option>
                </select>
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">Add Device</button>
        </form>
    </div>

    {{-- Device List --}}
    <div class="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Devices in {{ $farm->name }}</h3>
        <div id="device-list" class="space-y-4">
            {{-- Device items will be injected here by JavaScript --}}
            <p id="loading-devices" class="text-gray-400">Loading devices...</p>
        </div>
    </div>

</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {

    const deviceList = document.getElementById('device-list');
    const addDeviceForm = document.getElementById('add-device-form');
    const loadingDevicesMessage = document.getElementById('loading-devices');
    const farmId = {{ $farm->id }};

    // Function to render devices
    const renderDevices = (devices) => {
        deviceList.innerHTML = ''; // Clear existing list
        if (devices.length === 0) {
            deviceList.innerHTML = `<p class="text-gray-400">This farm has no devices yet.</p>`;
            return;
        }

        devices.forEach(device => {
            const deviceElement = document.createElement('div');
            deviceElement.className = 'bg-gray-700 p-4 rounded-md flex justify-between items-center';
            deviceElement.innerHTML = `
                <div>
                    <p class="font-semibold">${device.name} <span class="text-xs px-2 py-1 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}">${device.status}</span></p>
                    <p class="text-sm text-gray-400">Type: ${device.type}</p>
                </div>
                <div>
                    <button class="text-red-500 hover:text-red-700" onclick="deleteDevice(${device.id})">Delete</button>
                </div>
            `;
            deviceList.appendChild(deviceElement);
        });
    };

    // Function to fetch devices
    const fetchDevices = async () => {
        try {
            const response = await axios.get(`/api/farms/${farmId}/devices`);
            renderDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
            loadingDevicesMessage.textContent = 'Failed to load devices.';
            if(error.response && error.response.status === 401) {
                 window.location.href = '/login';
            }
        }
    };

    // Function to add a new device
    addDeviceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = e.target.elements.name.value;
        const type = e.target.elements.type.value;

        try {
            await axios.post(`/api/farms/${farmId}/devices`, { name, type });
            fetchDevices(); // Re-fetch and render all devices
            addDeviceForm.reset(); // Clear the form
        } catch (error) {
            console.error('Error adding device:', error);
            alert('Could not add device. Please check the details and try again.');
        }
    });

    // Function to delete a device
    window.deleteDevice = async (id) => {
        if (!confirm('Are you sure you want to delete this device?')) {
            return;
        }

        try {
            await axios.delete(`/api/devices/${id}`);
            fetchDevices(); // Re-fetch and render devices
        } catch (error) {
            console.error(`Error deleting device ${id}:`, error);
            alert('Could not delete the device.');
        }
    };

    // Initial fetch of devices
    fetchDevices();
});
</script>
@endpush
