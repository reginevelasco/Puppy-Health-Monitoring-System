import { api } from './api.js';

const puppyList = document.getElementById('puppy-list');
const puppyListSection = document.getElementById('puppy-list-section');
const puppyDetailSection = document.getElementById('puppy-detail-section');
const puppyDetailContent = document.getElementById('puppy-detail-content');
const backToListBtn = document.getElementById('back-to-list');
const addPuppyBtn = document.getElementById('add-puppy-btn');
const puppyModal = document.getElementById('puppy-modal');
const puppyForm = document.getElementById('puppy-form');

async function init() {
    loadPuppies();
    addPuppyBtn.classList.add('btn', 'btn-primary');
    backToListBtn.classList.add('btn', 'btn-primary');
    addPuppyBtn.addEventListener('click', () => {
        document.getElementById('modal-title').innerText = 'Add New Puppy';
        puppyForm.reset(); document.getElementById('puppy-id').value = ''; puppyModal.classList.remove('hidden');
    });
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const performSearch = () => loadPuppies(searchInput.value.toLowerCase());
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') performSearch(); if (searchInput.value === '') loadPuppies(); });
    document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', () => btn.closest('.modal').classList.add('hidden')));
    backToListBtn.addEventListener('click', () => { puppyDetailSection.classList.add('hidden'); puppyListSection.classList.remove('hidden'); });
    puppyForm.addEventListener('submit', handleFormSubmit);
    document.getElementById('health-form').addEventListener('submit', handleHealthSubmit);
    document.getElementById('vaccination-form').addEventListener('submit', handleVaccinationSubmit);
    document.getElementById('growth-form').addEventListener('submit', handleGrowthSubmit);
    document.getElementById('medication-form').addEventListener('submit', handleMedicationSubmit);
    document.getElementById('vet-form').addEventListener('submit', handleVetSubmit);
    document.getElementById('alert-form').addEventListener('submit', handleAlertSubmit);
}

async function loadPuppies(query = '') {
    try {
        let puppies = await api.getPuppies();
        if (query) puppies = puppies.filter(p => p.name.toLowerCase().includes(query) || (p.breed && p.breed.toLowerCase().includes(query)));
        puppyList.innerHTML = '';
        if (puppies.length === 0) { puppyList.innerHTML = query ? `<p>No puppies found matching "${query}"</p>` : '<p>No puppies found.</p>'; return; }
        puppies.forEach(puppy => {
            const card = document.createElement('div'); card.className = 'puppy-card';
            card.innerHTML = `<h3>${puppy.name}</h3><p>Breed: ${puppy.breed || 'Unknown'}</p><p>Age: ${calculateAge(puppy.birth_date)}</p><p>Weight: ${puppy.weight || 'N/A'} kg</p>`;
            card.addEventListener('click', () => showPuppyDetail(puppy.puppy_id)); puppyList.appendChild(card);
        });
    } catch (err) { console.error(err); }
}

