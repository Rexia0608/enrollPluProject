const setAnnouncement = async (req, res) => {
  try {
    console.log(req.body);
    return res.status(200).json(req.body);
  } catch (error) {
    console.error("Error in setMaintenance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getStats = async (req, res) => {
  try {
    const STATS = {
      Enrollment: { students: 400, sent: 0, pending: 245 },
      Prelim: { students: 245, sent: 198, pending: 47 },
      Midterm: { students: 245, sent: 212, pending: 33 },
      "Pre-Final": { students: 245, sent: 187, pending: 58 },
      Final: { students: 245, sent: 156, pending: 89 },
      Summer: { students: 120, sent: 45, pending: 75 },
      "Testda/Short-Courses": { students: 85, sent: 32, pending: 53 },
    };
    return res.status(200).json(STATS);
  } catch (error) {
    console.error("Error in setMaintenance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { setAnnouncement, getStats };
