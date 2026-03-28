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
async function getPhotos(filtersStr?: string) {
  try {
    const backendData = await fetchFromBackend("/galleries/search", {
      method: "POST",
      body: JSON.stringify({
        filters: filtersStr || "all",
        page: 1
      })
    });
    return (backendData.data || []).map((item: any) => ({
      id: item.ID || item.id,
      imageSrc: item.image || item.image_url || "https://placehold.co/600x600/e2e8f0/64748b?font=inter&text=No+Image",
      title: item.Title || item.title || "Untitled",
      tags: (item.Hashtags || item.hashtags || []).map((tag: any) => tag.Name || tag.name || String(tag)),
    }));
  } catch (err) {
    console.error("SSR failed to fetch galleries:", err);
    return [];
  }
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const filtersParam = typeof searchParams.filters === 'string' ? searchParams.filters : undefined;

  const [filters, photos] = await Promise.all([
    getFilters(),
    getPhotos(filtersParam),
  ]);

  return (
    <HomeIndex initialPhotos={photos} filters={filters} initialFilter={filtersParam || "all"} />
  );
}
