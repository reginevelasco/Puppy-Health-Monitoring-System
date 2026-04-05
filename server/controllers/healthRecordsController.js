const db = require('../config/db');

exports.getHealthRecordsByPuppy = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM HEALTH_RECORDS WHERE puppy_id = ?', [req.params.puppyId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createHealthRecord = async (req, res) => {
    const { puppy_id, temperature, heart_rate, symptoms, diagnosis, notes } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO HEALTH_RECORDS (puppy_id, temperature, heart_rate, symptoms, diagnosis, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [puppy_id, temperature, heart_rate, symptoms, diagnosis, notes]
        );
        res.status(201).json({ record_id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateHealthRecord = async (req, res) => {
    const { temperature, heart_rate, symptoms, diagnosis, notes } = req.body;
    try {
        await db.query(
            'UPDATE HEALTH_RECORDS SET temperature = ?, heart_rate = ?, symptoms = ?, diagnosis = ?, notes = ? WHERE record_id = ?',
            [temperature, heart_rate, symptoms, diagnosis, notes, req.params.id]
        );
        res.json({ message: 'Health record updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteHealthRecord = async (req, res) => {
    try {
        await db.query('DELETE FROM HEALTH_RECORDS WHERE record_id = ?', [req.params.id]);
        res.json({ message: 'Health record deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
