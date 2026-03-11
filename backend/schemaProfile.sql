-- Quick validation query for payment page access
SELECT 
    u.id as user_id,
    CONCAT(u.first_name, ' ', u.last_name) as full_name,
    c.email,
    ep.enrollment_id,
    ep.enrollment_status,
    ep.year_level,
    cr.course_name,
    cr.tuition_fee,
    ay.year_series,
    ay.semester,
    ay.is_class_ongoing,
    -- Check if user can make payments
    CASE 
        WHEN ep.enrollment_status IN ('payment_pending', 'payment_validated') 
            AND ay.is_class_ongoing = true 
        THEN true
        ELSE false
    END as can_make_payment,
    -- Get total remaining balance
    COALESCE((
        SELECT SUM(balance)
        FROM transaction_table
        WHERE enrollment_id = ep.enrollment_id
    ), cr.tuition_fee) as total_remaining_balance
FROM users u
INNER JOIN credentials c ON u.id = c.user_id
INNER JOIN enrollment_profile ep ON u.id = ep.user_id
INNER JOIN courses cr ON ep.course_code_id = cr.id
INNER JOIN academic_year ay ON ep.enrollment_year_code = ay.id
WHERE c.email = $1  -- Parameter: user email
    AND ay.is_class_ongoing = true
ORDER BY ep.created_at DESC
LIMIT 1;