export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="font-bold text-lg tracking-tight">The Gallery</div>

      {/* <nav className="hidden md:flex items-center space-x-10 text-sm font-medium text-gray-500">
        <a href="#" className="text-gray-900 border-b-2 border-gray-900 pb-1">Gallery</a>
      </nav> */}

      <div className="flex items-center gap-4">
        <div className="relative group hidden sm:block">
          <input
            type="text"
            placeholder="Search gallery..."
            className="pl-4 pr-10 py-2 w-64 bg-gray-100/80 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-gray-600 placeholder:text-gray-400"
          />
        </div>
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex flex-col justify-center items-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
