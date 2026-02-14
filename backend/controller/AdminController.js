// controllers/adminController.js

const getUserList = async (req, res) => {
  try {
    // Dummy data for testing
    const users = [
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
    ];

    // Return JSON response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUserList:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCourseList = async (req, res) => {
  try {
    const initialCourses = [
      {
        id: 1,
        code: "BSCS",
        name: "Bachelor of Science in Computer Science",
        type: "4 years Course",
        started_date: "2023-09-01",
        end_date: "2027-06-30",
        status: "active",
      },
      {
        id: 2,
        code: "CSS",
        name: "Computer System Servicing NC II",
        type: "Short Course",
        started_date: "2024-01-15",
        end_date: "2024-06-15",
        status: "active",
      },
      {
        id: 3,
        code: "BSIT",
        name: "Bachelor of Science in Information Technology",
        type: "4 years Course",
        started_date: "2023-09-01",
        end_date: "2027-06-30",
        status: "inactive",
      },
      {
        id: 4,
        code: "HUMSS",
        name: "Humanities and Social Sciences",
        type: "2 years Course",
        started_date: "2024-01-20",
        end_date: "2026-01-20",
        status: "active",
      },
      {
        id: 5,
        code: "STEM",
        name: "Science, Technology, Engineering and Mathematics",
        type: "2 years Course",
        started_date: "2024-02-01",
        end_date: "2026-02-01",
        status: "inactive",
      },
    ];

    res.status(200).json(initialCourses);
  } catch (error) {
    console.error("Error in getUserList:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const overView = async (req, res) => {
  try {
    const systemOverview = [
      {
        title: "Total Students",
        value: "1,248",
        change: 12,
        icon: "Users",
        color: "blue",
      },
      {
        title: "Pending Documents",
        value: "42",
        change: -5,
        icon: "FileText",
        color: "yellow",
      },
      {
        title: "Pending Payments",
        value: "28",
        change: 8,
        icon: "CreditCard",
        color: "red",
      },
      {
        title: "Enrolled Students",
        value: "876",
        change: 15,
        icon: "CheckCircle",
        color: "green",
      },
    ];
    res.status(200).json(systemOverview);
  } catch (error) {
    console.error("Error in overView:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getUserList, getCourseList, overView };
