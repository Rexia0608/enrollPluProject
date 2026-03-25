-- ============================================
-- COMPLETE DATABASE SCHEMA
-- ============================================

-- ============================================
-- HELPER FUNCTION FOR UPDATED_AT TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birthdate DATE,                                   
    gender VARCHAR(20),                                
    address VARCHAR(255),                              
    role VARCHAR(50) NOT NULL DEFAULT 'student' 
        CHECK (role IN ('admin', 'faculty', 'student')),                   
    status BOOLEAN DEFAULT false,                     
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 

-- Trigger for users updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- CREDENTIALS TABLE
-- ============================================

CREATE TABLE credentials (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    login_attempts INTEGER DEFAULT 0,
    email_otp VARCHAR(10),
    otp_expires_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_user_credentials
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
); 

-- Trigger for credentials updated_at
CREATE TRIGGER update_credentials_updated_at
    BEFORE UPDATE ON credentials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- COURSES TABLE
-- ============================================

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL, 
    duration_type VARCHAR(50),
    tuition_fee DECIMAL(12, 2) NOT NULL,
    course_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 

-- Trigger for courses updated_at
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- ACADEMIC_YEAR TABLE
-- ============================================

CREATE TABLE academic_year (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_series VARCHAR(255) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_class_ongoing BOOLEAN DEFAULT FALSE,
    enrollment_open BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for academic_year updated_at
CREATE TRIGGER update_academic_year_updated_at
    BEFORE UPDATE ON academic_year
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- MAINTENANCE_SETTINGS TABLE
-- ============================================

CREATE TABLE maintenance_settings (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN DEFAULT false,
    message TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for maintenance_settings updated_at
CREATE TRIGGER update_maintenance_settings_updated_at
    BEFORE UPDATE ON maintenance_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial record for maintenance_settings
INSERT INTO maintenance_settings (is_active, message) 
VALUES (false, 'System is currently under maintenance. Please check back later.');


-- ============================================
-- ENROLLMENT_PROFILE TABLE
-- ============================================

-- Function to generate 6-character alphanumeric ID
CREATE OR REPLACE FUNCTION generate_enrollment_id()
RETURNS VARCHAR(6) AS $$
DECLARE
    new_id VARCHAR(6);
    exists_check BOOLEAN;
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    i INTEGER;
BEGIN
    LOOP
        new_id := '';
        FOR i IN 1..6 LOOP
            new_id := new_id || SUBSTRING(chars, FLOOR(RANDOM() * 36 + 1)::INTEGER, 1);
        END LOOP;
        
        SELECT EXISTS(
            SELECT 1 FROM enrollment_profile WHERE enrollment_id = new_id
        ) INTO exists_check;
        
        EXIT WHEN NOT exists_check;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create enrollment_profile table
CREATE TABLE enrollment_profile (
    enrollment_id VARCHAR(6) PRIMARY KEY DEFAULT generate_enrollment_id(),
    
    -- Foreign Keys
    course_code_id UUID NOT NULL,
    user_id UUID NOT NULL,
    enrollment_year_code UUID NOT NULL,
    
    -- Enrollment Details
    enrollment_status VARCHAR(50) NOT NULL
        CHECK (enrollment_status IN (
            'not_started',
            'documents_pending',
            'documents_approved',
            'payment_pending',
            'payment_validated',
            'enrolled' 
        )),
    
    student_type VARCHAR(50) NOT NULL 
        CHECK (student_type IN (
            'new', 
            'transferee', 
            'old_student'
        )),
    
    year_level VARCHAR(50) NOT NULL DEFAULT 'First Year'
        CHECK (year_level IN (
            'First Year', 
            'Second Year', 
            'Third Year', 
            'Fourth Year', 
            'other(certificate course)'
        )),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Optional remarks
    remarks TEXT,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_enrollment_course 
        FOREIGN KEY (course_code_id) 
        REFERENCES courses(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_enrollment_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_enrollment_academic_year 
        FOREIGN KEY (enrollment_year_code) 
        REFERENCES academic_year(id) 
        ON DELETE RESTRICT
);

-- Indexes for enrollment_profile
CREATE INDEX idx_enrollment_user ON enrollment_profile(user_id);
CREATE INDEX idx_enrollment_course ON enrollment_profile(course_code_id);
CREATE INDEX idx_enrollment_year ON enrollment_profile(enrollment_year_code);
CREATE INDEX idx_enrollment_status ON enrollment_profile(enrollment_status);

-- Trigger for enrollment_profile updated_at
CREATE TRIGGER update_enrollment_profile_updated_at
    BEFORE UPDATE ON enrollment_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- TRANSACTION_TABLE
-- ============================================

-- Function to generate 9-character transaction ID (optional - you can also generate in application)
CREATE OR REPLACE FUNCTION generate_transaction_id()
RETURNS VARCHAR(9) AS $$
DECLARE
    new_id VARCHAR(9);
    exists_check BOOLEAN;
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    i INTEGER;
BEGIN
    LOOP
        new_id := '';
        -- Add 'TRX' prefix for transaction
        new_id := 'TRX';
        FOR i IN 4..9 LOOP
            new_id := new_id || SUBSTRING(chars, FLOOR(RANDOM() * 36 + 1)::INTEGER, 1);
        END LOOP;
        
        SELECT EXISTS(
            SELECT 1 FROM transaction_table WHERE id = new_id
        ) INTO exists_check;
        
        EXIT WHEN NOT exists_check;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create transaction_table
CREATE TABLE transaction_table (
    id VARCHAR(9) PRIMARY KEY DEFAULT generate_transaction_id(),
    
    -- Reference to enrollment_profile
    enrollment_id VARCHAR(6) NOT NULL,
    
    -- Academic period
    period VARCHAR(50)  
        CHECK (period IN (
            'enrollment',
            'prelim', 
            'mid-term', 
            'pre-final', 
            'final', 
            'summer'
        )),
    
    -- Payment status Information
    payment_status VARCHAR(50)   
        CHECK (payment_status IN (
            'review',
            'pending',
            'paid',
            'rejected'
        )),
    
    -- Payment Information
    paid_amount DECIMAL(12, 2) DEFAULT 0.00,
    balance DECIMAL(12, 2) DEFAULT 0.00,
    payment_per_period DECIMAL(12, 2) DEFAULT 0.00,
    
    -- Payment method
    payment_type VARCHAR(50) 
        CHECK (payment_type IN (
            'maya', 
            'gcash', 
            'bank_transfer',
            'Other'
        )),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Optional remarks
    remarks TEXT, 
    
    -- Foreign Key Constraints
    CONSTRAINT fk_transaction_enrollment 
        FOREIGN KEY (enrollment_id) 
        REFERENCES enrollment_profile(enrollment_id)
        ON DELETE RESTRICT,
    
    -- Validation constraints
    CONSTRAINT chk_balance_non_negative 
        CHECK (balance >= 0),
    
    CONSTRAINT chk_paid_non_negative 
        CHECK (paid_amount >= 0)
);

-- Indexes for transaction_table
CREATE INDEX idx_transaction_enrollment_id ON transaction_table(enrollment_id);
CREATE INDEX idx_transaction_period ON transaction_table(period);
CREATE INDEX idx_transaction_payment_type ON transaction_table(payment_type);
CREATE INDEX idx_transaction_created_at ON transaction_table(created_at);

-- Trigger for transaction_table updated_at
CREATE TRIGGER update_transaction_table_updated_at
    BEFORE UPDATE ON transaction_table
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- SAMPLE INITIAL DATA (Optional)
-- ============================================

-- Insert sample admin user (password should be hashed in real application)
INSERT INTO users (first_name, last_name, role, status) 
VALUES ('Admin', 'User', 'admin', true);

-- Insert admin credentials (using the generated user_id)
INSERT INTO credentials (user_id, email, password, is_verified)
SELECT id, 'admin@example.com', 'hashed_password_here', true
FROM users WHERE role = 'admin' LIMIT 1;

-- Insert sample academic year
INSERT INTO academic_year (year_series, semester, start_date, end_date, is_class_ongoing, enrollment_open)
VALUES ('2024-2025', 'First Semester', '2024-08-15', '2024-12-15', false, true);

-- Insert sample courses
INSERT INTO courses (course_code, course_name, duration_type, tuition_fee, course_status)
VALUES 
    ('CS101', 'Bachelor of Science in Computer Science', '4 years', 5000.00, 'active'),
    ('IT101', 'Bachelor of Science in Information Technology', '4 years', 5000.00, 'active'),
    ('ENG101', 'Bachelor of Arts in English', '4 years', 5000.00, 'active');


-- ============================================
-- VERIFY DATABASE SCHEMA
-- ============================================

-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- List all triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;