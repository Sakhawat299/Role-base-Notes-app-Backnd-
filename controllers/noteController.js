const Note = require("../models/Note/Note");

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content, user: req.user.userId });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
