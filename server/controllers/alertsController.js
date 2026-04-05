const db = require('../config/db');

exports.getAlertsByPuppy = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ALERTS WHERE puppy_id = ?', [req.params.puppyId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createAlert = async (req, res) => {
    const { puppy_id, type, message } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO ALERTS (puppy_id, type, message) VALUES (?, ?, ?)',
            [puppy_id, type, message]
        );
        res.status(201).json({ alert_id: result.insertId, ...req.body });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
