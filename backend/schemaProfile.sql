INSERT INTO transaction_table (
    enrollment_id,
    period,
    course_tuition_fee,
    paid,
    balance,
    payment_type,
    remark
)
VALUES (
    '3GD9OC', -- must exist in enrollment_profile
    'prelim',
    '36b27b12-e6dc-435a-9622-80a9640a6d45', -- replace with an existing courses.id UUID
    1500.00,
    3500.00,
    'gcash',
    'Test payment transaction'
);