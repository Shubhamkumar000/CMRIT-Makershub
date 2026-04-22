import { useState } from "react";
import { X } from "lucide-react";
import cmrit1 from "@/assets/cmrit1.jpeg";
import cmrit2 from "@/assets/cmrit2.jpeg";
import cmrit3 from "@/assets/cmrit3.jpeg";
import cmrit4 from "@/assets/cmrit4.jpeg";

const galleryImages = [
  { src: cmrit1, alt: "CMRIT makerspace facility view" },
  { src: cmrit2, alt: "CMRIT incubation event highlights" },
  { src: cmrit3, alt: "CMRIT collaborative workspace" },
  { src: cmrit4, alt: "CMRIT innovation lab setup" },
];

type ImageCardProps = {
  src: string;
  alt: string;
  index: number;
  onClick: (index: number) => void;
};

const ImageCard = ({ src, alt, index, onClick }: ImageCardProps) => {
  return (
    <div className="relative overflow-visible">
      <button
        onClick={() => onClick(index)}
        className="group relative z-0 h-[260px] w-full overflow-visible rounded-xl border border-border/30 bg-card transition-all duration-500 ease-in-out hover:z-50 hover:-translate-y-[5px] hover:shadow-2xl hover:shadow-black/35 sm:h-[320px] lg:h-[520px]"
        aria-label={`Open image ${index + 1}`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          <img
            src={src}
            alt={alt}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-100 transition-all duration-500 ease-in-out group-hover:scale-95 group-hover:opacity-0"
          />
          <img
            src={src}
            alt={alt}
            className="pointer-events-none absolute inset-0 h-full w-full scale-90 object-contain p-2 opacity-0 transition-all duration-500 ease-in-out group-hover:scale-100 group-hover:opacity-100"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-all duration-500 ease-in-out group-hover:bg-black/12" />
        </div>
      </button>
    </div>
  );
};

const SchoolsSection = () => {
  const [activeImage, setActiveImage] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="relative overflow-visible rounded-3xl border border-border/50 bg-card/75 p-4 shadow-2xl backdrop-blur-sm md:p-6">
          <div className="grid grid-cols-1 gap-3 rounded-2xl overflow-visible sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((image, index) => (
              <ImageCard
                key={image.src}
                src={image.src}
                alt={image.alt}
                index={index}
                onClick={setActiveImage}
              />
            ))}
          </div>
        </div>

        {activeImage !== null && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setActiveImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Expanded gallery image"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute right-5 top-5 rounded-full border border-white/40 bg-black/40 p-2 text-white hover:bg-black/60"
              aria-label="Close image"
            >
              <X size={22} />
            </button>
            <img
              src={galleryImages[activeImage].src}
              alt={galleryImages[activeImage].alt}
              className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default SchoolsSection;
