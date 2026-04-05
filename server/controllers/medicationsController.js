const db = require('../config/db');

exports.getMedicationsByPuppy = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM MEDICATIONS WHERE puppy_id = ?', [req.params.puppyId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createMedication = async (req, res) => {
    const { puppy_id, medicine_name, dosage, start_date, end_date, instructions } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO MEDICATIONS (puppy_id, medicine_name, dosage, start_date, end_date, instructions) VALUES (?, ?, ?, ?, ?, ?)',
            [puppy_id, medicine_name, dosage, start_date, end_date, instructions]
        );
        res.status(201).json({ medication_id: result.insertId, ...req.body });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateMedication = async (req, res) => {
    const { medicine_name, dosage, start_date, end_date, instructions } = req.body;
    try {
        await db.query(
            'UPDATE MEDICATIONS SET medicine_name = ?, dosage = ?, start_date = ?, end_date = ?, instructions = ? WHERE medication_id = ?',
            [medicine_name, dosage, start_date, end_date, instructions, req.params.id]
        );
        res.json({ message: 'Medication updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteMedication = async (req, res) => {
    try {
        await db.query('DELETE FROM MEDICATIONS WHERE medication_id = ?', [req.params.id]);
        res.json({ message: 'Medication deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