async function showPuppyDetail(id) {
    try {
        const [puppy, health, vaccs, growth, meds, visits, alerts] = await Promise.all([
            api.getPuppyById(id), api.getHealthRecords(id), api.getVaccinations(id),
            api.getGrowth(id), api.getMedications(id), api.getVetVisits(id), api.getAlerts(id)
        ]);
        puppyListSection.classList.add('hidden'); puppyDetailSection.classList.remove('hidden');
        puppyDetailContent.innerHTML = `
            <div class="detail-view-container">
                <div class="detail-header">
                    <h2>${puppy.name}</h2>
                    <div style="display:flex; gap:10px;">
                        <button onclick="editPuppy(${puppy.puppy_id})" class="btn btn-primary">Edit</button>
                        <button onclick="deletePuppy(${puppy.puppy_id})" class="btn btn-danger">Delete</button>
                        <button onclick="openAlertModal(${puppy.puppy_id})" class="btn btn-accent">Add Alert</button>
                    </div>
                </div>
                <div class="alert-section">${renderAlerts(alerts, id)}</div>
                <div class="info-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top:20px;">
                    <div class="section-card"><h3>General Info</h3><p>Breed: ${puppy.breed}</p><p>Gender: ${puppy.gender}</p><p>Birth Date: ${new Date(puppy.birth_date).toLocaleDateString()}</p><p>Color: ${puppy.color}</p></div>
                    <div class="section-card"><h3>Growth & Health</h3><p>Current Weight: ${puppy.weight} kg</p><div style="margin-top:1rem; display:flex; gap:5px;"><button onclick="openGrowthModal(${puppy.puppy_id})" class="btn btn-secondary">Add Growth</button><button onclick="openHealthModal(${puppy.puppy_id})" class="btn btn-secondary">Add Health</button></div></div>
                </div>
                <div class="health-tabs">
                    <div class="section-card"><h3>Medications <button onclick="openMedModal(${puppy.puppy_id})" class="btn btn-secondary" style="padding:4px 8px;">Add</button></h3>${renderMedications(meds)}</div>
                    <div class="section-card"><h3>Vaccinations <button onclick="openVaccModal(${puppy.puppy_id})" class="btn btn-secondary" style="padding:4px 8px;">Add</button></h3>${renderVaccinations(vaccs)}</div>
                    <div class="section-card"><h3>Vet Visits <button onclick="openVetModal(${puppy.puppy_id})" class="btn btn-secondary" style="padding:4px 8px;">Add</button></h3>${renderVetVisits(visits)}</div>
                    <div class="section-card"><h3>Health History</h3>${renderHealthRecords(health)}</div>
                    <div class="section-card"><h3>Growth Logs</h3>${renderGrowth(growth)}</div>
                </div>
            </div>`;
    } catch (err) { console.error(err); }
}

function renderAlerts(alerts, puppyId) { if (!alerts || alerts.length === 0) return ''; return alerts.map(a => `<div class="alert-banner"><span><strong>[${a.type}]</strong> ${a.message}</span> <div><small>${new Date(a.alert_date).toLocaleDateString()}</small> <button onclick="deleteAlert(${a.alert_id}, ${puppyId})" style="background:transparent; border:none; color:var(--danger); cursor:pointer; margin-left:10px;"><i class="fas fa-times"></i></button></div></div>`).join(''); }

function renderMedications(meds) {
    if (!meds || meds.length === 0) return '<p>No medications.</p>';
    return meds.map(m => `<div style="background:#fff; border:1px solid #e5e7eb; padding:12px; margin-bottom:8px; border-radius:6px; border-left:4px solid var(--secondary); display:flex; justify-content:space-between; align-items:center;"><div><strong>${m.medicine_name}</strong> - ${m.dosage}<br><small>${new Date(m.start_date).toLocaleDateString()} to ${new Date(m.end_date).toLocaleDateString()}</small></div><div><button onclick="editMedication(${m.medication_id}, ${m.puppy_id})" class="btn btn-primary" style="padding:4px 8px;">Edit</button> <button onclick="deleteMedication(${m.medication_id}, ${m.puppy_id})" class="btn btn-danger" style="padding:4px 8px;">Delete</button></div></div>`).join('');
}

function renderVaccinations(vaccs) {
    if (!vaccs || vaccs.length === 0) return '<p>No vaccinations.</p>';
    return vaccs.map(v => `<div style="background:#fff; border:1px solid #e5e7eb; padding:12px; margin-bottom:8px; border-radius:6px; border-left:4px solid var(--accent); display:flex; justify-content:space-between; align-items:center;"><div><strong>${v.vaccine_name}</strong> - ${new Date(v.date_administered).toLocaleDateString()}${v.next_due_date ? `<br><small style="color:var(--danger)">Next due: ${new Date(v.next_due_date).toLocaleDateString()}</small>` : ''}</div><div><button onclick="editVaccination(${v.vaccination_id}, ${v.puppy_id})" class="btn btn-primary" style="padding:4px 8px;">Edit</button> <button onclick="deleteVaccination(${v.vaccination_id}, ${v.puppy_id})" class="btn btn-danger" style="padding:4px 8px;">Delete</button></div></div>`).join('');
}

