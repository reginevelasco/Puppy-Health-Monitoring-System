const db = require('../config/db');

exports.getVaccinationsByPuppy = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM VACCINATIONS WHERE puppy_id = ?', [req.params.puppyId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createVaccination = async (req, res) => {
    const { puppy_id, veterinarian_id, vaccine_name, date_administered, next_due_date } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO VACCINATIONS (puppy_id, veterinarian_id, vaccine_name, date_administered, next_due_date) VALUES (?, ?, ?, ?, ?)',
            [puppy_id, veterinarian_id, vaccine_name, date_administered, next_due_date]
        );
        res.status(201).json({ vaccination_id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateVaccination = async (req, res) => {
    const { vaccine_name, date_administered, next_due_date } = req.body;
    try {
        await db.query(
            'UPDATE VACCINATIONS SET vaccine_name = ?, date_administered = ?, next_due_date = ? WHERE vaccination_id = ?',
            [vaccine_name, date_administered, next_due_date, req.params.id]
        );
        res.json({ message: 'Vaccination updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteVaccination = async (req, res) => {
    try {
        await db.query('DELETE FROM VACCINATIONS WHERE vaccination_id = ?', [req.params.id]);
        res.json({ message: 'Vaccination deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
