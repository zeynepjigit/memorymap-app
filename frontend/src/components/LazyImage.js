import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className, style, placeholder = null, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsLoaded(false);
  };

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        ...style
      }}
      {...props}
    >
      {!isLoaded && placeholder && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            color: '#6c757d'
          }}
        >
          {placeholder}
        </div>
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          loading="lazy"
        />
      )}
      
      {!isLoaded && !placeholder && (
        <div
          className="loading-shimmer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;
