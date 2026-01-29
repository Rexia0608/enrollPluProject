// components/admin/UserManagement.jsx
import React, { useState } from "react";
import {
  Users,
  Shield,
  Key,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";

function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      role: "student",
      status: "active",
      joinedDate: "2024-01-15",
      lastLogin: "2024-01-18",
      studentId: "S2024001",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "faculty",
      status: "active",
      joinedDate: "2023-08-20",
      lastLogin: "2024-01-18",
      facultyId: "F2023001",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.j@example.com",
      role: "student",
      status: "inactive",
      joinedDate: "2024-01-10",
      lastLogin: "2024-01-12",
      studentId: "S2024002",
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      role: "admin",
      status: "active",
      joinedDate: "2023-09-15",
      lastLogin: "2024-01-18",
      adminId: "A2023001",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael.b@example.com",
      role: "student",
      status: "suspended",
      joinedDate: "2024-01-05",
      lastLogin: "2024-01-08",
      studentId: "S2024003",
    },
    {
      id: 6,
      name: "Emily Davis",
      email: "emily.d@example.com",
      role: "faculty",
      status: "active",
      joinedDate: "2023-10-10",
      lastLogin: "2024-01-18",
      facultyId: "F2023002",
    },
    {
      id: 7,
      name: "David Wilson",
      email: "david.w@example.com",
      role: "student",
      status: "pending",
      joinedDate: "2024-01-16",
      lastLogin: "2024-01-16",
      studentId: "S2024004",
    },
    {
      id: 8,
      name: "Lisa Taylor",
      email: "lisa.t@example.com",
      role: "faculty",
      status: "inactive",
      joinedDate: "2023-11-05",
      lastLogin: "2023-12-20",
      facultyId: "F2023003",
    },
  ]);

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
        return "bg-red-100 text-red-800";
      case "faculty":
        return "bg-green-100 text-green-800";
      case "student":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "faculty":
        return <Users className="w-4 h-4" />;
      case "student":
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage student and faculty accounts</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
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
                        <div className="flex items-center space-x-2 mt-1">
                          <div
                            className={`flex items-center px-2 py-0.5 rounded text-xs ${getRoleColor(user.role)}`}
                          >
                            {getRoleIcon(user.role)}
                            <span className="ml-1 capitalize">{user.role}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.studentId || user.facultyId || user.adminId}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.lastLogin}
                    </div>
                    <div className="text-xs text-gray-600">
                      Joined: {user.joinedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {/* Activate/Deactivate */}
                      {user.status === "active" ? (
                        <button
                          onClick={() =>
                            handleStatusChange(user.id, "inactive")
                          }
                          className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                          title="Deactivate"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(user.id, "active")}
                          className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title="Activate"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {/* Reset Password */}
                      <button
                        onClick={() => handleResetPassword(user.id)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Reset Password"
                      >
                        <Key className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => console.log("Edit user:", user.id)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {users.length} users
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UserManagement;
