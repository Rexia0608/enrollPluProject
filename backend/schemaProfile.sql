-- Query to get user and enrollment data for payment page
WITH user_data AS (
    SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.role,
        c.email,
        c.mobile_number
    FROM users u
    INNER JOIN credentials c ON u.id = c.user_id
    WHERE c.email = $1  -- Parameter: user email
),

active_enrollment AS (
    SELECT 
        ep.enrollment_id,
        ep.enrollment_status,
        ep.student_type,
        ep.year_level,
        ep.remarks as enrollment_remarks,
        c.course_code,
        c.course_name,
        c.tuition_fee as total_tuition_fee,
        ay.year_series,
        ay.semester,
        ay.start_date as academic_year_start,
        ay.end_date as academic_year_end
    FROM enrollment_profile ep
    INNER JOIN courses c ON ep.course_code_id = c.id
    INNER JOIN academic_year ay ON ep.enrollment_year_code = ay.id
    WHERE ep.user_id = (SELECT id FROM user_data)
        AND ep.enrollment_status IN ('payment_pending', 'payment_validated', 'enrolled')
        AND ay.is_class_ongoing = true
    ORDER BY ep.created_at DESC
    LIMIT 1
),

-- Get payment transactions for all periods
payment_summary AS (
    SELECT 
        period,
        COALESCE(SUM(paid), 0) as total_paid,
        MAX(balance) as current_balance,
        COUNT(*) as transaction_count
    FROM transaction_table
    WHERE enrollment_id = (SELECT enrollment_id FROM active_enrollment)
    GROUP BY period
),

-- Generate all periods with their payment data
period_data AS (
    SELECT 
        periods.period_name,
        periods.due_date,
        COALESCE(ps.total_paid, 0) as paid_amount,
        CASE 
            WHEN periods.period_name = 'prelim' THEN (SELECT total_tuition_fee * 0.20 FROM active_enrollment)
            WHEN periods.period_name = 'mid-term' THEN (SELECT total_tuition_fee * 0.30 FROM active_enrollment)
            WHEN periods.period_name = 'pre-final' THEN (SELECT total_tuition_fee * 0.25 FROM active_enrollment)
            WHEN periods.period_name = 'final' THEN (SELECT total_tuition_fee * 0.25 FROM active_enrollment)
            WHEN periods.period_name = 'summer' THEN (SELECT total_tuition_fee * 0.20 FROM active_enrollment)
        END as tuition_fee
    FROM (
        VALUES 
            ('prelim', (SELECT academic_year_start + INTERVAL '2 months' FROM active_enrollment)),
            ('mid-term', (SELECT academic_year_start + INTERVAL '4 months' FROM active_enrollment)),
            ('pre-final', (SELECT academic_year_start + INTERVAL '6 months' FROM active_enrollment)),
            ('final', (SELECT academic_year_start + INTERVAL '8 months' FROM active_enrollment)),
            ('summer', (SELECT academic_year_start + INTERVAL '10 months' FROM active_enrollment))
    ) as periods(period_name, due_date)
    LEFT JOIN payment_summary ps ON periods.period_name = ps.period
),

-- Get recent transactions for display
recent_transactions AS (
    SELECT 
        period,
        paid as amount_paid,
        payment_type,
        remark,
        created_at,
        CASE 
            WHEN payment_type = 'maya' THEN 'Maya'
            WHEN payment_type = 'gcash' THEN 'GCash'
            WHEN payment_type = 'bank_transfer' THEN 'Bank Transfer (Instapay)'
            ELSE 'Other'
        END as payment_method_display
    FROM transaction_table
    WHERE enrollment_id = (SELECT enrollment_id FROM active_enrollment)
    ORDER BY created_at DESC
    LIMIT 10
)

-- Final combined result
SELECT 
    -- User information
    jsonb_build_object(
        'id', u.id,
        'name', CONCAT(u.first_name, ' ', u.last_name),
        'email', u.email,
        'mobile_number', u.mobile_number,
        'role', u.role
    ) as user_data,
    
    -- Enrollment information
    jsonb_build_object(
        'enrollment_id', ae.enrollment_id,
        'enrollment_status', ae.enrollment_status,
        'student_type', ae.student_type,
        'year_level', ae.year_level,
        'course_code', ae.course_code,
        'course_name', ae.course_name,
        'total_tuition_fee', ae.total_tuition_fee,
        'academic_year', CONCAT(ae.year_series, ' - ', ae.semester)
    ) as enrollment_data,
    
    -- Period-specific payment data (for the component's paymentData state)
    jsonb_object_agg(
        pd.period_name,
        jsonb_build_object(
            'tuition', pd.tuition_fee,
            'paid', pd.paid_amount,
            'remaining', pd.tuition_fee - pd.paid_amount
        )
    ) as payment_data,
    
    -- Recent transactions (optional, for history display)
    jsonb_agg(
        jsonb_build_object(
            'period', rt.period,
            'amount', rt.amount_paid,
            'payment_method', rt.payment_method_display,
            'remarks', rt.remark,
            'date', rt.created_at
        )
        ORDER BY rt.created_at DESC
    ) FILTER (WHERE rt.period IS NOT NULL) as recent_transactions

FROM user_data u
CROSS JOIN active_enrollment ae
CROSS JOIN LATERAL period_data pd
LEFT JOIN recent_transactions rt ON true
GROUP BY u.id, u.first_name, u.last_name, u.email, u.mobile_number, u.role, 
         ae.enrollment_id, ae.enrollment_status, ae.student_type, ae.year_level, 
         ae.course_code, ae.course_name, ae.total_tuition_fee, ae.year_series, ae.semester;