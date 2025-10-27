import { useEffect, useState } from "react";
import API from "../utils/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Decode the JWT token safely and extract the current user ID
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCurrentUserId(null);
        console.info("No token found in localStorage.");
        return;
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload && (payload.id ?? payload.userId ?? payload.sub);
      setCurrentUserId(id !== undefined && id !== null ? Number(id) : null);
      console.info("Current user id set to:", id);
    } catch (err) {
      console.error("Failed to parse token payload:", err);
      setCurrentUserId(null);
    }
  }, []);

  // ✅ Fetch all posts from the API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/posts");

      // Normalize the response to always have `user_id`
      const normalized = res.data.map((p) => ({
        ...p,
        user_id: p.user_id ?? p.userId ?? null,
      }));

      setPosts(normalized);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      alert("Failed to load posts. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create a new post
  const createPost = async () => {
    if (!content) return alert("Content is required");
    try {
      await API.post("/posts", { content });
      setContent("");
      fetchPosts();
    } catch (err) {
      console.error("Create post error:", err);
      alert(err?.response?.data?.message || "Failed to create post");
    }
  };

  // ✅ Start editing a post
  const startEdit = (post) => {
    setEditing(post.id);
    setEditContent(post.content);
  };

  // ✅ Update a post
  const updatePost = async (id) => {
    try {
      await API.put(`/posts/${id}`, { content: editContent });
      setEditing(null);
      fetchPosts();
    } catch (err) {
      console.error("Update post error:", err);
      alert(err?.response?.data?.message || "Failed to update post");
    }
  };

  // ✅ Delete a post
  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error("Delete post error:", err);
      alert(err?.response?.data?.message || "Failed to delete post");
    }
  };

  // Fetch posts when the page loads
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6">
      {/* 🔹 Post creation area */}
      <div className="flex gap-2 mb-4">
        {currentUserId ? (
          <>
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a post..."
              className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={createPost}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
            >
              Post
            </button>
          </>
        ) : (
          <div className="flex-1 p-4 bg-yellow-50 border rounded">
            Please login to create posts.
          </div>
        )}
      </div>

      {/* 🔹 Posts list */}
      {loading ? (
        <div className="text-center p-4">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center p-4">No posts yet.</div>
      ) : (
        <ul>
          {posts.map((p) => (
            <li
              key={p.id}
              className="border p-4 mb-3 rounded shadow-sm bg-white"
            >
              {/* Post header */}
              <div className="flex justify-between items-start">
                <div>
                  <b>{p.username ?? "Unknown"}</b>
                  <div className="text-sm text-gray-500">
                    {new Date(p.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Display the owner's ID for debugging */}
                <div className="text-sm text-gray-400">
                  owner: {String(p.username)}
                </div>
              </div>

              {/* Post content / edit mode */}
              {editing === p.id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="border p-1 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button
                    onClick={() => updatePost(p.id)}
                    className="bg-green-500 px-3 rounded text-white hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="bg-gray-400 px-3 rounded text-white hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="mt-1">{p.content}</p>
              )}

              {/* 🔹 Show Edit/Delete buttons only if current user is the owner */}
              {Number(currentUserId) === Number(p.user_id) &&
                editing !== p.id && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="bg-yellow-500 px-2 rounded text-white hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(p.id)}
                      className="bg-red-500 px-2 rounded text-white hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
