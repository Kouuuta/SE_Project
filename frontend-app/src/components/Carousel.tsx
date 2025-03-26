import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import "./Carousel.css";

interface CarouselProps {
  slides: {
    image: string;
    alt: string;
  }[];
  autoplayInterval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  slides,
  autoplayInterval = 5000,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(nextSlide, autoplayInterval);
    return () => clearInterval(interval);
  }, [isAutoplay, nextSlide, autoplayInterval]);

  return (
    <section
      className="carousel-section"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      <div className="carousel-wrapper">
        <div className="carousel-slides">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${
                index === activeSlide ? "active" : ""
              }`}
              style={{
                transform: `translateX(${(index - activeSlide) * 100}%)`,
              }}
            >
              <img src={slide.image} alt={slide.alt} />
            </div>
          ))}
        </div>

        <button
          className="carousel-control prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeftIcon size={24} />
        </button>
        <button
          className="carousel-control next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRightIcon size={24} />
        </button>

        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === activeSlide ? "active" : ""}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
