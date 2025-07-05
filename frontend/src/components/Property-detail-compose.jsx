import React, { useEffect, useState } from "react";

const ThumbnailCarousel = ({ media, currentIndex, setCurrentIndex }) => {
  const THUMBS_PER_PAGE = 6;
  const [startIdx, setStartIdx] = useState(0);

  useEffect(() => {
    if (
      currentIndex < startIdx ||
      currentIndex >= startIdx + THUMBS_PER_PAGE
    ) {
      setStartIdx(currentIndex - (currentIndex % THUMBS_PER_PAGE));
    }
  }, [currentIndex,startIdx]);

  const visibleThumbs = media.slice(startIdx, startIdx + THUMBS_PER_PAGE);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < media.length - 1;

  const handlePrev = () => {
    if (canPrev) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      if (newIndex < startIdx) {
        setStartIdx(Math.max(startIdx - 1, 0));
      }
    }
  };

  const handleNext = () => {
    if (canNext) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      if (newIndex >= startIdx + THUMBS_PER_PAGE) {
        setStartIdx(startIdx + 1);
      }
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={handlePrev}
        disabled={!canPrev}
        className={`p-2 rounded-full bg-white shadow hover:bg-gray-100 ${
          !canPrev ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        ◀
      </button>
      <div className="grid grid-cols-6 gap-2 flex-1">
        {visibleThumbs.map((item, idx) => {
          const realIdx = startIdx + idx;
          return (
            <div
              key={realIdx}
              onClick={() => setCurrentIndex(realIdx)}
              className={`cursor-pointer rounded overflow-hidden border ${
                realIdx === currentIndex ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {item.isVideo ? (
                <video
                  src={item.url}
                  className="w-full h-20 object-cover"
                  muted
                />
              ) : (
                <img
                  src={item.url}
                  alt={`thumb-${realIdx}`}
                  className="w-full h-20 object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={handleNext}
        disabled={!canNext}
        className={`p-2 rounded-full bg-white shadow hover:bg-gray-100 ${
          !canNext ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        ▶
      </button>
    </div>
  );
};

export default ThumbnailCarousel;
