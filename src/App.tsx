import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Layout, Maximize, Layers, Box, Smartphone, Upload, Trash2, Gauge, Monitor, CreditCard, Cuboid } from 'lucide-react';

// --- Types ---
type EffectType = 'zoom-out' | 'standard' | 'multiple' | 'coverflow' | 'stack' | 'cube';
type ContainerRatio = 'auto' | '21/9' | '16/9' | '4/3' | '1/1' | '3/4' | '9/16';

interface SlideEffect {
  id: EffectType;
  title: string;
  description: string;
  icon: React.ReactNode;
  code: string;
}

// --- Default Data ---
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1590004953392-5aba2e72269a?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1590004845575-cc18b13d1d0a?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1590004987778-bece5c9adab6?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1590005176489-db2e714711fc?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1504198266287-1659872e6590?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80"
];

// --- Code Snippet Generator ---
const getCodeSnippet = (type: EffectType) => {
  const commonImports = `import * as React from "react";\nimport "keen-slider/keen-slider.min.css";\nimport { useKeenSlider } from "keen-slider/react";\n\n`;
  const imagesArray = `// Replace with your dynamic images\nconst images = [\n  "https://images.unsplash.com/...",\n  "https://images.unsplash.com/...",\n  "https://images.unsplash.com/..."\n];\n\n`;

  switch (type) {
    case 'cube':
      return `${commonImports}${imagesArray}export default function DynamicPolygonSlider() {
  const [rotation, setRotation] = React.useState(0);
  const slideCount = images.length;
  // Dynamic Geometry Calculation
  const width = 280; // card width
  const spacing = 50; // Gap between cards
  const angle = 360 / slideCount;
  // Calculate distance based on width + spacing
  const radius = (width + spacing) / (2 * Math.tan(Math.PI / slideCount));

  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: { origin: "center", perView: 1 },
    detailsChanged(s) {
      // Use absolute progress to support infinite rotation without rewind
      const progress = s.track.details.progress;
      setRotation(progress * 360);
    },
  });

  return (
    <div className="h-96 flex items-center justify-center overflow-hidden" style={{ perspective: '2500px' }}>
      <div 
        className="relative w-[280px] h-[180px]"
        style={{
           transformStyle: 'preserve-3d',
           transform: \`translateZ(-\${radius}px) rotateY(\${rotation}deg)\`, 
           transition: 'transform 0.1s' 
        }}
      >
        {images.map((src, idx) => (
           <div 
             key={idx} 
             className="absolute inset-0 backface-hidden"
             style={{
               transform: \`rotateY(\${idx * angle}deg) translateZ(\${radius}px)\`
             }}
           >
              <img src={src} className="w-full h-full object-cover rounded-xl shadow-lg border border-white/10" />
           </div>
        ))}
      </div>
      
      {/* Invisible controller on top to handle touch/drag */}
      <div ref={sliderRef} className="absolute inset-0 opacity-0" />
    </div>
  );
}`;
    case 'stack':
      return `${commonImports}${imagesArray}export default function StackSlider() {
  const [details, setDetails] = React.useState(null);
  const [sliderRef] = useKeenSlider({
    loop: true,
    initial: 0,
    slides: { origin: "center", perView: 1 },
    detailsChanged(s) {
      setDetails(s.track.details);
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider h-80 relative">
      {images.map((src, idx) => (
         <div key={idx} className="keen-slider__slide" style={{ maxWidth: '300px', margin: '0 auto' }}>
            <img src={src} className="w-full h-full object-cover rounded-xl shadow-xl" />
         </div>
      ))}
    </div>
  );
}`;
    case 'zoom-out':
      return `${commonImports}${imagesArray}export default function ZoomOutSlider() {
  const [details, setDetails] = React.useState(null);
  const [sliderRef] = useKeenSlider({
    loop: true,
    initial: 1,
    slides: { origin: "center", perView: 2, spacing: 15 },
    detailsChanged(s) {
      setDetails(s.track.details);
    },
  });

  function scaleStyle(idx) {
    if (!details) return {};
    const slide = details.slides[idx];
    const scale_size = 0.7;
    const scale = 1 - (scale_size - scale_size * slide.portion);
    return {
      transform: \`scale(\${scale})\`,
      opacity: scale,
    };
  }

  return (
    <div ref={sliderRef} className="keen-slider h-64">
      {images.map((src, idx) => (
        <div key={idx} className="keen-slider__slide flex items-center justify-center">
          <div style={scaleStyle(idx)} className="w-full h-full transition-all duration-500 ease-in-out">
            <img src={src} className="w-full h-full object-cover rounded-xl shadow-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}`;
    case 'standard':
      return `${commonImports}${imagesArray}export default function StandardSlider() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    slides: { perView: 1 },
  });

  return (
    <div ref={sliderRef} className="keen-slider h-64 rounded-xl overflow-hidden">
      {images.map((src, idx) => (
        <div key={idx} className="keen-slider__slide">
          <img src={src} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}`;
    case 'multiple':
      return `${commonImports}${imagesArray}export default function MultipleSlider() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 3.5,
      spacing: 15,
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider h-64">
      {images.map((src, idx) => (
        <div key={idx} className="keen-slider__slide rounded-xl overflow-hidden shadow-md">
          <img src={src} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}`;
    case 'coverflow':
      return `${commonImports}// Note: CSS 3D transforms are handled in styles
${imagesArray}export default function CoverflowSlider() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: { origin: "center", perView: 2.5, spacing: 10 },
  });

  return (
    <div ref={sliderRef} className="keen-slider h-64 perspective-1000">
      {images.map((src, idx) => (
        <div key={idx} className="keen-slider__slide">
           <img src={src} className="w-full h-full object-cover rounded-xl" />
        </div>
      ))}
    </div>
  );
}`;
    default:
      return '';
  }
};

