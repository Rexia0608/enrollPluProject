// components/admin/UserManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Key,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  User as UserIcon,
  Search,
  ChevronUp,
  ChevronDown,
  X,
  Save,
} from "lucide-react";
import axios from "axios";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";
import Pagination from "../ui/Pagination";
import Modal from "../ui/Modal";
import { useAdmin } from "../../context/AdminContext";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

function EditUserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    role: user?.role || "student",
    status: user?.status === true ? "active" : "inactive",
    phone: user?.phone || "",
    department: user?.department || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert status back to boolean for API
    const submitData = {
      ...formData,
      status: formData.status === "active",
    };
    onSave(submitData);
  };

  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Personal Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClasses}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Computer Science"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Account Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`${inputClasses} bg-white`}
            >
              {["student", "faculty", "admin"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`${inputClasses} bg-white`}
            >
              {["active", "inactive"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
}

function UserManagement() {
  const { userList, refreshUsers, getAuthHeaders } = useAdmin();
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Transform userList data to match component expectations
  useEffect(() => {
    if (userList && userList.length > 0) {
      const transformedUsers = userList.map((user) => ({
        id: user.id,
        // Create full name from first_name and last_name
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        // Convert boolean status to string
        status: user.status === true ? "active" : "inactive",
        // Use created_at for joined date (since lastLogin might not exist)
        lastLogin: user.lastLogin || user.created_at,
        joinedDate: user.created_at,
        // Include other fields if they exist
        phone: user.phone || "",
        department: user.department || "",
        // For display ID - use the actual UUID as fallback
        displayId:
          user.studentId ||
          user.facultyId ||
          user.adminId ||
          user.id.slice(0, 8),
      }));
      setUsers(transformedUsers);
    } else {
      setUsers([]);
    }
  }, [userList]);

  const handleSort = (key) =>
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    });

  const getSortedUsers = () => {
    if (!sortConfig.key) return [...users];
    return [...users].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (sortConfig.key === "lastLogin" || sortConfig.key === "joinedDate") {
        return sortConfig.direction === "ascending"
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortConfig.direction === "ascending"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortConfig.direction === "ascending"
        ? aVal < bVal
          ? -1
          : aVal > bVal
            ? 1
            : 0
        : aVal > bVal
          ? -1
          : aVal < bVal
            ? 1
            : 0;
    });
  };

  const filteredUsers = getSortedUsers().filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || user.status === statusFilter) &&
      (roleFilter === "all" || user.role === roleFilter),
  );

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Find the original user data
      const originalUser = userList.find((u) => u.id === id);
      if (!originalUser) return;

      // Convert string status back to boolean for API
      const updatedStatus = newStatus === "active";

      // Make API call to update the status
      await axios.patch(
        `http://localhost:3000/admin/switchStatus/${id}`,
        { status: updatedStatus },
        getAuthHeaders(),
      );

      // Update local state optimistically
      setUsers(
        users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
      );

      toast.success(`User status updated to ${newStatus}`);

      // Refresh users from API to ensure sync
      await refreshUsers();
    } catch (err) {
      console.error("Error updating status", err);
      toast.error("Failed to update user status");
      // Revert on error by refreshing
      await refreshUsers();
    }
  };

  const handleResetPassword = async (id) => {
    try {
      // Make API call to reset password
      await axios.post(
        `http://localhost:3000/admin/resetPassword/${id}`,
        {},
        getAuthHeaders(),
      );
      toast.success(`Password reset link sent to user`);
    } catch (err) {
      console.error("Error resetting password", err);
      toast.error("Failed to send password reset link");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // Make API call to delete the user
        await axios.delete(
          `http://localhost:3000/admin/deleteUser/${id}`,
          getAuthHeaders(),
        );

        // Update local state
        setUsers(users.filter((u) => u.id !== id));

        toast.success("User deleted successfully");

        // Refresh users from API
        await refreshUsers();
      } catch (err) {
        console.error("Error deleting user", err);
        toast.error("Failed to delete user");
        await refreshUsers();
      }
    }
  };

  const handleEditClick = (user) => {
    // Find original user data from userList
    const originalUser = userList.find((u) => u.id === user.id);
    setSelectedUser(originalUser);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (data) => {
    try {
      // Make API call to update the user
      await axios.put(
        `http://localhost:3000/admin/editUser/${selectedUser.id}`,
        data,
        getAuthHeaders(),
      );

      toast.success("User updated successfully");

      // Refresh users from API to get updated data
      await refreshUsers();

      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error saving user", err);
      toast.error("Failed to update user");
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      faculty: "bg-green-100 text-green-800",
      student: "bg-blue-100 text-blue-800",
    };
    return (
      (colors[role] || "bg-gray-100 text-gray-800") + " border border-gray-200"
    );
  };

  const getRoleIcon = (role) =>
    role === "admin" ? (
      <Shield className="w-3.5 h-3.5" />
    ) : (
      <Users className="w-3.5 h-3.5" />
    );

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  const renderUserTable = (usersToRender) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {["name", "role", "status", "lastLogin"].map((key) => (
              <th
                key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort(key)}
              >
                <div className="flex items-center">
                  {key === "lastLogin"
                    ? "Last Login"
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortConfig.key === key &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ))}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {usersToRender.length ? (
            usersToRender.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <UserIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {user.displayId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                  >
                    {getRoleIcon(user.role)}
                    <span className="ml-1.5 capitalize">{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(user.lastLogin)}
                    </div>
                    <div className="text-xs text-gray-600">
                      Joined: {formatDate(user.joinedDate)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {[
                      {
                        icon: user.status === "active" ? EyeOff : Eye,
                        onClick: () =>
                          handleStatusChange(
                            user.id,
                            user.status === "active" ? "inactive" : "active",
                          ),
                        color: user.status === "active" ? "yellow" : "green",
                        title:
                          user.status === "active" ? "Deactivate" : "Activate",
                      },
                      {
                        icon: Key,
                        onClick: () => handleResetPassword(user.id),
                        color: "blue",
                        title: "Reset Password",
                      },
                      {
                        icon: Edit2,
                        onClick: () => handleEditClick(user),
                        color: "blue",
                        title: "Edit User",
                      },
                      {
                        icon: Trash2,
                        onClick: () => handleDeleteUser(user.id),
                        color: "red",
                        title: "Delete User",
                      },
                    ].map(({ icon: Icon, onClick, color, title }, i) => (
                      <button
                        key={i}
                        onClick={onClick}
                        className={`p-2 text-gray-600 hover:text-${color}-600 hover:bg-${color}-50 rounded-lg transition-colors`}
                        title={title}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 font-medium">No users found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    roleFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "No users in the system"}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const emptyStateComponent = (
    <div className="text-center py-12">
      <div className="flex flex-col items-center justify-center">
        <Search className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-500 font-medium">No users found</p>
        <p className="text-gray-400 text-sm mt-1">
          {searchTerm || statusFilter !== "all" || roleFilter !== "all"
            ? "Try adjusting your search or filters"
            : "No users in the system"}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage student and faculty accounts</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {[
                {
                  value: roleFilter,
                  setter: setRoleFilter,
                  options: ["all", "admin", "faculty", "student"],
                  label: "All Roles",
                },
                {
                  value: statusFilter,
                  setter: setStatusFilter,
                  options: ["all", "active", "inactive"],
                  label: "All Status",
                },
              ].map((filter, i) => (
                <div key={i} className="relative">
                  <select
                    value={filter.value}
                    onChange={(e) => filter.setter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                  >
                    <option value="all">{filter.label}</option>
                    {filter.options.slice(1).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 pl-10 pr-10 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Pagination
          items={filteredUsers}
          itemsPerPage={ITEMS_PER_PAGE}
          renderItems={renderUserTable}
          emptyStateComponent={emptyStateComponent}
          showFirstLast
          siblingCount={1}
        />

        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold">{users.length}</span> users
              {(searchTerm ||
                statusFilter !== "all" ||
                roleFilter !== "all") && (
                <span className="ml-2 text-gray-400 text-xs">
                  {" "}
                  (filtered: {filteredUsers.length})
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-xs">
              {[
                {
                  color: "bg-green-500",
                  label: "Active",
                  count: users.filter((u) => u.status === "active").length,
                },
                {
                  color: "bg-red-500",
                  label: "Inactive",
                  count: users.filter((u) => u.status === "inactive").length,
                },
                {
                  color: "bg-blue-500",
                  label: "Students",
                  count: users.filter((u) => u.role === "student").length,
                },
                {
                  color: "bg-green-500",
                  label: "Faculty",
                  count: users.filter((u) => u.role === "faculty").length,
                },
                {
                  color: "bg-red-500",
                  label: "Admin",
                  count: users.filter((u) => u.role === "admin").length,
                },
              ].map((stat, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                  <span className="text-gray-600">
                    {stat.label}: {stat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title={`Edit User: ${selectedUser?.first_name} ${selectedUser?.last_name}`}
        size="lg"
        closeOnBackdropClick
        closeOnEsc
      >
        <EditUserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default UserManagement;
