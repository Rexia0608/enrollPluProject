// controllers/adminController.js

const getUserList = async (req, res) => {
  try {
    // Dummy data for testing
    const users = [
      {
        id: 1,
        name: "Alice Admin",
        email: "alice@school.edu",
        role: "student",
        status: "active",
      },
      {
        id: 2,
        name: "Bob Faculty",
        email: "bob@school.edu",
        role: "student",
        status: "active",
      },
      {
        id: 3,
        name: "Charlie Student",
        email: "charlie@school.edu",
        role: "student",
        status: "active",
      },
      {
        id: 4,
        name: "Daisy Student",
        email: "daisy@school.edu",
        role: "student",
        status: "active",
      },
    ];

    // Return JSON response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUserList:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getUserList };
