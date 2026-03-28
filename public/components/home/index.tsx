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
  initialPhotos: Photo[];
  filters: {
    label: string;
    active: boolean;
  }[];
  initialFilter: string;
}

export default function HomeIndex({ initialPhotos, filters, initialFilter }: HomeIndexProps) {
  const safeFilter = initialFilter || "all";
  const initialActiveArr = safeFilter === "all" ? ["all"] : safeFilter.split(",").map(f => `#${f.toUpperCase()}`);

  const safePhotos = initialPhotos || [];
  const [photos, setPhotos] = useState<Photo[]>(safePhotos);
  const [isLoading, setIsLoading] = useState(false);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(safePhotos.length === 8);
  const [currentFilters, setCurrentFilters] = useState<string[]>(initialActiveArr);
  
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);

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
      // Prepare string like "LANDSCAPE,URBAN" for API by stripping #
      let filterValue = "all";
      if (!activeFilters.includes("all")) {
        filterValue = activeFilters.map(f => f.replace("#", "")).join(",");
      }

      const res = await fetch(`/api/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filters: filterValue,
          page: targetPage
        })
      });
      
      if (!res.ok) throw new Error("Failed to search gallery from Next.js API");
      
      const newPhotos: Photo[] = await res.json();
      
      if (append) {
        setPhotos(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = newPhotos.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNew];
        });
      } else {
        setPhotos(newPhotos);
      }

      // If backend returns less than 8, no more data to load.
      setHasMore(newPhotos.length === 8);
    } catch (error) {
      console.error("Error fetching filtered photos", error);
    } finally {
      setIsLoading(false);
      loadingMoreRef.current = false;
    }
  };

  const handleFilterChange = useCallback((newActiveFilters: string[]) => {
    setCurrentFilters(newActiveFilters);
    setPage(1);
    
    // Update browser URL silently without triggering full Next.js reload
    let queryParam = "all";
    if (!newActiveFilters.includes("all")) {
      queryParam = newActiveFilters.map(f => f.replace("#", "")).join(",");
    }
    const newUrl = queryParam === "all" ? "/" : `/?filters=${encodeURIComponent(queryParam)}`;
    window.history.replaceState(null, "", newUrl);

    fetchPhotos(newActiveFilters, 1, false);
  }, []);

  const handleTagClickFromCard = (tag: string) => {
    // Normalizing tag format to match our internal state like "#TAG"
    const formattedTag = `#${tag.toUpperCase()}`;
    handleFilterChange([formattedTag]);
  };

  // Infinite Scroll Logic
  const loadMore = useCallback(() => {
    if (!hasMore || loadingMoreRef.current || photos.length === 0) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(currentFilters, nextPage, true);
  }, [hasMore, page, currentFilters, photos.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  // If initialPhotos changes entirely because of SSR, reset state
  useEffect(() => {
    const safePhotos = initialPhotos || [];
    setPhotos(safePhotos);
    setPage(1);
    setHasMore(safePhotos.length === 8);
  }, [initialPhotos]);

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

            <QuickFilters 
              filters={filters} 
              activeFilters={currentFilters}
              onFilterChange={handleFilterChange} 
            />

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
                      onTagClick={handleTagClickFromCard}
                    />
                  ))}
                </Masonry>
              ) : (
                <div className="col-span-full py-20 text-center text-gray-500">
                  No photos found for the selected filters.
                </div>
              )}
            </div>

            {hasMore && photos.length > 0 && (
              <div 
                ref={observerTarget} 
                className="w-full h-10 mt-10 flex items-center justify-center text-gray-400 text-xs tracking-widest uppercase"
              >
                {isLoading ? "" : "Loading archive..."}
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
