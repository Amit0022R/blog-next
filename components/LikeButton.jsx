"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LikeButton({ postId, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLiked();
    // eslint-disable-next-line
  }, [postId]);

  async function checkLiked() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();
    setLiked(!!data);
  }

  async function handleLike() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to like posts.");
      setLoading(false);
      return;
    }
    if (!liked) {
      const { error } = await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
      if (!error) {
        setLikes(likes + 1);
        setLiked(true);
      }
    } else {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
      if (!error) {
        setLikes(likes - 1);
        setLiked(false);
      }
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`mt-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${liked ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
    >
      {liked ? "💙 Liked" : "👍 Like"} {likes}
    </button>
  );
}

