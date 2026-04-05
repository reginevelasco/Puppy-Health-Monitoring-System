// Detect if running on a different port (e.g. Live Server) and point to 3000
const BASE_URL = window.location.port !== '3000' && window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : '';

const API_URL = `${BASE_URL}/api`;

const handleResponse = async (response, errorMsg) => {
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || errorMsg);
    }
    return response.json();
};

export const api = {
    async getOwners() { return handleResponse(await fetch(`${API_URL}/owners`), 'Failed to fetch owners'); },
    async getPuppies() { return handleResponse(await fetch(`${API_URL}/puppies`), 'Failed to fetch puppies'); },
    async getPuppyById(id) { return handleResponse(await fetch(`${API_URL}/puppies/${id}`), 'Failed to fetch puppy'); },
    async createPuppy(data) { return handleResponse(await fetch(`${API_URL}/puppies`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to create puppy'); },
    async updatePuppy(id, data) { return handleResponse(await fetch(`${API_URL}/puppies/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to update puppy'); },
    async deletePuppy(id) { return handleResponse(await fetch(`${API_URL}/puppies/${id}`, { method: 'DELETE' }), 'Failed to delete puppy'); },

    // Health Records
    async getHealthRecords(puppyId) { return handleResponse(await fetch(`${API_URL}/health-records/puppy/${puppyId}`), 'Failed to fetch health records'); },
    async createHealthRecord(data) { return handleResponse(await fetch(`${API_URL}/health-records`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to create health record'); },
    async updateHealthRecord(id, data) { return handleResponse(await fetch(`${API_URL}/health-records/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to update health record'); },
    async deleteHealthRecord(id) { return handleResponse(await fetch(`${API_URL}/health-records/${id}`, { method: 'DELETE' }), 'Failed to delete health record'); },

    // Vaccinations
    async getVaccinations(puppyId) { return handleResponse(await fetch(`${API_URL}/vaccinations/puppy/${puppyId}`), 'Failed to fetch vaccinations'); },
    async createVaccination(data) { return handleResponse(await fetch(`${API_URL}/vaccinations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to create vaccination'); },
    async updateVaccination(id, data) { return handleResponse(await fetch(`${API_URL}/vaccinations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to update vaccination'); },
    async deleteVaccination(id) { return handleResponse(await fetch(`${API_URL}/vaccinations/${id}`, { method: 'DELETE' }), 'Failed to delete vaccination'); },

    // Growth
    async getGrowth(puppyId) { return handleResponse(await fetch(`${API_URL}/growth-tracking/puppy/${puppyId}`), 'Failed to fetch growth records'); },
    async createGrowth(data) { return handleResponse(await fetch(`${API_URL}/growth-tracking`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to create growth record'); },
    async updateGrowth(id, data) { return handleResponse(await fetch(`${API_URL}/growth-tracking/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to update growth record'); },
    async deleteGrowth(id) { return handleResponse(await fetch(`${API_URL}/growth-tracking/${id}`, { method: 'DELETE' }), 'Failed to delete growth record'); },

    // Medications
    async getMedications(puppyId) { return handleResponse(await fetch(`${API_URL}/medications/puppy/${puppyId}`), 'Failed to fetch medications'); },
    async createMedication(data) { return handleResponse(await fetch(`${API_URL}/medications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to create medication'); },
    async updateMedication(id, data) { return handleResponse(await fetch(`${API_URL}/medications/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to update medication'); },
    async deleteMedication(id) { return handleResponse(await fetch(`${API_URL}/medications/${id}`, { method: 'DELETE' }), 'Failed to delete medication'); },

    // Vet Visits
    async getVetVisits(puppyId) { return handleResponse(await fetch(`${API_URL}/vet-visits/puppy/${puppyId}`), 'Failed to fetch vet visits'); },
    async createVetVisit(data) { return handleResponse(await fetch(`${API_URL}/vet-visits`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to create vet visit'); },
    async updateVetVisit(id, data) { return handleResponse(await fetch(`${API_URL}/vet-visits/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to update vet visit'); },
    async deleteVetVisit(id) { return handleResponse(await fetch(`${API_URL}/vet-visits/${id}`, { method: 'DELETE' }), 'Failed to delete vet visit'); },

    // Alerts
    async getAlerts(puppyId) { return handleResponse(await fetch(`${API_URL}/alerts/puppy/${puppyId}`), 'Failed to fetch alerts'); },
    async createAlert(data) { return handleResponse(await fetch(`${API_URL}/alerts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), 'Failed to create alert'); },
    async deleteAlert(id) { return handleResponse(await fetch(`${API_URL}/alerts/${id}`, { method: 'DELETE' }), 'Failed to delete alert'); }
};
