export const uploadFile = (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  const messageType = req.file.mimetype.startsWith("image/") ? "image" : "file";

  res.status(201).json({
    fileUrl,
    originalName: req.file.originalname,
    messageType,
    size: req.file.size
  });
};
