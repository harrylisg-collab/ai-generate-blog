import { NextRequest, NextResponse } from "next/server";
import { createPost, updatePost, deletePost, getPostById } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "");

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const post = await getPostById(id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error: any) {
    console.error("GET posts error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, slug, excerpt, tags, author, published } = body;

    console.log("POST /api/posts received:", { title, slug, contentLength: content?.length, published });

    if (!title || !content || !slug) {
      return NextResponse.json({ error: "Title, content, and slug are required" }, { status: 400 });
    }

    const post = await createPost(
      title, 
      content, 
      slug, 
      excerpt || null, 
      tags || [], 
      author || 'Admin', 
      published || false
    );

    console.log("Post created successfully:", post.id);
    return NextResponse.json(post);

  } catch (error: any) {
    console.error("POST /api/posts error:", error);
    
    if (error.code === '23505') {
      return NextResponse.json({ error: "A post with this slug already exists. Please use a different slug." }, { status: 400 });
    }
    
    return NextResponse.json({ error: `Failed to create post: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, slug, excerpt, tags, author, published } = body;

    if (!id || !title || !content || !slug) {
      return NextResponse.json({ error: "ID, title, content, and slug are required" }, { status: 400 });
    }

    const post = await updatePost(
      id, 
      title, 
      content, 
      slug, 
      excerpt || null, 
      tags || [], 
      author || 'Admin', 
      published || false
    );

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("PUT /api/posts error:", error);
    
    if (error.code === '23505') {
      return NextResponse.json({ error: "A post with this slug already exists. Please use a different slug." }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "");

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/posts error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
