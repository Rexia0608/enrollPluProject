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
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";
import Pagination from "../ui/Pagination";
import Modal from "../ui/Modal";
import { useAdmin } from "../../context/AdminContext";

const ITEMS_PER_PAGE = 10;

function EditUserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "student",
    status: user?.status || "active",
    studentId: user?.studentId || "",
    facultyId: user?.facultyId || "",
    adminId: user?.adminId || "",
    phone: user?.phone || "",
    department: user?.department || "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      studentId: prev.role === "student" ? prev.studentId : "",
      facultyId: prev.role === "faculty" ? prev.facultyId : "",
      adminId: prev.role === "admin" ? prev.adminId : "",
    }));
  }, [formData.role]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";
  const fields = [
    {
      label: "Full Name",
      name: "name",
      type: "text",
      placeholder: "John Doe",
      required: true,
    },
    {
      label: "Email Address",
      name: "email",
      type: "email",
      placeholder: "john@example.com",
      required: true,
    },
    {
      label: "Phone Number",
      name: "phone",
      type: "tel",
      placeholder: "+1 234 567 8900",
    },
    {
      label: "Department",
      name: "department",
      type: "text",
      placeholder: "Computer Science",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Personal Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className={inputClasses}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Account Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["role", "status"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`${inputClasses} bg-white`}
              >
                {field === "role"
                  ? ["student", "faculty", "admin"].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))
                  : ["active", "inactive", "pending", "suspended"].map(
                      (opt) => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ),
                    )}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Identification
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.role === "student" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className={inputClasses}
                placeholder="STU2024001"
              />
            </div>
          )}
          {formData.role === "faculty" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faculty ID
              </label>
              <input
                type="text"
                name="facultyId"
                value={formData.facultyId}
                onChange={handleChange}
                className={inputClasses}
                placeholder="FAC2024001"
              />
            </div>
          )}
          {formData.role === "admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin ID
              </label>
              <input
                type="text"
                name="adminId"
                value={formData.adminId}
                onChange={handleChange}
                className={inputClasses}
                placeholder="ADM2024001"
              />
            </div>
          )}
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
  const { userList } = useAdmin();
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

  useEffect(() => setUsers(userList), [userList]);

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
      const aVal = a[sortConfig.key],
        bVal = b[sortConfig.key];
      if (sortConfig.key.includes("Date") || sortConfig.key.includes("date"))
        return sortConfig.direction === "ascending"
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
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
        [user.studentId, user.facultyId, user.adminId].some((id) =>
          id?.toLowerCase().includes(searchTerm.toLowerCase()),
        )) &&
      (statusFilter === "all" || user.status === statusFilter) &&
      (roleFilter === "all" || user.role === roleFilter),
  );

  const handleStatusChange = (id, status) =>
    setUsers(users.map((u) => (u.id === id ? { ...u, status } : u)));
  const handleResetPassword = (id) =>
    alert(`Password reset link sent for user ID: ${id}`);
  const handleDeleteUser = (id) =>
    window.confirm("Are you sure you want to delete this user?") &&
    setUsers(users.filter((u) => u.id !== id));
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const handleSaveUser = (data) => {
    setUsers(
      users.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              ...data,
              id: u.id,
              lastLogin: u.lastLogin,
              joinedDate: u.joinedDate,
            }
          : u,
      ),
    );
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };
  const getRoleColor = (role) =>
    (({
      admin: "bg-red-100 text-red-800",
      faculty: "bg-green-100 text-green-800",
      student: "bg-blue-100 text-blue-800",
    })[role] || "bg-gray-100 text-gray-800") + " border border-gray-200";
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
                        ID: {user.studentId || user.facultyId || user.adminId}
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
                  options: ["all", "faculty", "student"],
                  label: "All Roles",
                },
                {
                  value: statusFilter,
                  setter: setStatusFilter,
                  options: [
                    "all",
                    "active",
                    "inactive",
                    "pending",
                    "suspended",
                  ],
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
        title={`Edit User: ${selectedUser?.name}`}
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
