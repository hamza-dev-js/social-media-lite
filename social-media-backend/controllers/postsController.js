const db = require("../db");

// ✅ Get all posts (including username and user_id)
exports.getPosts = (req, res) => {
  const query = `
    SELECT 
      posts.id,
      posts.content,
      posts.created_at,
      posts.user_id,
      users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json(result);
  });
};

// ✅ Create a new post
exports.createPost = (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const query = "INSERT INTO posts (user_id, content) VALUES (?, ?)";
  db.query(query, [userId, content], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: "Post created successfully" });
  });
};

// ✅ Update a post (only owner can update)
exports.updatePost = (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const query = "UPDATE posts SET content = ? WHERE id = ? AND user_id = ?";
  db.query(query, [content, id, userId], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }
    res.status(200).json({ message: "Post updated successfully" });
  });
};

// ✅ Delete a post (only owner can delete)
exports.deletePost = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const query = "DELETE FROM posts WHERE id = ? AND user_id = ?";
  db.query(query, [id, userId], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  });
};
