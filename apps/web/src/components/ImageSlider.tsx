import * as React from "react";
import Button from "@/components/Button";

type ImageSliderProps = {
  images: string[];
};

const ImageSlider = ({ images }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!images || images.length === 0) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden px-5">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full max-h-[400px] rounded-4xl object-cover"
        />

        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
            {images.map((_, index) => (
              <span
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  index === currentIndex ? "bg-black scale-110" : "bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-8 mt-3">
          <Button
            onClick={prevSlide}
            className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent !text-black text-2xl font-bold"
            style={{
              minWidth: "auto",
              paddingLeft: "0px",
              paddingRight: "0px",
              fontSize: "24px",
            }}
            label="‹"
          />
          <Button
            onClick={nextSlide}
            className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent !text-black text-2xl px-0 font-bold"
            style={{
              minWidth: "auto",
              paddingLeft: "0px",
              paddingRight: "0px",
              fontSize: "24px",
            }}
            label="›"
          />
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
