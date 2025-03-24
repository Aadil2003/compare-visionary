
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Interface for the CompareSlider component props
 * @prop beforeImage - URL of the first/baseline image
 * @prop afterImage - URL of the second/current image
 * @prop className - Optional additional CSS classes
 * @prop aspectRatio - Optional aspect ratio for the container (default: "16/9")
 * @prop diffPercentage - Optional percentage difference between images to display
 * @prop diffImageUrl - Optional URL for the difference image to display in tooltip
 */
interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  aspectRatio?: string;
  diffPercentage?: number;
  diffImageUrl?: string;
}

/**
 * A slider component that allows visual comparison between two images
 * Uses a draggable divider to reveal portions of each image
 * Optionally displays the difference percentage between images
 */
export function CompareSlider({
  beforeImage,
  afterImage,
  className,
  aspectRatio = "16/9",
  diffPercentage,
  diffImageUrl,
}: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  const [showDiffTooltip, setShowDiffTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  /**
   * Updates the slider position based on mouse/touch position
   * @param clientX - The X coordinate of the pointer
   */
  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const relativeX = clientX - containerRect.left;
    const newPosition = Math.max(0, Math.min(100, (relativeX / containerWidth) * 100));
    
    setPosition(newPosition);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    updatePosition(e.touches[0].clientX);
  };

  // Set up event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.touches[0].clientX);
    };

    const handleEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-lg border cursor-ew-resize select-none", className)}
      style={{ aspectRatio }}
    >
      {/* Before image (full width) */}
      <div className="absolute inset-0">
        <img 
          src={beforeImage} 
          alt="Before" 
          className="w-full h-full object-cover"
          draggable="false"
        />
      </div>
      
      {/* After image (clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden" 
        style={{ width: `${position}%` }}
      >
        <img 
          src={afterImage} 
          alt="After" 
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ width: `${100 / (position / 100)}%` }}
          draggable="false"
        />
      </div>
      
      {/* Divider line */}
      <div 
        className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)]"
        style={{ left: `${position}%` }}
      />
      
      {/* Drag handle with interactive diff tooltip */}
      <div 
        ref={handleRef}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => diffImageUrl && setShowDiffTooltip(true)}
        onMouseLeave={() => setShowDiffTooltip(false)}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 8L22 12L18 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 8L2 12L6 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Diff image tooltip */}
        {showDiffTooltip && diffImageUrl && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-md shadow-lg p-2 w-48 z-10">
            <img 
              src={diffImageUrl} 
              alt="Diff" 
              className="w-full h-auto rounded"
            />
            <div className="text-xs text-center mt-1 font-medium">
              Difference: {diffPercentage?.toFixed(2)}%
            </div>
          </div>
        )}
      </div>
      
      {/* Difference indicator */}
      {diffPercentage !== undefined && (
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
          diffPercentage > 5 ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}>
          {diffPercentage.toFixed(2)}% diff
        </div>
      )}
      
      {/* Labels */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
        Before
      </div>
      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
        After
      </div>
    </div>
  );
}
