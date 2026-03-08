CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birthdate DATE,                                   
    gender VARCHAR(20),                                
    address VARCHAR(255),                              
   role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'faculty', 'student')),                   
    status BOOLEAN DEFAULT false,                     
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE               
); 


CREATE TABLE credentials (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    login_attempts INTEGER DEFAULT 0,
    email_otp VARCHAR(10),
    otp_expires_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
); 


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

CREATE TABLE academic_year (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- This is UUID
    year_series VARCHAR(255) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    enrollment_open BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE maintenance_settings (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN DEFAULT false,
    message TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- ENROLLEMENT_PROFILE TABLE
-- ============================================

CREATE TABLE enrollement_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Keys
    course_code_id UUID NOT NULL,
    user_id UUID NOT NULL,
    enrollement_year_code UUID NOT NULL,  -- Changed from INTEGER to UUID to match academic_year.id
    
    -- Enrollment Details
    enrollement_status VARCHAR(50) NOT NULL 
        CHECK (enrollement_status IN (
            'documents_approved', 
            'payment_pending', 
            'enrolled', 
            'cancelled', 
            'suspended'
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
    CONSTRAINT fk_course 
        FOREIGN KEY (course_code_id) 
        REFERENCES courses(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_academic_year 
        FOREIGN KEY (enrollement_year_code) 
        REFERENCES academic_year(id) 
        ON DELETE RESTRICT
);

-- Create indexes for frequently queried columns
CREATE INDEX idx_enrollement_user ON enrollement_profile(user_id);
CREATE INDEX idx_enrollement_course ON enrollement_profile(course_code_id);
CREATE INDEX idx_enrollement_year ON enrollement_profile(enrollement_year_code);
CREATE INDEX idx_enrollement_status ON enrollement_profile(enrollement_status);


-- ============================================
-- TRANSACTION_TABLE
-- ============================================

CREATE TABLE transaction_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    transaction_id UUID NOT NULL UNIQUE,
    
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
            'cash', 
            'credit_card', 
            'check'
        )),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Optional remarks
    remark TEXT,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_course_tuition 
        FOREIGN KEY (course_tuition_fee) 
        REFERENCES courses(id) 
        ON DELETE RESTRICT,
    
    -- Ensure balance calculation is logical
    CONSTRAINT chk_balance_non_negative 
        CHECK (balance >= 0),
    
    CONSTRAINT chk_paid_non_negative 
        CHECK (paid >= 0)
);

-- Create indexes for frequently queried columns
CREATE INDEX idx_transaction_transaction_id ON transaction_table(transaction_id);
CREATE INDEX idx_transaction_period ON transaction_table(period);
CREATE INDEX idx_transaction_payment_type ON transaction_table(payment_type);
CREATE INDEX idx_transaction_created_at ON transaction_table(created_at);


-- ============================================
-- TRIGGER TO AUTO-UPDATE updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to enrollement_profile
CREATE TRIGGER update_enrollement_profile_updated_at
    BEFORE UPDATE ON enrollement_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to transaction_table
CREATE TRIGGER update_transaction_table_updated_at
    BEFORE UPDATE ON transaction_table
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();