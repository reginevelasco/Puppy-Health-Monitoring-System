const db = require('../config/db');

exports.getAllOwners = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM OWNERS');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
