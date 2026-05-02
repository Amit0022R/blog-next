# Blogify - Full Stack Blog Application

A complete blog application built with Next.js 16 and Supabase, featuring user authentication, blog post creation, and management.

## Features

- ✅ User Authentication (Login/Signup)
- ✅ Protected Routes with Middleware
- ✅ Create Blog Posts
- ✅ View All Blog Posts
- ✅ View Individual Blog Post Details
- ✅ Logout Functionality
- ✅ Responsive Design with Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once your project is created, go to **Settings** → **API**
3. Copy your **Project URL** and **anon/public key**

### 3. Create Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase credentials.

### 4. Setup Database Table

In your Supabase dashboard, go to **SQL Editor** and run this query:

```sql
-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all posts
CREATE POLICY "Anyone can read posts" ON posts
  FOR SELECT USING (true);

-- Create policy to allow users to insert their own posts
CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own posts
CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own posts
CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
blog-nov/
├── app/
│   ├── blog/
│   │   ├── [id]/          # Individual blog post page
│   │   ├── create/        # Create new blog post
│   │   └── page.tsx       # Blog listing page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── layout.tsx         # Root layout
├── components/
│   └── Navbar.jsx         # Navigation bar with logout
├── lib/
│   ├── supabaseClient.js  # Browser Supabase client
│   └── supabaseServer.js  # Server Supabase client
└── middleware.js          # Authentication middleware
```

## Usage

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Login with your credentials at `/login`
3. **Create Post**: Click "Create Post" button to write a new blog post
4. **View Posts**: Browse all posts on the main blog page
5. **View Details**: Click on any post to read the full content
6. **Logout**: Click the logout button in the navbar

## Technologies Used

- **Next.js 16** - React framework with App Router
- **Supabase** - Backend as a Service (Auth + Database)
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**: Make sure your `.env.local` file has correct Supabase credentials
2. **"Table does not exist" error**: Run the SQL query in Supabase SQL Editor
3. **Authentication not working**: Check if RLS policies are set up correctly
4. **Middleware redirects not working**: Make sure `@supabase/ssr` package is installed

## License

MIT
