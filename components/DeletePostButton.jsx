"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DeletePostButton({ postId, onDeleted = null }) {
  const router = useRouter();

  async function handleDelete(e) {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      alert("Failed to delete post: " + error.message);
    } else {
      if (onDeleted) onDeleted();
      else router.refresh();
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="mt-2 px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
      style={{ display: 'block' }}
    >
      Delete
    </button>
  );
}
