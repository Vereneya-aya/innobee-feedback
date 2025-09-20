import React, { useState, useEffect } from "react";

export default function FeedBackBar({ onNextStep, updateFeedbackData, initialRating }) {
  const [rating, setRating] = useState(initialRating ?? 0);

  useEffect(() => {
    if (Number.isInteger(initialRating)) setRating(initialRating);
  }, [initialRating]);

  const choose = (n) => {
    setRating(n);
    updateFeedbackData({ rating: n });
  };

  return (
    <div style={{ padding: 16 }}>

      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
        Overall rating (1 = poor, 5 = excellent)
      </h3>

      <div style={{ display: "flex", gap: 8, margin: "8px 0 16px" }}>
        {[1,2,3,4,5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => choose(n)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: rating === n ? "2px solid #333" : "1px solid #ccc",
              background: rating === n ? "#f7f7f7" : "white",
              cursor: "pointer"
            }}
            aria-pressed={rating === n}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onNextStep}
        disabled={!Number.isInteger(rating) || rating < 1 || rating > 5}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          background: !Number.isInteger(rating) ? "#999" : "#111",
          color: "white",
          cursor: !Number.isInteger(rating) ? "not-allowed" : "pointer",
          minWidth: 160
        }}
      >
        Next
      </button>
    </div>
  );
}