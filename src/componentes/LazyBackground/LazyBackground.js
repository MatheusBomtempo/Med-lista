import React, { useState, useRef, useEffect } from "react";
import "./LazyBackground.css";

const LazyBackground = ({ 
  backgroundImage, 
  className = "", 
  children,
  style = {} 
}) => {
  const [imageSrc, setImageSrc] = useState(null);
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
        rootMargin: "100px", // Começa a carregar 100px antes de entrar na viewport
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
    if (isInView && !imageSrc && backgroundImage) {
      // Pré-carrega a imagem
      const img = new Image();
      img.onload = () => {
        setImageSrc(backgroundImage);
      };
      img.src = backgroundImage;
    }
  }, [isInView, backgroundImage, imageSrc]);

  const backgroundStyle = {
    ...style,
    ...(imageSrc ? { backgroundImage: `url(${imageSrc})` } : {}),
  };

  return (
    <div 
      ref={containerRef} 
      className={`lazy-background ${className}`}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
};

export default LazyBackground;

