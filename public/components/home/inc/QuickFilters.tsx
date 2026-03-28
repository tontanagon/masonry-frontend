"use client";

interface FilterType {
  label: string;
}

interface QuickFiltersProps {
  filters: FilterType[];
  activeFilters: string[];
  onFilterChange: (activeFilters: string[]) => void;
}

export default function QuickFilters({ filters, activeFilters, onFilterChange }: QuickFiltersProps) {
  function handleFilterClick(filter: string) {
    let newFilters: string[] = [];

    if (filter === "all") {
      newFilters = ["all"];
    } else {
      if (activeFilters.includes(filter)) {
        newFilters = activeFilters.filter((f) => f !== filter);
        if (newFilters.length === 0) newFilters = ["all"];
      } else {
        newFilters = [...activeFilters.filter((f) => f !== "all"), filter];
      }
    }

    onFilterChange(newFilters);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap mb-10">
      <span className="text-xs font-semibold text-gray-400 tracking-wider mr-2">FILTERS:</span>
      <button
        className={`px-5 py-2 rounded-full text-[13px] font-medium transition-colors shadow-sm cursor-pointer ${activeFilters.includes("all")
          ? "bg-[#4d637c] text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        onClick={() => handleFilterClick("all")}
      >
        all
      </button>
      {filters.map((filter) => (
        <button
          key={filter.label}
          onClick={() => handleFilterClick(filter.label)}
          className={`px-5 py-2 rounded-full text-[13px] font-medium transition-colors shadow-sm cursor-pointer ${activeFilters.includes(filter.label)
            ? "bg-[#4d637c] text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