const EFFECTS: SlideEffect[] = [
  {
    id: 'cube',
    title: 'Cube 3D',
    description: '360° Infinite Panoramic Rotation',
    icon: <Cuboid size={18} />,
    code: getCodeSnippet('cube')
  },
  {
    id: 'stack',
    title: 'Stack',
    description: 'Card Deck Effect',
    icon: <CreditCard size={18} />,
    code: getCodeSnippet('stack')
  },
  {
    id: 'zoom-out',
    title: 'Zoom Out',
    description: 'Focus Zoom Effect',
    icon: <Maximize size={18} />,
    code: getCodeSnippet('zoom-out')
  },
  {
    id: 'standard',
    title: 'Standard',
    description: 'Classic Slider',
    icon: <Box size={18} />,
    code: getCodeSnippet('standard')
  },
  {
    id: 'multiple',
    title: 'Carousel',
    description: 'Multi-Item View',
    icon: <Layout size={18} />,
    code: getCodeSnippet('multiple')
  },
  {
    id: 'coverflow',
    title: 'Coverflow',
    description: 'iTunes Style 3D',
    icon: <Layers size={18} />,
    code: getCodeSnippet('coverflow')
  }
];

// --- Simulator Components ---
interface PreviewSimulatorProps {
  type: EffectType;
  images: string[];
  aspectRatioClass: string;
  autoPlaySpeed: number;
  containerRatio: ContainerRatio;
}

