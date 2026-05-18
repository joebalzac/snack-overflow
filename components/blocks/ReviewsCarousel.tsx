"use client";

import { useState, useRef } from "react";
import { Review } from "@/lib/landing-page-api";

type Props = {
  title: string;
  reviews: Review[];
};

const StarRating = ({ rating, max = 5 }: { rating: number; max?: number }) => (
  <span
    aria-label={`${rating} out of ${max} stars`}
    role="img"
    className="flex gap-0.5"
  >
    {Array.from({ length: max }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}
      >
        ★
      </span>
    ))}
  </span>
);

const ReviewsCarousel = ({ title, reviews }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  const goToPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const goToNext = () =>
    setCurrentIndex((prev) => (prev + 1) % reviews.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goToNext();
    else if (diff < -50) goToPrev();
  };

  if (reviews.length === 0) return null;

  const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
  const nextIndex = (currentIndex + 1) % reviews.length;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={title}
      className="py-16 px-2 lg:px-6"
    >
      <h2 className="text-2xl lg:text-3xl font-extrabold text-center mb-10 text-red-900 uppercase">
        {title}
      </h2>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Review {currentIndex + 1} of {reviews.length}
      </div>

      <div className="relative flex items-center max-w-3xl mx-auto gap-4">
        <button
          onClick={goToPrev}
          aria-label={`Previous review: ${reviews[prevIndex].reviewerName} (${prevIndex + 1} of ${reviews.length})`}
          className="flex-shrink-0 bg-slate-200 py-1 rounded-full w-8 h-8 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="16" height="16" focusable="false">
            <path d="m24.5 0.932 4.3 4.38-14.5 14.6 14.5 14.5-4.3 4.4-14.6-14.6-4.4-4.3 4.4-4.4 14.6-14.6z" />
          </svg>
        </button>

        <div
          className="flex-1 relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {reviews.map((review, i) => (
            <article
              key={i}
              aria-roledescription="slide"
              aria-label={`Review by ${review.reviewerName}`}
              aria-hidden={i !== currentIndex}
              className={i === currentIndex ? "flex flex-col gap-5 bg-white rounded-2xl shadow-lg p-8" : "hidden"}
            >
              <StarRating rating={review.rating} />

              <blockquote>
                <p className="text-lg font-medium text-gray-900 leading-relaxed">
                  &ldquo;{review.body}&rdquo;
                </p>
              </blockquote>

              <footer className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                  {review.reviewerName.charAt(0)}
                </div>
                <cite className="not-italic flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {review.reviewerName}
                  </span>
                  {review.reviewerTitle && (
                    <span className="text-sm text-gray-500">
                      {review.reviewerTitle}
                    </span>
                  )}
                </cite>
              </footer>
            </article>
          ))}
        </div>

        <button
          onClick={goToNext}
          aria-label={`Next review: ${reviews[nextIndex].reviewerName} (${nextIndex + 1} of ${reviews.length})`}
          className="flex-shrink-0 bg-slate-200 py-1 rounded-full w-8 h-8 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="16" height="16" focusable="false">
            <path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6" aria-hidden="true">
        {reviews.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? "bg-red-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ReviewsCarousel;
