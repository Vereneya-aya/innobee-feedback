import React from "react";

export default function FeedBackThanks({ onStartNewFeedback }) {
  return (
    <div style={{ padding: 16 }}>
      <h2>Thanks for your feedback! ✅</h2>
      <p>Your response has been recorded.</p>
      {onStartNewFeedback && (
        <button
          style={{
            marginTop: 12,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
          onClick={onStartNewFeedback}
        >
          Send another response
        </button>
      )}
    </div>
  );
}