const PreviewSimulator = ({ type, images, aspectRatioClass, autoPlaySpeed, containerRatio }: PreviewSimulatorProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = images.length;
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragX, setDragX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartTimeRef = useRef<number>(0);

  useEffect(() => {
    setActiveIndex(0);
    setDragX(0);
  }, [images]);

  useEffect(() => {
    if (total === 0 || isDragging) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => prev + 1); // Infinite loop
    }, autoPlaySpeed);
    return () => clearInterval(timer);
  }, [total, isDragging, autoPlaySpeed]);

  const updateIndex = (change: number) => {
      setActiveIndex((prev) => prev + change);
      setDragX(0);
  };

  const next = () => updateIndex(1);
  const prev = () => updateIndex(-1);

  const getCardWidth = () => {
      if (!containerRef.current) return 300; 
      const containerW = containerRef.current.offsetWidth;
      switch (type) {
          case 'standard': return containerW;
          case 'zoom-out': return containerW * 0.45;
          case 'multiple': return containerW * 0.30 + 24;
          case 'coverflow': return containerW * 0.35;
          case 'stack': return containerW * 0.8;
          case 'cube': return 280; 
          default: return 300;
      }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
    setDragX(0);
    dragStartTimeRef.current = Date.now();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const diff = e.clientX - startX;
    setDragX(diff);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    const dragDuration = Date.now() - dragStartTimeRef.current;
    const cardWidth = getCardWidth();
    
    let moveCount = -Math.round(dragX / cardWidth);

    if (moveCount === 0 && dragDuration < 300 && Math.abs(dragX) > 40) {
        moveCount = dragX > 0 ? -1 : 1;
    }

    if (moveCount !== 0) {
        updateIndex(moveCount);
    } else {
        setDragX(0);
    }
  };

  const getNormalizedOffset = (index: number, activeIdx: number, totalSlides: number) => {
      let offset = index - activeIdx;
      while (offset < -totalSlides / 2) offset += totalSlides;
      while (offset > totalSlides / 2) offset -= totalSlides;
      return offset;
  };

  if (total === 0) return <div className="text-slate-500">No images to display</div>;

  const getContainerStyle = () => {
      const baseStyle: React.CSSProperties = { width: '100%', position: 'relative' };
      if (containerRatio === 'auto') {
          if (type === 'stack' && aspectRatioClass === 'aspect-[3/4]') return { ...baseStyle, aspectRatio: '3/4' };
          if (type === 'cube' && aspectRatioClass !== 'aspect-video') {
             if (aspectRatioClass === 'aspect-[3/4]') return { ...baseStyle, aspectRatio: '3/4' };
             if (aspectRatioClass === 'aspect-square') return { ...baseStyle, aspectRatio: '1/1' };
          }
          if (aspectRatioClass === 'aspect-[3/4]') return { ...baseStyle, aspectRatio: '3/4' };
          if (aspectRatioClass === 'aspect-square') return { ...baseStyle, aspectRatio: '1/1' };
          return { ...baseStyle, aspectRatio: '16/9' };
      }
      return { ...baseStyle, aspectRatio: containerRatio };
  };

  const containerStyle = getContainerStyle();
  const dragFraction = dragX / (type === 'cube' ? 280 : (containerRef.current ? getCardWidth() : 300));

  // --- RENDER LOGIC ---

  if (type === 'zoom-out') {
    return (
      <div 
        ref={containerRef}
        className="w-full max-w-4xl mx-auto flex items-center justify-center overflow-hidden bg-gray-900/50 rounded-2xl border border-gray-700/50 touch-none cursor-grab active:cursor-grabbing"
        style={containerStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="flex items-center justify-center w-full h-full relative pointer-events-none">
          {images.map((src, i) => {
            let offset = getNormalizedOffset(i, activeIndex, total) + dragFraction;
            while (offset < -total / 2) offset += total;
            while (offset > total / 2) offset -= total;
            
            if (Math.abs(offset) > 4.5) return null;

            const absOffset = Math.abs(offset);
            const isActive = absOffset < 0.5;
            
            let scale = 1.1 - Math.min(absOffset, 1) * 0.45;
            let opacity = 1 - Math.min(absOffset, 1) * 0.6;
            const zIndex = 20 - Math.round(absOffset);
            const translateX = offset * 60; 

            return (
              <div
                key={i}
                className={`absolute w-[45%] ${aspectRatioClass} transition-all ease-[cubic-bezier(0.25,0.1,0.25,1.0)]`} 
                style={{
                  transform: `translateX(${translateX}%) scale(${scale})`,
                  opacity: Math.max(opacity, 0.4),
                  zIndex: zIndex,
                  transitionDuration: isDragging ? '0ms' : '700ms'
                }}
              >
                <img src={src} className="w-full h-full object-cover rounded-xl shadow-2xl pointer-events-none" alt="" />
                {isActive && !isDragging && (
                   <div className="absolute inset-0 ring-2 ring-indigo-500 rounded-xl pointer-events-none transition-opacity duration-300" />
                )}
              </div>
            );
          })}
        </div>
        
        <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 z-30 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-colors pointer-events-auto"><ChevronLeft size={24} /></button>
        <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 z-30 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-colors pointer-events-auto"><ChevronRight size={24} /></button>
      </div>
    );
  }

  if (type === 'standard') {
    return (
      <div 
        ref={containerRef}
        className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gray-900/50 border border-gray-700/50 group touch-none cursor-grab active:cursor-grabbing"
        style={containerStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div 
            className="flex h-full transition-transform ease-out"
            style={{ 
                position: 'relative',
                width: '100%'
            }}
        >
          {images.map((src, i) => {
             let offset = getNormalizedOffset(i, activeIndex, total) + dragFraction;
             while (offset < -total / 2) offset += total;
             while (offset > total / 2) offset -= total;

             if (Math.abs(offset) > 1.5) return null;

             return (
                <div 
                    key={i} 
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 pointer-events-none transition-transform ease-out"
                    style={{
                        transform: `translateX(${offset * 100}%)`,
                        transitionDuration: isDragging ? '0ms' : '700ms'
                    }}
                >
                    <img src={src} className="w-full h-full object-cover select-none" alt="" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                        <h3 className="text-white font-bold text-2xl">Slide {i + 1}</h3>
                    </div>
                </div>
             );
          })}
        </div>
         <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 pointer-events-none z-10">
            {images.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${(i === (activeIndex % total + total) % total) ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
            ))}
        </div>
      </div>
    );
  }

  if (type === 'multiple') {
    return (
      <div 
        ref={containerRef}
        className="w-full overflow-hidden bg-gray-900/50 rounded-2xl border border-gray-700/50 p-6 flex items-center touch-none cursor-grab active:cursor-grabbing"
        style={containerStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="relative w-full h-full">
          {images.map((src, i) => {
            let offset = getNormalizedOffset(i, activeIndex, total) + dragFraction;
            while (offset < -total / 2) offset += total;
            while (offset > total / 2) offset -= total;
            
            if (Math.abs(offset) > 3) return null;

            return (
                <div key={i} 
                    className={`absolute top-0 bottom-0 w-[30%] ${aspectRatioClass} rounded-xl overflow-hidden shadow-lg group pointer-events-none transition-transform ease-out`}
                    style={{
                        left: '50%',
                        marginLeft: '-15%', 
                        transform: `translateX(${offset * 110}%)`,
                        transitionDuration: isDragging ? '0ms' : '700ms'
                    }}
                >
                    <img src={src} className="w-full h-full object-cover select-none" alt="" />
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">Card {i+1}</div>
                </div>
            )
          })}
        </div>
      </div>
    );
  }

  if (type === 'coverflow') {
      return (
        <div 
            ref={containerRef}
            className="w-full max-w-5xl mx-auto flex items-center justify-center overflow-hidden bg-gray-900/50 rounded-2xl border border-gray-700/50 perspective-1000 touch-none cursor-grab active:cursor-grabbing"
            style={containerStyle}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
          <div className="flex items-center justify-center w-full h-full relative pointer-events-none" style={{ perspective: '1200px' }}>
            {images.map((src, i) => {
              let offset = getNormalizedOffset(i, activeIndex, total) + dragFraction;
              while (offset < -total / 2) offset += total;
              while (offset > total / 2) offset -= total;
              
              if (Math.abs(offset) > 4.5) return null;
  
              const rotateY = offset * -35; 
              const translateX = offset * 50; 
              const zIndex = 20 - Math.round(Math.abs(offset));
              const opacity = 1 - Math.min(Math.abs(offset), 3) * 0.15;
              const scale = 1.2 - Math.min(Math.abs(offset), 2) * 0.2; 
  
              return (
                <div
                  key={i}
                  className={`absolute w-[35%] ${aspectRatioClass} ease-out shadow-2xl origin-center`}
                  style={{
                    transformStyle: 'preserve-3d', // Enable 3D for children (thickness)
                    transform: `translateX(${translateX}%) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex: zIndex,
                    opacity: opacity,
                    borderRadius: '12px',
                    transitionDuration: isDragging ? '0ms' : '700ms'
                  }}
                >
                    {/* Thickness Layers - Stacked plates to simulate depth */}
                    {[1, 2, 3, 4, 5].map(n => (
                        <div 
                            key={`depth-${n}`}
                            className="absolute inset-0 w-full h-full rounded-xl bg-slate-800"
                            style={{ transform: `translateZ(-${n}px)` }}
                        />
                    ))}

                    {/* Main Image Layer */}
                    <div className="absolute inset-0 w-full h-full" style={{ transform: 'translateZ(0.5px)' }}>
                        <img src={src} className="w-full h-full object-cover rounded-xl shadow-2xl pointer-events-none" alt="" />
                        <div className="absolute inset-0 bg-black/20 rounded-xl transition-opacity duration-300" style={{ opacity: Math.abs(offset) < 0.5 ? 0 : 0.5 }} />
                    </div>
                </div>
              );
            })}
          </div>
            
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 z-30 p-3 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur-sm transition-colors border border-white/10 pointer-events-auto"><ChevronLeft size={24} /></button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 z-30 p-3 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur-sm transition-colors border border-white/10 pointer-events-auto"><ChevronRight size={24} /></button>
        </div>
      );
  }

  if (type === 'stack') {
    return (
      <div 
        ref={containerRef}
        className="w-full max-w-md mx-auto flex items-center justify-center overflow-hidden bg-gray-900/50 rounded-2xl border border-gray-700/50 touch-none cursor-grab active:cursor-grabbing"
        style={containerStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="flex items-center justify-center w-full h-full relative pointer-events-none">
          {images.map((src, i) => {
            let rawOffset = getNormalizedOffset(i, activeIndex, total) + dragFraction;
            while (rawOffset < -total / 2) rawOffset += total;
            while (rawOffset > total / 2) rawOffset -= total;

            if (rawOffset > 3 || rawOffset < -1.5) return null;

            let translateX = 0;
            let rotate = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 0;

            if (rawOffset < 0) {
                translateX = rawOffset * 100;
                rotate = rawOffset * 10;
                opacity = 1 + rawOffset;
                scale = 1;
                zIndex = 100;
            } else {
                scale = 1 - (rawOffset * 0.05); 
                opacity = 1 - (rawOffset * 0.2);
                translateX = rawOffset * 10; 
                zIndex = 50 - Math.round(rawOffset);
            }

            return (
              <div
                key={i}
                className={`absolute w-[75%] ${aspectRatioClass} transition-all ease-[cubic-bezier(0.25,0.1,0.25,1.0)] origin-bottom`} 
                style={{
                  transform: rawOffset < 0 
                      ? `translateX(${translateX}%) rotate(${rotate}deg)` 
                      : `translate(${rawOffset * 8}px, ${-rawOffset * 8}px) scale(${scale})`, 
                  opacity: Math.max(opacity, 0),
                  zIndex: zIndex,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  transitionDuration: isDragging ? '0ms' : '500ms'
                }}
              >
                <img src={src} className="w-full h-full object-cover rounded-xl pointer-events-none border border-white/10" alt="" />
                {rawOffset > 0 && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl transition-all duration-300" />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-50 pointer-events-auto">
             <button onClick={(e) => { e.stopPropagation(); prev(); }} className="p-3 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-colors"><ChevronLeft size={20} /></button>
             <button onClick={(e) => { e.stopPropagation(); next(); }} className="p-3 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>
    );
  }

  if (type === 'cube') {
    const cubeWidth = 280; 
    let cubeHeight = cubeWidth * 0.5625; 
    if (aspectRatioClass === 'aspect-[3/4]') cubeHeight = cubeWidth * 1.33;
    if (aspectRatioClass === 'aspect-square') cubeHeight = cubeWidth;
    
    // --- Dynamic Geometry ---
    const count = images.length;
    const effectiveCount = Math.max(count, 3);
    const rotationAngle = 360 / effectiveCount;
    const spacing = 50; 
    const zDistance = ((cubeWidth + spacing) / 2) / Math.tan(Math.PI / effectiveCount);

    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center overflow-hidden bg-gray-900/50 rounded-2xl border border-gray-700/50 touch-none cursor-grab active:cursor-grabbing"
        style={{...containerStyle, perspective: '2500px'}} 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div 
            className="relative" 
            style={{ 
                width: `${cubeWidth}px`, 
                height: `${cubeHeight}px`,
                transformStyle: 'preserve-3d',
                transform: `translateZ(-${zDistance}px) rotateX(-2deg)`
            }}
        >
          {images.map((src, i) => {
             const itemBaseAngle = i * rotationAngle;
             const currentWorldRotation = (activeIndex - dragFraction) * -rotationAngle;
             const finalAngle = itemBaseAngle + currentWorldRotation;
             
             let normalizedAngle = finalAngle % 360;
             if (normalizedAngle > 180) normalizedAngle -= 360;
             if (normalizedAngle < -180) normalizedAngle += 360;
             
             if (Math.abs(normalizedAngle) > 110) return null;

             const shadowOpacity = Math.abs(normalizedAngle) / 180;

             return (
              <div
                key={i}
                className="absolute inset-0 w-full h-full backface-hidden transition-transform ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
                style={{
                  transform: `rotateY(${finalAngle}deg) translateZ(${zDistance}px)`,
                  transitionDuration: isDragging ? '0ms' : '700ms',
                }}
              >
                <img src={src} className="w-full h-full object-cover rounded-xl pointer-events-none shadow-2xl border border-white/5" alt="" />
                <div 
                    className="absolute inset-0 bg-black transition-opacity pointer-events-none rounded-xl" 
                    style={{ 
                        opacity: Math.min(shadowOpacity * 0.8, 0.8),
                        transitionDuration: isDragging ? '0ms' : '700ms'
                    }} 
                />
              </div>
             )
          })}
        </div>
        
        <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 z-30 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-colors pointer-events-auto"><ChevronLeft size={24} /></button>
        <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 z-30 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-colors pointer-events-auto"><ChevronRight size={24} /></button>
      </div>
    );
  }

  return null;
};

// --- App ---
export default function App() {
  const [selectedEffect, setSelectedEffect] = useState<EffectType>('cube'); 
  const [copied, setCopied] = useState(false);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [aspectRatioClass, setAspectRatioClass] = useState<string>('aspect-video');
  const [isPortrait, setIsPortrait] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState<number>(4000);
  const [containerRatio, setContainerRatio] = useState<ContainerRatio>('auto');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImages = customImages.length > 0 ? customImages : DEFAULT_IMAGES;
  const activeEffectData = EFFECTS.find(e => e.id === selectedEffect)!;

  useEffect(() => {
    if (displayImages.length > 0) {
      const img = new Image();
      img.src = displayImages[0];
      img.onload = () => {
        const ratio = img.width / img.height;
        if (ratio < 0.85) {
          setAspectRatioClass('aspect-[3/4]');
          setIsPortrait(true);
        } else if (ratio < 1.2) {
           setAspectRatioClass('aspect-square');
           setIsPortrait(true);
        } else {
           setAspectRatioClass('aspect-video');
           setIsPortrait(false);
        }
      };
    }
  }, [displayImages]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeEffectData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setCustomImages(newImages);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    setCustomImages([]);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
        multiple 
        accept="image/*"
      />
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Smartphone className="text-white" size={24} />
             </div>
             <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    Slider UI Kit
                </h1>
                <p className="text-xs text-slate-400">Based on Keen-Slider & React</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-xs text-slate-500 hidden sm:block">
                 当前卡片适配: <span className="text-indigo-400">{isPortrait ? 'Portrait (竖屏)' : 'Landscape (横屏)'}</span>
             </div>
             <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Documentation</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Select Effect</h2>
                    <p className="text-slate-400 text-sm">Choose a slider animation style.</p>
                </div>
                 <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-500 max-w-md">
                     System automatically adapts container ratio based on uploaded image. You can also force a specific ratio.
                 </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {EFFECTS.map((effect) => (
                    <button
                        key={effect.id}
                        onClick={() => setSelectedEffect(effect.id)}
                        className={`group relative flex flex-col items-center p-4 rounded-xl border text-center transition-all duration-300
                            ${selectedEffect === effect.id 
                                ? 'bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500/50' 
                                : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'}
                        `}
                    >
                        <div className={`p-3 rounded-lg mb-3 transition-colors ${selectedEffect === effect.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                            {effect.icon}
                        </div>
                        <h3 className={`font-semibold text-sm ${selectedEffect === effect.id ? 'text-indigo-300' : 'text-slate-200'}`}>
                            {effect.title}
                        </h3>
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur overflow-hidden relative group">
                <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 pointer-events-none">
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <div className="px-3 py-1 rounded-full bg-black/60 text-xs font-medium text-white backdrop-blur border border-white/10 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Live Preview
                        </div>
                         <div className="flex items-center bg-black/60 backdrop-blur border border-white/10 rounded-full p-1 gap-1">
                            <button 
                                onClick={() => setContainerRatio('auto')}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${containerRatio === 'auto' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Monitor size={12} /> Auto
                            </button>
                            <button 
                                onClick={() => setContainerRatio('21/9')}
                                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${containerRatio === '21/9' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >21:9</button>
                            <button 
                                onClick={() => setContainerRatio('16/9')}
                                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${containerRatio === '16/9' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >16:9</button>
                             <button 
                                onClick={() => setContainerRatio('4/3')}
                                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${containerRatio === '4/3' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >4:3</button>
                             <button 
                                onClick={() => setContainerRatio('1/1')}
                                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${containerRatio === '1/1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >1:1</button>
                        </div>
                    </div>
                    <div className="flex gap-2 pointer-events-auto">
                         {customImages.length > 0 && (
                            <button 
                                onClick={handleReset}
                                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
                            >
                                <Trash2 size={14} />
                                Reset
                            </button>
                         )}
                         <button 
                             onClick={triggerUpload}
                             className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
                         >
                             <Upload size={14} />
                             {customImages.length > 0 ? 'Change' : 'Upload'}
                         </button>
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 z-40 pointer-events-auto">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 flex items-center gap-4 shadow-2xl">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                             <Gauge size={16} className="text-indigo-400" />
                             <span className="font-semibold">Auto-Play Speed:</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="500" 
                                max="8000" 
                                step="100"
                                value={autoPlaySpeed}
                                onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                                className="w-32 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                            />
                            <div className="relative">
                                <input
                                    type="number"
                                    min="500"
                                    max="8000"
                                    step="100"
                                    value={autoPlaySpeed}
                                    onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                                    className="w-16 h-7 bg-slate-800 border border-slate-600 rounded text-center text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                                />
                                <span className="absolute right-[-14px] top-1.5 text-[10px] text-slate-500">ms</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-8 lg:p-12 min-h-[650px] flex flex-col items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20 transition-all duration-500">
                    <PreviewSimulator 
                        type={selectedEffect} 
                        images={displayImages} 
                        aspectRatioClass={aspectRatioClass}
                        autoPlaySpeed={autoPlaySpeed}
                        containerRatio={containerRatio}
                    />
                    <p className="mt-8 text-xs text-slate-500 font-mono">
                        {customImages.length > 0 
                            ? `Showing ${customImages.length} custom images`
                            : 'Using default Unsplash gallery'}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1117] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-2">
                         <div className="flex gap-1.5">
                             <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                             <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                         </div>
                         <span className="ml-3 text-xs text-slate-400 font-mono">SliderComponent.tsx</span>
                    </div>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all active:scale-95"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                </div>
                
                <div className="relative overflow-x-auto">
                    <pre className="p-4 text-sm font-mono leading-relaxed text-slate-300">
                        <code>{activeEffectData.code}</code>
                    </pre>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}