function renderVetVisits(visits) {
    if (!visits || visits.length === 0) return '<p>No visits.</p>';
    return visits.map(v => `<div style="background:#fff; border:1px solid #e5e7eb; padding:12px; margin-bottom:8px; border-radius:6px; border-left:4px solid var(--primary); display:flex; justify-content:space-between; align-items:center;"><div><strong>${new Date(v.visit_date).toLocaleDateString()}</strong> - ${v.reason}</div><div><button onclick="editVetVisit(${v.visit_id}, ${v.puppy_id})" class="btn btn-primary" style="padding:4px 8px;">Edit</button> <button onclick="deleteVetVisit(${v.visit_id}, ${v.puppy_id})" class="btn btn-danger" style="padding:4px 8px;">Delete</button></div></div>`).join('');
}

function renderHealthRecords(recs) {
    if (!recs || recs.length === 0) return '<p>No records.</p>';
    return recs.map(r => `<div style="background:#fff; border:1px solid #e5e7eb; padding:12px; margin-bottom:8px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;"><div><strong>${new Date(r.recorded_at).toLocaleDateString()}</strong>: ${r.diagnosis || 'Checkup'}</div><div><button onclick="editHealthRecord(${r.record_id}, ${r.puppy_id})" class="btn btn-primary" style="padding:4px 8px;">Edit</button> <button onclick="deleteHealthRecord(${r.record_id}, ${r.puppy_id})" class="btn btn-danger" style="padding:4px 8px;">Delete</button></div></div>`).join('');
}

function renderGrowth(growth) {
    if (!growth || growth.length === 0) return '<p>No logs.</p>';
    return growth.map(g => `<div style="background:#fff; border:1px solid #e5e7eb; padding:12px; margin-bottom:8px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;"><span><strong>${new Date(g.recorded_at).toLocaleDateString()}</strong>: ${g.weight}kg | ${g.height}cm</span><div><button onclick="editGrowth(${g.growth_id}, ${g.puppy_id})" class="btn btn-primary" style="padding:4px 8px;">Edit</button> <button onclick="deleteGrowth(${g.growth_id}, ${g.puppy_id})" class="btn btn-danger" style="padding:4px 8px;">Delete</button></div></div>`).join('');
}

// Modals
window.openHealthModal = (puppyId) => { document.getElementById('health-puppy-id').value = puppyId; document.getElementById('health-id').value = ''; document.getElementById('health-modal-title').innerText = 'Add Health Record'; document.getElementById('health-form').reset(); document.getElementById('health-modal').classList.remove('hidden'); };
window.openVaccModal = (puppyId) => { document.getElementById('vacc-puppy-id').value = puppyId; document.getElementById('vacc-id').value = ''; document.getElementById('vacc-modal-title').innerText = 'Add Vaccination'; document.getElementById('vaccination-form').reset(); document.getElementById('vaccination-modal').classList.remove('hidden'); };
window.openGrowthModal = (puppyId) => { document.getElementById('growth-puppy-id').value = puppyId; document.getElementById('growth-id').value = ''; document.getElementById('growth-modal-title').innerText = 'Track Growth'; document.getElementById('growth-form').reset(); document.getElementById('growth-modal').classList.remove('hidden'); };
window.openMedModal = (puppyId) => { document.getElementById('med-puppy-id').value = puppyId; document.getElementById('med-id').value = ''; document.getElementById('med-modal-title').innerText = 'Add Medication'; document.getElementById('medication-form').reset(); document.getElementById('medication-modal').classList.remove('hidden'); };
window.openVetModal = (puppyId) => { document.getElementById('vet-visit-puppy-id').value = puppyId; document.getElementById('vet-id').value = ''; document.getElementById('vet-modal-title').innerText = 'Add Vet Visit'; document.getElementById('vet-form').reset(); document.getElementById('vet-modal').classList.remove('hidden'); };
window.openAlertModal = (puppyId) => { document.getElementById('alert-puppy-id').value = puppyId; document.getElementById('alert-form').reset(); document.getElementById('alert-modal').classList.remove('hidden'); };

