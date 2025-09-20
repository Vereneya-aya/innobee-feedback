import React, { useState, useEffect } from "react";

export default function FeedBackInput({
  onNextStep,
  onPreviousStep,
  updateFeedbackData,
  initialText = ""
}) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText || "");
  }, [initialText]);

  const handleNext = () => {
    if (text && text.length > 500) return; // guard; UI already shows counter
    updateFeedbackData({ improvementText: text });
    onNextStep();
  };

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Opinion (optional)</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        maxLength={500}
        placeholder="What went well? What could be improved?"
        style={{ width: "100%", marginTop: 6, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
      />
      <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
        {text.length}/500
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button
          type="button"
          onClick={onPreviousStep}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer"
          }}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "none",
            background: "#111",
            color: "white",
            cursor: "pointer",
            minWidth: 120
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}