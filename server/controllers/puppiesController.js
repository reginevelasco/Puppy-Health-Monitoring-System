const db = require('../config/db');

exports.getAllPuppies = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM PUPPIES');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPuppyById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM PUPPIES WHERE puppy_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Puppy not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createPuppy = async (req, res) => {
    const { owner_id, name, breed, gender, birth_date, weight, color, photo_url } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO PUPPIES (owner_id, name, breed, gender, birth_date, weight, color, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [owner_id, name, breed, gender, birth_date, weight, color, photo_url]
        );
        res.status(201).json({ puppy_id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePuppy = async (req, res) => {
    const { name, breed, gender, birth_date, weight, color, photo_url } = req.body;
    try {
        await db.query(
            'UPDATE PUPPIES SET name = ?, breed = ?, gender = ?, birth_date = ?, weight = ?, color = ?, photo_url = ? WHERE puppy_id = ?',
            [name, breed, gender, birth_date, weight, color, photo_url, req.params.id]
        );
        res.json({ message: 'Puppy updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePuppy = async (req, res) => {
    try {
        await db.query('DELETE FROM PUPPIES WHERE puppy_id = ?', [req.params.id]);
        res.json({ message: 'Puppy deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
