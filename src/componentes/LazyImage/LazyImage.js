import React, { useState, useRef, useEffect } from "react";
import Loader from "../Loader/Loader";
import "./LazyImage.css";

const LazyImage = ({ src, alt, defaultSrc, className = "" }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "50px", // Começa a carregar 50px antes de entrar na viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView && !imageSrc) {
      setIsLoading(true);
      const imageToLoad = src || defaultSrc;
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(imageToLoad);
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setError(true);
        setIsLoading(false);
        setImageSrc(defaultSrc);
      };
      
      img.src = imageToLoad;
    }
  }, [isInView, src, defaultSrc, imageSrc]);

  return (
    <div ref={containerRef} className={`lazy-image-container ${className}`}>
      {isLoading && (
        <div className="lazy-image-loader">
          <Loader />
        </div>
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`lazy-image ${isLoading ? "lazy-image-hidden" : "lazy-image-visible"}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            if (!error) {
              setError(true);
              setImageSrc(defaultSrc);
            }
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;

