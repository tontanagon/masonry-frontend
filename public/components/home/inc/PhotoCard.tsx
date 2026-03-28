interface PhotoCardProps {
  imageSrc: string;
  title: string;
  tags: string[];
}

export default function PhotoCard({ imageSrc, title, tags }: PhotoCardProps) {
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
              className="bg-[#f0f2f0] text-gray-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
