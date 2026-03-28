import HomeIndex from "@/components/home/index";
import { fetchFromBackend } from "@/lib/backendApi";

// API Call for filters (SSR)
async function getFilters() {
  try {
    const backendData = await fetchFromBackend("/hashtags");
    return (backendData.data || []).map((tag: any) => ({
      label: `#${tag.Name || tag.name || String(tag)}`,
      active: false,
    }));
  } catch (err) {
    console.error("SSR failed to fetch hashtags:", err);
    return []; // fallback so rendering doesn't crash completely
  }
}

// API Call for photos (SSR)
async function getPhotos() {
  try {
    const backendData = await fetchFromBackend("/galleries");
    return (backendData.data || []).map((item: any) => ({
      id: item.ID || item.id,
      imageSrc: item.ImageURL || item.image_url || "https://placehold.co/600x600/e2e8f0/64748b?font=inter&text=No+Image",
      title: item.Title || item.title || "Untitled",
      tags: (item.Hashtags || item.hashtags || []).map((tag: any) => tag.Name || tag.name || String(tag)),
    }));
  } catch (err) {
    console.error("SSR failed to fetch galleries:", err);
    return [];
  }
}

export default async function Home() {
  const [filters, photos] = await Promise.all([
    getFilters(),
    getPhotos(),
  ]);

  return (
    <HomeIndex filters={filters} photos={photos} />
  );
}
