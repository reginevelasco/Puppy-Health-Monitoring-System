const db = require('../config/db');

exports.getVisitsByPuppy = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM VET_VISITS WHERE puppy_id = ?', [req.params.puppyId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createVisit = async (req, res) => {
    const { puppy_id, veterinarian_id, visit_date, reason, treatment, notes } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO VET_VISITS (puppy_id, veterinarian_id, visit_date, reason, treatment, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [puppy_id, veterinarian_id, visit_date, reason, treatment, notes]
        );
        res.status(201).json({ visit_id: result.insertId, ...req.body });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateVisit = async (req, res) => {
    const { visit_date, reason, treatment, notes } = req.body;
    try {
        await db.query(
            'UPDATE VET_VISITS SET visit_date = ?, reason = ?, treatment = ?, notes = ? WHERE visit_id = ?',
            [visit_date, reason, treatment, notes, req.params.id]
        );
        res.json({ message: 'Visit updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteVisit = async (req, res) => {
    try {
        await db.query('DELETE FROM VET_VISITS WHERE visit_id = ?', [req.params.id]);
        res.json({ message: 'Visit deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
