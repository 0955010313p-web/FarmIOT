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

export default function FarmManagement({ auth }) {
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', currentFarm: null });

    const [formData, setFormData] = useState({ name: '', description: '' });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchFarms = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/farms');
            setFarms(response.data.data);
        } catch (err) {
            setError('Failed to fetch farms.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarms();
    }, []);

    const openModal = (mode = 'add', farm = null) => {
        setModalState({ isOpen: true, mode, currentFarm: farm });
        setFormData(farm ? { name: farm.name, description: farm.description } : { name: '', description: '' });
        setFormErrors({});
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: 'add', currentFarm: null });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormErrors({});
        setError(null);

        const isEditing = modalState.mode === 'edit';
        const url = isEditing ? `/farms/${modalState.currentFarm.id}` : '/farms';
        const method = isEditing ? 'put' : 'post';

        try {
            await apiClient[method](url, formData);
            closeModal();
            fetchFarms();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setFormErrors(err.response.data.errors);
            } else {
                setError(`An unexpected error occurred while ${isEditing ? 'updating' : 'saving'} the farm.`);
            }
            console.error("API submission error", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (farmId) => {
        if (window.confirm('Are you sure you want to delete this farm? This action cannot be undone.')) {
            try {
                await apiClient.delete(`/farms/${farmId}`);
                fetchFarms();
            } catch (err) {
                setError('Failed to delete the farm.');
                console.error('Delete error', err);
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Farm Management</h2>}
        >
            <Head title="Farm Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-4">
                        <PrimaryButton onClick={() => openModal('add')}>Add Farm</PrimaryButton>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {loading && <p>Loading farms...</p>}
                            {error && <p className="text-red-500 py-2">{error}</p>}
                            {!loading && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {farms.length > 0 ? farms.map((farm) => (
                                                <tr key={farm.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{farm.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{farm.description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button onClick={() => openModal('edit', farm)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                                                        <button onClick={() => handleDelete(farm.id)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No farms found. Click "Add Farm" to get started.</td>
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
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {modalState.mode === 'edit' ? 'Edit Farm' : 'Add a New Farm'}
                    </h2>
                    <div className="mt-4">
                        <InputLabel htmlFor="name" value="Farm Name" />
                        <TextInput id="name" name="name" value={formData.name} className="mt-1 block w-full" autoComplete="off" isFocused={true} onChange={handleFormChange} required />
                        {formErrors.name && <InputError message={formErrors.name[0]} className="mt-2" />}
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Description" />
                        <TextInput id="description" name="description" value={formData.description} className="mt-1 block w-full" autoComplete="off" onChange={handleFormChange} />
                         {formErrors.description && <InputError message={formErrors.description[0]} className="mt-2" />}
                    </div>
                    <div className="mt-6 flex justify-end items-center">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Farm'}</PrimaryButton>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