// Handlers
async function handleHealthSubmit(e) { e.preventDefault(); const id = document.getElementById('health-id').value; const puppyId = document.getElementById('health-puppy-id').value; const data = { temperature: e.target['temperature'].value, heart_rate: e.target['heart_rate'].value, symptoms: e.target['symptoms'].value, diagnosis: e.target['diagnosis'].value, notes: e.target['health-notes'].value }; id ? await api.updateHealthRecord(id, data) : await api.createHealthRecord({ puppy_id: puppyId, ...data }); e.target.closest('.modal').classList.add('hidden'); showPuppyDetail(puppyId); }
async function handleVaccinationSubmit(e) { e.preventDefault(); const id = document.getElementById('vacc-id').value; const puppyId = document.getElementById('vacc-puppy-id').value; const data = { vaccine_name: e.target['vaccine_name'].value, date_administered: e.target['date_administered'].value, next_due_date: e.target['next_due_date'].value }; id ? await api.updateVaccination(id, data) : await api.createVaccination({ puppy_id: puppyId, ...data }); e.target.closest('.modal').classList.add('hidden'); showPuppyDetail(puppyId); }
async function handleGrowthSubmit(e) { e.preventDefault(); const id = document.getElementById('growth-id').value; const puppyId = document.getElementById('growth-puppy-id').value; const data = { weight: e.target['growth-weight'].value, height: e.target['growth-height'].value }; id ? await api.updateGrowth(id, data) : await api.createGrowth({ puppy_id: puppyId, ...data }); e.target.closest('.modal').classList.add('hidden'); showPuppyDetail(puppyId); }
async function handleMedicationSubmit(e) { e.preventDefault(); const id = document.getElementById('med-id').value; const puppyId = document.getElementById('med-puppy-id').value; const data = { medicine_name: e.target['medicine_name'].value, dosage: e.target['dosage'].value, start_date: e.target['start_date'].value, end_date: e.target['end_date'].value, instructions: e.target['med-instructions'].value }; id ? await api.updateMedication(id, data) : await api.createMedication({ puppy_id: puppyId, ...data }); e.target.closest('.modal').classList.add('hidden'); showPuppyDetail(puppyId); }
async function handleVetSubmit(e) { e.preventDefault(); const id = document.getElementById('vet-id').value; const puppyId = document.getElementById('vet-visit-puppy-id').value; const data = { visit_date: e.target['visit_date'].value, reason: e.target['visit_reason'].value, treatment: e.target['visit_treatment'].value, notes: e.target['visit-notes'].value }; id ? await api.updateVetVisit(id, data) : await api.createVetVisit({ puppy_id: puppyId, ...data }); e.target.closest('.modal').classList.add('hidden'); showPuppyDetail(puppyId); }
async function handleAlertSubmit(e) { e.preventDefault(); const puppyId = document.getElementById('alert-puppy-id').value; await api.createAlert({ puppy_id: puppyId, type: e.target['alert-type'].value, message: e.target['alert-message'].value }); e.target.closest('.modal').classList.add('hidden'); showPuppyDetail(puppyId); }

async function handleFormSubmit(e) {
    e.preventDefault(); const id = document.getElementById('puppy-id').value;
    try {
        const owners = await api.getOwners(); if (owners.length === 0) return alert('No owners found.');
        const data = { owner_id: owners[0].owner_id, name: e.target['name'].value, breed: e.target['breed'].value, gender: e.target['gender'].value, birth_date: e.target['birth_date'].value, weight: e.target['weight'].value, color: e.target['color'].value };
        id ? await api.updatePuppy(id, data) : await api.createPuppy(data);
        puppyModal.classList.add('hidden'); loadPuppies();
    } catch (err) { alert(err.message); }
}

function calculateAge(date) { if (!date) return 'Unknown'; const mos = Math.floor((new Date() - new Date(date)) / 2629800000); return mos < 1 ? 'Newborn' : mos < 12 ? `${mos} mos` : `${Math.floor(mos/12)} yrs`; }

// Global Edit/Delete Functions
window.editPuppy = async (id) => { const p = await api.getPuppyById(id); document.getElementById('modal-title').innerText = 'Edit Puppy'; document.getElementById('puppy-id').value = p.puppy_id; document.getElementById('name').value = p.name; document.getElementById('breed').value = p.breed; document.getElementById('gender').value = p.gender; document.getElementById('birth_date').value = p.birth_date.split('T')[0]; document.getElementById('weight').value = p.weight; document.getElementById('color').value = p.color; puppyModal.classList.remove('hidden'); };
window.deletePuppy = async (id) => { if (confirm('Delete puppy?')) { await api.deletePuppy(id); backToListBtn.click(); loadPuppies(); } };

