# Supabase Storage Setup for Images

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name it: `blog-images`
5. Make it **Public** (so images can be accessed)
6. Click **Create bucket**

## Step 2: Set Up Storage Policies

Go to **Storage** → **Policies** → Select `blog-images` bucket

Run this SQL in **SQL Editor**:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Allow anyone to read images (public access)
CREATE POLICY "Anyone can read images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images' AND (storage.foldername(name))[1] = auth.uid()::text);
```

## Step 3: Update Database Schema

Add `image_url` column to your `posts` table:

```sql
ALTER TABLE posts
ADD COLUMN image_url TEXT;
```

## Step 4: Test

1. Create a new blog post
2. Upload an image
3. Check if it appears in the blog listing and detail pages

That's it! Your image upload feature is ready! 🎉
