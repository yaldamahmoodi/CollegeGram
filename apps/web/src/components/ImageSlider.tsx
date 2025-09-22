import * as React from "react";
import Button from "@/components/Button";

type ImageSliderProps = {
  images: string[];
};

const ImageSlider = (props: ImageSliderProps) => {
  const { images } = props;

  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!images || images.length === 0) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-80 h-60 overflow-hidden rounded-2xl shadow-md">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      <Button
        onClick={prevSlide}
        className="absolute  bg-transparent  text-black top-1/2 left-2 -translate-y-1/2  !text-lg"
        label="›"
      />
      <Button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2  bg-transparent !text-lg"
        label="‹"
      />
    </div>
  );
};

export default ImageSlider;
