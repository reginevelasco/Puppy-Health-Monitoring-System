const db = require('./config/db');

async function seed() {
    try {
        console.log('Seeding data...');

        // 1. Create a user
        const [userResult] = await db.query(
            'INSERT INTO USERS (full_name, email, password, role) VALUES (?, ?, ?, ?)',
            ['John Doe', 'john@example.com', 'password123', 'owner']
        );
        const userId = userResult.insertId;

        // 2. Create an owner
        const [ownerResult] = await db.query(
            'INSERT INTO OWNERS (user_id, address) VALUES (?, ?)',
            [userId, '123 Puppy Lane']
        );
        const ownerId = ownerResult.insertId;

        // 3. Create puppies
        const [puppy1] = await db.query(
            'INSERT INTO PUPPIES (owner_id, name, breed, gender, birth_date, weight, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ownerId, 'Buddy', 'Golden Retriever', 'Male', '2025-10-15', 5.5, 'Golden']
        );
        const [puppy2] = await db.query(
            'INSERT INTO PUPPIES (owner_id, name, breed, gender, birth_date, weight, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ownerId, 'Bella', 'Beagle', 'Female', '2026-01-10', 3.2, 'Tri-color']
        );

        console.log('Seeding completed.');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        process.exit();
    }
}

seed();
