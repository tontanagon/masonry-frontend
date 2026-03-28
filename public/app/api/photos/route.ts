import { NextResponse } from "next/server";
import { fetchFromBackend } from "@/lib/backendApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filtersParam = searchParams.get("filters");
  const pageParam = searchParams.get("page") || "1";
  
  try {
    // Calling real Go backend
    // Typically ?category_id=x or similar depending on the exact implementation in the backend
    let backendEndpoint = `/galleries?page=${pageParam}`;
    if (filtersParam && filtersParam !== "all") {
      backendEndpoint += `&filters=${filtersParam}`;
    }
      
    const backendData = await fetchFromBackend(backendEndpoint);
    
    // The backend returns { data: [ {ID: 1, ImageURL: "...", Title: "...", Hashtags: [...] } ] }
    // We map this to our frontend Photo[] interface if necessary, or return directly.
    const mappedPhotos = (backendData.data || []).map((item: any) => ({
      id: item.ID || item.id,
      imageSrc: item.ImageURL || item.image_url || "https://placehold.co/600x600/e2e8f0/64748b?font=inter&text=No+Image",
      title: item.Title || item.title || "Untitled",
      tags: (item.Hashtags || item.hashtags || []).map((tag: any) => tag.Name || tag.name || String(tag)),
    }));
    
    return NextResponse.json(mappedPhotos);
  } catch (error) {
    console.error("Fetch photos via proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch from backend" }, { status: 500 });
  }
}
