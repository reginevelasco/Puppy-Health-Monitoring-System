const db = require('../config/db');

exports.getGrowthByPuppy = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM GROWTH_TRACKING WHERE puppy_id = ? ORDER BY recorded_at ASC', [req.params.puppyId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createGrowthRecord = async (req, res) => {
    const { puppy_id, weight, height } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO GROWTH_TRACKING (puppy_id, weight, height) VALUES (?, ?, ?)',
            [puppy_id, weight, height]
        );
        res.status(201).json({ growth_id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateGrowthRecord = async (req, res) => {
    const { weight, height } = req.body;
    try {
        await db.query(
            'UPDATE GROWTH_TRACKING SET weight = ?, height = ? WHERE growth_id = ?',
            [weight, height, req.params.id]
        );
        res.json({ message: 'Growth record updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteGrowthRecord = async (req, res) => {
    try {
        await db.query('DELETE FROM GROWTH_TRACKING WHERE growth_id = ?', [req.params.id]);
        res.json({ message: 'Growth record deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
