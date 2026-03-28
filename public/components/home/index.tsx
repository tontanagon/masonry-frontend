"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Masonry from "react-masonry-css";
import Header from "@/components/home/inc/Header";
import Sidebar from "@/components/home/inc/Sidebar";
import QuickFilters from "@/components/home/inc/QuickFilters";
import PhotoCard from "@/components/home/inc/PhotoCard";

interface Photo {
  id: number;
  imageSrc: string;
  title: string;
  tags: string[];
}

interface HomeIndexProps {
  photos: Photo[];
  filters: {
    label: string;
    active: boolean;
  }[];
}

export default function HomeIndex({ photos: initialPhotos, filters }: HomeIndexProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination & infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPhotos.length === 8);
  const [currentFilters, setCurrentFilters] = useState<string[]>(["all"]);
  
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);

  // Breakpoints for masonry layout
  const breakpointColumnsObj = {
    default: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  const fetchPhotos = async (activeFilters: string[], targetPage: number, append: boolean = false) => {
    loadingMoreRef.current = true;
    if (!append) setIsLoading(true);

    try {
      const queryParam = activeFilters.join(",");
      const res = await fetch(`/api/photos?filters=${encodeURIComponent(queryParam)}&page=${targetPage}`);
      
      if (!res.ok) throw new Error("Failed to fetch gallery from Next.js API");
      
      const newPhotos: Photo[] = await res.json();
      
      if (append) {
        setPhotos(prev => {
          // Remove potential duplicates
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = newPhotos.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNew];
        });
      } else {
        setPhotos(newPhotos);
      }

      // If backend returns less than the limit(8), then there's no more data
      setHasMore(newPhotos.length === 8);
    } catch (error) {
      console.error("Error fetching filtered photos", error);
    } finally {
      setIsLoading(false);
      loadingMoreRef.current = false;
    }
  };

  // Callback to handle filter change
  const handleFilterChange = useCallback((activeFilters: string[]) => {
    setCurrentFilters(activeFilters);
    setPage(1);
    fetchPhotos(activeFilters, 1, false);
  }, []);

  // IntersectionObserver to load more items
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMoreRef.current) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPhotos(currentFilters, nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, page, currentFilters]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-white flex flex-col">
      <Header />

      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 lg:p-14 pb-24 overflow-auto">
          <div className="max-w-5xl">

            <div className="mb-10 max-w-2xl">
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">The Gallery</h1>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                A silent sanctuary for editorial photography. Explore high fidelity captures through an
                intentional, quiet interface designed to let the art breathe.
              </p>
            </div>

            <QuickFilters filters={filters} onFilterChange={handleFilterChange} />

            <div className={`transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}>
              {photos && photos.length > 0 ? (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="flex w-auto -ml-6"
                  columnClassName="pl-6 bg-clip-padding"
                >
                  {photos.map((photo) => (
                    <PhotoCard
                      key={photo.id}
                      imageSrc={photo.imageSrc}
                      title={photo.title}
                      tags={photo.tags}
                    />
                  ))}
                </Masonry>
              ) : (
                <div className="col-span-full py-20 text-center text-gray-500">
                  No photos found for the selected filters.
                </div>
              )}
            </div>

            {/* Invisible target for IntersectionObserver to trigger 'load more' */}
            {hasMore && (
              <div 
                ref={observerTarget} 
                className="w-full h-10 mt-10 flex items-center justify-center text-gray-400 text-xs tracking-widest uppercase"
              >
                {loadingMoreRef.current ? "Loading more..." : ""}
              </div>
            )}

            {!hasMore && photos.length > 0 && (
              <div className="w-full mt-20 flex justify-center text-gray-400 text-xs tracking-[0.15em] uppercase pb-8">
                End of Archive
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
