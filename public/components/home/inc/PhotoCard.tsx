interface PhotoCardProps {
  imageSrc: string;
  title: string;
  tags: string[];
  onTagClick?: (tag: string) => void;
}

export default function PhotoCard({ imageSrc, title, tags, onTagClick }: PhotoCardProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="relative overflow-hidden rounded-xl bg-gray-100">
        <img 
          src={imageSrc} 
          alt={title} 
          className="object-cover w-full h-auto group-hover:scale-105 transition-transform duration-700 ease-out" 
        />
      </div>
      <div>
        <div className="flex gap-2 mt-2">
          {tags.map((tag) => (
            <span 
              key={tag} 
              onClick={() => onTagClick && onTagClick(tag)}
              className="bg-[#f0f2f0] text-gray-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded cursor-pointer hover:bg-gray-200 hover:text-gray-600 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
