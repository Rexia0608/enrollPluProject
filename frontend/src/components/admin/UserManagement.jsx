// components/admin/UserManagement.jsx
import React, { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";
import { useAdmin } from "../../context/AdminContext";

function UserManagement() {
  const { userList } = useAdmin();
  const [users, setUsers] = useState([]);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    setUsers(userList);
  }, [userList]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Sort users based on configuration
  const getSortedUsers = () => {
    if (!sortConfig.key) return [...users];

    return [...users].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle dates
      if (sortConfig.key.includes("Date")) {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      }

      // Handle strings
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter users based on search and filters
  const filteredUsers = getSortedUsers().filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.studentId &&
        user.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.facultyId &&
        user.facultyId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.adminId &&
        user.adminId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handler functions
  const handleStatusChange = (userId, newStatus) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user,
      ),
    );
  };

  const handleResetPassword = (userId) => {
    alert(`Password reset link sent for user ID: ${userId}`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border border-red-200";
      case "faculty":
        return "bg-green-100 text-green-800 border border-green-200";
      case "student":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-3.5 h-3.5" />;
      case "faculty":
        return <Users className="w-3.5 h-3.5" />;
      case "student":
        return <Users className="w-3.5 h-3.5" />;
      default:
        return <Users className="w-3.5 h-3.5" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage student and faculty accounts</p>
      </div>

      <Card className="p-0 overflow-hidden">
        {/* Filter and Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Role Filter */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 pl-10 pr-10 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    User
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center">
                    Role
                    {sortConfig.key === "role" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("lastLogin")}
                >
                  <div className="flex items-center">
                    Last Login
                    {sortConfig.key === "lastLogin" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <UserIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-0.5">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            ID:{" "}
                            {user.studentId || user.facultyId || user.adminId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                        >
                          {getRoleIcon(user.role)}
                          <span className="ml-1.5 capitalize">{user.role}</span>
                        </div>
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
                        {/* Activate/Deactivate */}
                        {user.status === "active" ? (
                          <button
                            onClick={() =>
                              handleStatusChange(user.id, "inactive")
                            }
                            className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Deactivate"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleStatusChange(user.id, "active")
                            }
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Activate"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {/* Reset Password */}
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => console.log("Edit user:", user.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">
                        No users found
                      </p>
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

        {/* Footer with Stats */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredUsers.length}</span> of{" "}
            <span className="font-semibold">{users.length}</span> users
            {(searchTerm || statusFilter !== "all" || roleFilter !== "all") && (
              <span className="ml-2 text-gray-400 text-xs">(filtered)</span>
            )}
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600">
                Active: {users.filter((u) => u.status === "active").length}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-600">
                Inactive: {users.filter((u) => u.status === "inactive").length}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">
                Students: {users.filter((u) => u.role === "student").length}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UserManagement;
