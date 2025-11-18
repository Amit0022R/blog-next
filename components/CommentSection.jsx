"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  async function fetchComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("*, user:users(email)")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });
    if (!error) setComments(data || []);
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to comment.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("comments").insert({ post_id: postId, content: comment, user_id: user.id });
    setLoading(false);
    if (!error) {
      setComment("");
      fetchComments();
    }
  }

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2 text-sm" style={{ color: '#E5E5E5' }}>Comments</h4>
      <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
        <input
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="flex-1 px-2 py-1 rounded bg-[#1A1C1F] border border-[#2A2D35] text-sm"
          placeholder="Add a comment..."
          style={{ color: '#E5E5E5' }}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-3 py-1 rounded text-black text-xs font-semibold"
        >
          Post
        </button>
      </form>
      <div className="space-y-2">
        {comments.map(c => (
          <div key={c.id} className="bg-[#181A1E] rounded px-3 py-2 text-sm" style={{ color: '#9CA3AF' }}>
            <span className="font-medium" style={{ color: '#4AD7FF' }}>{c.user?.email || "User"}:</span> {c.content}
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-xs" style={{ color: '#666' }}>No comments yet.</div>
        )}
      </div>
    </div>
  );
}
