const formatUser = (data) => ({
  id: data.user_id,
  email: data.email,
  role: data.role,
  firstName: data.first_name,
  lastName: data.last_name,
});
export default formatUser;
