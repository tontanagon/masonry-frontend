import { NextResponse } from "next/server";
import { fetchFromBackend } from "@/lib/backendApi";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filters, page } = body;
    
    // Proxy call to backend using POST with body
    const backendData = await fetchFromBackend("/galleries/search", {
      method: "POST",
      body: JSON.stringify({
        filters: filters || "all",
        page: page || 1
      }),
    });
    
    const mappedPhotos = (backendData.data || []).map((item: any) => ({
      id: item.ID || item.id,
      imageSrc: item.image || item.image_url || "https://placehold.co/600x600/e2e8f0/64748b?font=inter&text=No+Image",
      title: item.Title || item.title || "Untitled",
      tags: (item.Hashtags || item.hashtags || []).map((tag: any) => tag.Name || tag.name || String(tag)),
    }));
    
    return NextResponse.json(mappedPhotos);
  } catch (error) {
    console.error("Fetch photos via proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch from backend" }, { status: 500 });
  }
}
