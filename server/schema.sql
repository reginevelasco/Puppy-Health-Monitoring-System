-- Database schema for Puppy Health Monitoring System

CREATE DATABASE IF NOT EXISTS puppy_health_monitoring_system_db;
USE puppy_health_monitoring_system_db;

-- USERS Table
CREATE TABLE IF NOT EXISTS USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OWNERS Table
CREATE TABLE IF NOT EXISTS OWNERS (
    owner_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

-- PUPPIES Table
CREATE TABLE IF NOT EXISTS PUPPIES (
    puppy_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    gender ENUM('Male', 'Female'),
    birth_date DATE,
    weight FLOAT,
    color VARCHAR(50),
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES OWNERS(owner_id) ON DELETE CASCADE
);

-- HEALTH_RECORDS Table
CREATE TABLE IF NOT EXISTS HEALTH_RECORDS (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    puppy_id INT NOT NULL,
    temperature FLOAT,
    heart_rate INT,
    symptoms TEXT,
    diagnosis TEXT,
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (puppy_id) REFERENCES PUPPIES(puppy_id) ON DELETE CASCADE
);

-- VACCINATIONS Table
CREATE TABLE IF NOT EXISTS VACCINATIONS (
    vaccination_id INT AUTO_INCREMENT PRIMARY KEY,
    puppy_id INT NOT NULL,
    veterinarian_id INT, -- Refers to USERS table with role 'vet'
    vaccine_name VARCHAR(100) NOT NULL,
    date_administered DATE NOT NULL,
    next_due_date DATE,
    FOREIGN KEY (puppy_id) REFERENCES PUPPIES(puppy_id) ON DELETE CASCADE,
    FOREIGN KEY (veterinarian_id) REFERENCES USERS(user_id) ON DELETE SET NULL
);

-- VET_VISITS Table
CREATE TABLE IF NOT EXISTS VET_VISITS (
    visit_id INT AUTO_INCREMENT PRIMARY KEY,
    puppy_id INT NOT NULL,
    veterinarian_id INT, -- Refers to USERS table with role 'vet'
    visit_date DATE NOT NULL,
    reason TEXT,
    treatment TEXT,
    notes TEXT,
    FOREIGN KEY (puppy_id) REFERENCES PUPPIES(puppy_id) ON DELETE CASCADE,
    FOREIGN KEY (veterinarian_id) REFERENCES USERS(user_id) ON DELETE SET NULL
);

-- MEDICATIONS Table
CREATE TABLE IF NOT EXISTS MEDICATIONS (
    medication_id INT AUTO_INCREMENT PRIMARY KEY,
    puppy_id INT NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(100),
    start_date DATE,
    end_date DATE,
    instructions TEXT,
    FOREIGN KEY (puppy_id) REFERENCES PUPPIES(puppy_id) ON DELETE CASCADE
);

-- GROWTH_TRACKING Table
CREATE TABLE IF NOT EXISTS GROWTH_TRACKING (
    growth_id INT AUTO_INCREMENT PRIMARY KEY,
    puppy_id INT NOT NULL,
    weight FLOAT,
    height FLOAT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (puppy_id) REFERENCES PUPPIES(puppy_id) ON DELETE CASCADE
);

-- ALERTS Table
CREATE TABLE IF NOT EXISTS ALERTS (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    puppy_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    alert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'dismissed') DEFAULT 'active',
    FOREIGN KEY (puppy_id) REFERENCES PUPPIES(puppy_id) ON DELETE CASCADE
);

-- ACTIVITY_LOG Table
CREATE TABLE IF NOT EXISTS ACTIVITY_LOG (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);
