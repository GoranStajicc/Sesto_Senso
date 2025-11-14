interface ImgItem {
  id: string;
  src: string;
  alt: string;
  onClick?: () => void;
  fallbackContent?: React.ReactNode;
  overlayContent?: React.ReactNode;
}

interface SquareImageGridProps {
  images: ImgItem[];
  className?: string;
}

export default function SquareImageGrid({ images, className = 'gap-4' }: SquareImageGridProps) {
  return (
    <ul className={`grid grid-cols-2 lg:grid-cols-4 ${className}`}>
      {images.map((item) => (
        <li
          key={item.id}
          className="bg-[#2A2A2A] rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 active:scale-95 border border-[#FF6B35]/20"
          onClick={item.onClick}
        >
          <div className="relative aspect-square overflow-hidden">
            {item.src ? (
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              item.fallbackContent
            )}
            {item.overlayContent}
          </div>
        </li>
      ))}
    </ul>
  );
}
