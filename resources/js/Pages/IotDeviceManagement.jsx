import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import apiClient from '@/apiClient';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function IotDeviceManagement({ auth }) {
    const [devices, setDevices] = useState([]);
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', currentDevice: null });
    const [formData, setFormData] = useState({ name: '', type: '', farm_id: '' });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function fetchData() {
        setLoading(true);
        setError(null);
        try {
            const [devicesResponse, farmsResponse] = await Promise.all([
                apiClient.get('/iot-devices'),
                apiClient.get('/farms') 
            ]);
            setDevices(devicesResponse.data.data);
            setFarms(farmsResponse.data.data);
            // Set default farm_id for new devices if farms exist
            if (farmsResponse.data.data.length > 0) {
                setFormData(prev => ({ ...prev, farm_id: farmsResponse.data.data[0].id }));
            }
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (mode = 'add', device = null) => {
        setModalState({ isOpen: true, mode, currentDevice: device });
        if (device) {
            setFormData({ name: device.name, type: device.type, farm_id: device.farm_id });
        } else {
            setFormData({ name: '', type: '', farm_id: farms.length > 0 ? farms[0].id : '' });
        }
        setFormErrors({});
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: 'add', currentDevice: null });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getFarmName = (farmId) => {
        const farm = farms.find(f => f.id === farmId);
        return farm ? farm.name : 'N/A';
    };

    const submit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormErrors({});
        setError(null);

        const isEditing = modalState.mode === 'edit';
        const url = isEditing ? `/iot-devices/${modalState.currentDevice.id}` : '/iot-devices';
        const method = isEditing ? 'put' : 'post';

        try {
            await apiClient[method](url, formData);
            closeModal();
            fetchData(); // Refetch all data
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setFormErrors(err.response.data.errors);
            } else {
                setError(`An unexpected error occurred while ${isEditing ? 'updating' : 'saving'} the device.`);
            }
            console.error("API submission error", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (deviceId) => {
        if (window.confirm('Are you sure you want to delete this device?')) {
            try {
                await apiClient.delete(`/iot-devices/${deviceId}`);
                fetchData();
            } catch (err) {
                setError('Failed to delete the device.');
                console.error('Delete error', err);
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">IoT Device Management</h2>}
        >
            <Head title="IoT Device Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                     <div className="flex justify-end mb-4">
                        <PrimaryButton onClick={() => openModal('add')}>Add Device</PrimaryButton>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {loading && <p>Loading data...</p>}
                            {error && <p className="text-red-500 py-2">{error}</p>}
                            {!loading && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Device Name</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Farm</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {devices.length > 0 ? devices.map((device) => (
                                                <tr key={device.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{device.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{device.type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{getFarmName(device.farm_id)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button onClick={() => openModal('edit', device)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                                                        <button onClick={() => handleDelete(device.id)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No IoT devices found. Click "Add Device" to get started.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={modalState.isOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6 dark:bg-gray-800">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{modalState.mode === 'edit' ? 'Edit Device' : 'Add a New Device'}</h2>
                    
                    <div className="mt-4">
                        <InputLabel htmlFor="name" value="Device Name" />
                        <TextInput id="name" name="name" value={formData.name} className="mt-1 block w-full" autoComplete="off" isFocused={true} onChange={handleFormChange} required />
                        {formErrors.name && <InputError message={formErrors.name[0]} className="mt-2" />}
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="type" value="Device Type" />
                        <TextInput id="type" name="type" value={formData.type} className="mt-1 block w-full" autoComplete="off" onChange={handleFormChange} required />
                        {formErrors.type && <InputError message={formErrors.type[0]} className="mt-2" />}
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="farm_id" value="Farm" />
                        <select id="farm_id" name="farm_id" value={formData.farm_id} onChange={handleFormChange} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm" required>
                            {farms.length > 0 ? (
                                farms.map(farm => (
                                    <option key={farm.id} value={farm.id}>{farm.name}</option>
                                ))
                            ) : (
                                <option value="" disabled>No farms available. Please create a farm first.</option>
                            )}
                        </select>
                        {formErrors.farm_id && <InputError message={formErrors.farm_id[0]} className="mt-2" />}
                    </div>

                    <div className="mt-6 flex justify-end items-center">
                        <SecondaryButton type="button" onClick={closeModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={isSubmitting || (farms.length === 0 && modalState.mode === 'add')}>{isSubmitting ? 'Saving...' : 'Save Device'}</PrimaryButton>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