window.editMedication = async (id, puppyId) => { const meds = await api.getMedications(puppyId); const m = meds.find(x => x.medication_id === id); document.getElementById('med-modal-title').innerText = 'Edit Medication'; document.getElementById('med-id').value = m.medication_id; document.getElementById('med-puppy-id').value = puppyId; document.getElementById('medicine_name').value = m.medicine_name; document.getElementById('dosage').value = m.dosage; document.getElementById('start_date').value = m.start_date.split('T')[0]; document.getElementById('end_date').value = m.end_date.split('T')[0]; document.getElementById('med-instructions').value = m.instructions; document.getElementById('medication-modal').classList.remove('hidden'); };
window.deleteMedication = async (id, puppyId) => { if (confirm('Delete medication?')) { await api.deleteMedication(id); showPuppyDetail(puppyId); } };

window.editVaccination = async (id, puppyId) => { const vaccs = await api.getVaccinations(puppyId); const v = vaccs.find(x => x.vaccination_id === id); document.getElementById('vacc-modal-title').innerText = 'Edit Vaccination'; document.getElementById('vacc-id').value = v.vaccination_id; document.getElementById('vacc-puppy-id').value = puppyId; document.getElementById('vaccine_name').value = v.vaccine_name; document.getElementById('date_administered').value = v.date_administered.split('T')[0]; document.getElementById('next_due_date').value = v.next_due_date ? v.next_due_date.split('T')[0] : ''; document.getElementById('vaccination-modal').classList.remove('hidden'); };
window.deleteVaccination = async (id, puppyId) => { if (confirm('Delete vaccination?')) { await api.deleteVaccination(id); showPuppyDetail(puppyId); } };

window.editHealthRecord = async (id, puppyId) => { const recs = await api.getHealthRecords(puppyId); const r = recs.find(x => x.record_id === id); document.getElementById('health-modal-title').innerText = 'Edit Health Record'; document.getElementById('health-id').value = r.record_id; document.getElementById('health-puppy-id').value = puppyId; document.getElementById('temperature').value = r.temperature; document.getElementById('heart_rate').value = r.heart_rate; document.getElementById('symptoms').value = r.symptoms; document.getElementById('diagnosis').value = r.diagnosis; document.getElementById('health-notes').value = r.notes; document.getElementById('health-modal').classList.remove('hidden'); };
window.deleteHealthRecord = async (id, puppyId) => { if (confirm('Delete health record?')) { await api.deleteHealthRecord(id); showPuppyDetail(puppyId); } };

window.editVetVisit = async (id, puppyId) => { const visits = await api.getVetVisits(puppyId); const v = visits.find(x => x.visit_id === id); document.getElementById('vet-modal-title').innerText = 'Edit Vet Visit'; document.getElementById('vet-id').value = v.visit_id; document.getElementById('vet-visit-puppy-id').value = puppyId; document.getElementById('visit_date').value = v.visit_date.split('T')[0]; document.getElementById('visit_reason').value = v.reason; document.getElementById('visit_treatment').value = v.treatment; document.getElementById('visit-notes').value = v.notes; document.getElementById('vet-modal').classList.remove('hidden'); };
window.deleteVetVisit = async (id, puppyId) => { if (confirm('Delete vet visit?')) { await api.deleteVetVisit(id); showPuppyDetail(puppyId); } };

window.editGrowth = async (id, puppyId) => { const growth = await api.getGrowth(puppyId); const g = growth.find(x => x.growth_id === id); document.getElementById('growth-modal-title').innerText = 'Edit Growth Entry'; document.getElementById('growth-id').value = g.growth_id; document.getElementById('growth-puppy-id').value = puppyId; document.getElementById('growth-weight').value = g.weight; document.getElementById('growth-height').value = g.height; document.getElementById('growth-modal').classList.remove('hidden'); };
window.deleteGrowth = async (id, puppyId) => { if (confirm('Delete growth log?')) { await api.deleteGrowth(id); showPuppyDetail(puppyId); } };

window.deleteAlert = async (id, puppyId) => { if (confirm('Dismiss alert?')) { await api.deleteAlert(id); showPuppyDetail(puppyId); } };

init();
