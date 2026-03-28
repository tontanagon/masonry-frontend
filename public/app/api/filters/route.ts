import { NextResponse } from "next/server";
import { fetchFromBackend } from "@/lib/backendApi";

export async function GET() {
  try {
    // Calling real Go backend
    const backendData = await fetchFromBackend("/hashtags");
    
    // Convert backend hashtags to the format expected by QuickFilters UI
    // Assuming backend returns { data: [ {ID: 1, Name: "Landscape" } ] }
    const mappedFilters = (backendData.data || []).map((tag: any) => ({
      label: `#${tag.Name || tag.name || String(tag)}`,
      active: false,
    }));

    return NextResponse.json(mappedFilters);
  } catch (error) {
    console.error("Fetch filters via proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch from backend" }, { status: 500 });
  }
}
