const photofinder = async (req, res) => {
  try {
    let { file } = req.params;

    if (!/^[a-zA-Z0-9-_.]+$/.test(file)) {
      return res.status(400).json({ message: "Invalid file name" });
    }

    const requestedBase = path.basename(file, path.extname(file));

    const files = fs.readdirSync(uploadDir);

    const matchedFile = files.find((f) => {
      const baseName = path.basename(f, path.extname(f));
      return (
        baseName === requestedBase || baseName.startsWith(requestedBase + "-")
      );
    });

    if (!matchedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(uploadDir, matchedFile);

    // 🔥 IMPORTANT HEADERS FIX
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cache-Control", "no-store");

    return res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
