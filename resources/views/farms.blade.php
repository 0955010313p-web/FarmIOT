@extends('layouts.app')

@section('title', 'My Farms')

@section('page-title', 'Farm Management')

@section('content')
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

    {{-- Add New Farm Form --}}
    <div class="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Add a New Farm</h3>
        <form id="add-farm-form">
            <div class="mb-4">
                <label for="farm-name" class="block text-sm font-medium text-gray-400 mb-1">Farm Name</label>
                <input type="text" id="farm-name" name="name" class="w-full bg-gray-900 text-white rounded-md p-2 border border-gray-700 focus:ring-blue-500 focus:border-blue-500" required>
            </div>
            <div class="mb-4">
                <label for="farm-location" class="block text-sm font-medium text-gray-400 mb-1">Location (Optional)</label>
                <input type="text" id="farm-location" name="location" class="w-full bg-gray-900 text-white rounded-md p-2 border border-gray-700 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">Add Farm</button>
        </form>
    </div>

    {{-- Farm List --}}
    <div class="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Your Farms</h3>
        <div id="farm-list" class="space-y-4">
            {{-- Farm items will be injected here by JavaScript --}}
            <p id="loading-farms" class="text-gray-400">Loading farms...</p>
        </div>
    </div>

</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {

    const farmList = document.getElementById('farm-list');
    const addFarmForm = document.getElementById('add-farm-form');
    const loadingFarmsMessage = document.getElementById('loading-farms');

    // Function to render farms
    const renderFarms = (farms) => {
        farmList.innerHTML = ''; // Clear existing list
        if (farms.length === 0) {
            farmList.innerHTML = `<p class="text-gray-400">You haven't added any farms yet.</p>`;
            return;
        }

        farms.forEach(farm => {
            const farmElement = document.createElement('div');
            farmElement.className = 'bg-gray-700 p-4 rounded-md flex justify-between items-center';
            farmElement.innerHTML = `
                <a href="/farms/${farm.id}" class="flex-grow">
                    <p class="font-semibold">${farm.name}</p>
                    <p class="text-sm text-gray-400">${farm.location || 'No location specified'}</p>
                </a>
                <div>
                    <button class="text-red-500 hover:text-red-700" onclick="deleteFarm(event, ${farm.id})">Delete</button>
                </div>
            `;
            farmList.appendChild(farmElement);
        });
    };

    // Function to fetch farms
    const fetchFarms = async () => {
        try {
            const response = await axios.get('/api/farms');
            renderFarms(response.data);
        } catch (error) {
            console.error('Error fetching farms:', error);
            loadingFarmsMessage.textContent = 'Failed to load farms.';
            if(error.response && error.response.status === 401) {
                 window.location.href = '/login';
            }
        }
    };

    // Function to add a new farm
    addFarmForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = e.target.elements.name.value;
        const location = e.target.elements.location.value;

        try {
            const response = await axios.post('/api/farms', { name, location });
            fetchFarms(); // Re-fetch and render all farms
            addFarmForm.reset(); // Clear the form
        } catch (error) {
            console.error('Error adding farm:', error);
            alert('Could not add farm. Please check the details and try again.');
        }
    });

    // Function to delete a farm
    window.deleteFarm = async (e, id) => {
        e.stopPropagation(); // Prevent the click from navigating to the farm detail page
        e.preventDefault();

        if (!confirm('Are you sure you want to delete this farm?')) {
            return;
        }

        try {
            await axios.delete(`/api/farms/${id}`);
            fetchFarms(); // Re-fetch and render farms
        } catch (error) {
            console.error(`Error deleting farm ${id}:`, error);
            alert('Could not delete the farm.');
        }
    };

    // Initial fetch of farms
    fetchFarms();
});
</script>
@endpush
