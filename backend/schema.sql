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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  -- Added default
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
    email VARCHAR(255) NOT NULL UNIQUE,  -- Added UNIQUE constraint
    mobile_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    login_attempts INTEGER DEFAULT 0,
    email_otp VARCHAR(10),
    otp_expires_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- Changed to TIMESTAMPTZ for consistency
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- Changed to TIMESTAMPTZ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for maintenance_settings updated_at
CREATE TRIGGER update_maintenance_settings_updated_at
    BEFORE UPDATE ON maintenance_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- ENROLLMENT_PROFILE TABLE (CORRECTED)
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

-- Create table with CORRECTED spelling
CREATE TABLE enrollment_profile (
    -- CORRECTED: 6-character alphanumeric ID (not UUID)
    enrollment_id VARCHAR(6) PRIMARY KEY DEFAULT generate_enrollment_id(),
    
    -- Foreign Keys
    course_code_id UUID NOT NULL,
    user_id UUID NOT NULL,
    enrollment_year_code UUID NOT NULL,  -- CORRECTED spelling (was enrollement_year_code)
    
    -- Enrollment Details
    enrollment_status VARCHAR(50) NOT NULL  -- CORRECTED spelling (was enrollement_status)
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

-- CORRECTED: Create indexes with proper spelling
CREATE INDEX idx_enrollment_user ON enrollment_profile(user_id);
CREATE INDEX idx_enrollment_course ON enrollment_profile(course_code_id);
CREATE INDEX idx_enrollment_year ON enrollment_profile(enrollment_year_code);
CREATE INDEX idx_enrollment_status ON enrollment_profile(enrollment_status);

-- CORRECTED: Trigger name
CREATE TRIGGER update_enrollment_profile_updated_at
    BEFORE UPDATE ON enrollment_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- TRANSACTION_TABLE (CORRECTED)
-- ============================================

CREATE TABLE transaction_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- CORRECTED: Reference enrollment_id as VARCHAR(6), not UUID
    enrollment_id VARCHAR(6) NOT NULL,  -- Changed from UUID to match enrollment_profile
    
    -- Period/Term
    period VARCHAR(50) NOT NULL 
        CHECK (period IN (
            'prelim', 
            'mid-term', 
            'pre-final', 
            'final', 
            'summer'
        )),
    
    -- Fee Information
    course_tuition_fee UUID NOT NULL,
    
    -- Payment Information
    paid DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    
    payment_type VARCHAR(50) NOT NULL 
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
    remark TEXT,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_transaction_enrollment 
        FOREIGN KEY (enrollment_id) 
        REFERENCES enrollment_profile(enrollment_id)  -- Now references VARCHAR(6)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_transaction_course 
        FOREIGN KEY (course_tuition_fee) 
        REFERENCES courses(id) 
        ON DELETE RESTRICT,
    
    -- Validation constraints
    CONSTRAINT chk_balance_non_negative 
        CHECK (balance >= 0),
    
    CONSTRAINT chk_paid_non_negative 
        CHECK (paid >= 0)
);

-- CORRECTED: Create indexes
CREATE INDEX idx_transaction_enrollment_id ON transaction_table(enrollment_id);
CREATE INDEX idx_transaction_period ON transaction_table(period);
CREATE INDEX idx_transaction_payment_type ON transaction_table(payment_type);
CREATE INDEX idx_transaction_created_at ON transaction_table(created_at);

-- CORRECTED: Trigger name
CREATE TRIGGER update_transaction_table_updated_at
    BEFORE UPDATE ON transaction_table
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();