export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] py-8 pr-8 border-r border-gray-100 shrink-0 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto ml-10">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-900">Curated Collections</h2>
        <p className="text-xs text-gray-400 mt-1">Filter by aesthetic</p>
      </div>

      <nav className="flex-1 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md bg-gray-200/60 text-gray-900 transition-colors">
          <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          All Works
        </button>
      </nav>
    </aside>
  );
}
