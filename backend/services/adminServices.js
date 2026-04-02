//++++++++++++++++++ finalized here +++++++++++++++++++//

const getAllUsersListServices = () => {
  try {
    const query = `SELECT 
    users.id,
    users.first_name,
    users.last_name,
    credentials.email,
    users.role,
    users.status,
    credentials.created_at
FROM credentials
INNER JOIN users
    ON credentials.user_id = users.id;`;
    return { query };
  } catch (error) {
    console.error("getAllUsersListServices error:", error);
    throw error;
  }
};

const getAllCoursesListServices = () => {
  try {
    let query = `SELECT * FROM courses`;
    return { query };
  } catch (error) {
    console.error("getAllCoursesListSerivces error:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

export { getAllUsersListServices, getAllCoursesListServices };
