import React, { useState, useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { IoArrowBackOutline, IoArrowBackSharp } from "react-icons/io5"; // Import left arrow icon
import { IoMdCheckmark } from "react-icons/io";

const FeedBackInterest = ({ onFinish, onPreviousStep, updateFeedbackData, initialInterest }) => {
  const [isInterested, setIsInterested] = useState(initialInterest === true);
  const [isNotInterested, setIsNotInterested] = useState(initialInterest === false);
  const [showEmailInput, setShowEmailInput] = useState(initialInterest === true);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    updateFeedbackData({ interestedInResearch: isInterested });
  }, [isInterested, updateFeedbackData]);

  useEffect(() => {
    setShowEmailInput(isInterested);
    if (!isInterested) {
      setEmail(""); // Clear email if not interested anymore
      setEmailError(""); // Clear any previous email error
      updateFeedbackData({ email: "" });
    }
  }, [isInterested, updateFeedbackData]);

  useEffect(() => {
    if (showEmailInput) {
      updateFeedbackData({ email });
    }
  }, [email, showEmailInput, updateFeedbackData]);

  const handleInterestedClick = () => {
    setIsInterested(true);
    setIsNotInterested(false);
  };

  const handleNotInterestedClick = () => {
    setIsInterested(false);
    setIsNotInterested(true);
  };

  const isValidEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFinishClick = () => {
    if (isInterested) {
      if (!email) {
        setEmailError("Please provide your email if you are interested.");
        return;
      }
      if (!isValidEmail(email)) {
        setEmailError("Please enter a valid email address.");
        return;
      }
    }
    onFinish();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg px-6 py-5 border-4 border-gray-200">
          <div className="flex justify-start items-center mb-2">
            <button className="text-pri-color hover:text-pri-color flex items-center gap-2" onClick={onPreviousStep}>
              <IoArrowBackOutline /> <span style={{ color: '#ffb000' }}>Back</span>
            </button>
          </div>
          <h2 className=" font-bold mb-4">
            We are always looking for feedback from InnoBee users like yourself
            to help shape our future.
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            If you’re interested in participating further, let us know below and
            we’ll add you to our research email list.
          </p>

          <div className="max-w-[600px] relative mb-4 w-full flex flex-col gap-4">
            <div
              className="flex items-center gap-2 px-2 py-1 border-1 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
              onClick={handleNotInterestedClick}
            >
              <button
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isNotInterested
                    ? "bg-pri-color"
                    : "bg-white border-1 border-gray-200"
                }`}
                style={{ minWidth: '1.5em', minHeight: '1.5em' }}
              >
                {isNotInterested && (
                  <span className="text-white" style={{ fontSize: '1em', lineHeight: '1.5em' }}>
                    <IoMdCheckmark />
                  </span>
                )}
              </button>{" "}
              <p className="text-brown font-semibold">Not interested.</p>
            </div>
            <div
              className="flex items-center gap-2 px-2 py-1 border-1 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
              onClick={handleInterestedClick}
            >
              <button
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isInterested
                    ? "bg-pri-color"
                    : "bg-white border-1 border-gray-200"
                }`}
                style={{ minWidth: '1.5em', minHeight: '1.5em' }}
              >
                {isInterested && (
                  <span className="text-white" style={{ fontSize: '1em', lineHeight: '1.5em' }}>
                    <IoMdCheckmark />
                  </span>
                )}
              </button>{" "}
              <p className="text-brown font-semibold">
                Interested, sign me up!
              </p>
            </div>

            {showEmailInput && (
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="mt-2 p-2 border rounded-lg w-full outline-none text-gray-400"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(""); // Clear error on input change
                  }}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-4 mb-4">
            We will only use your email to contact you for future research
            opportunities related to InnoBee. See our <a href="#" className="underline text-pri-color">Privacy Policy</a> for more details.
          </p>

          {/* Adjusted button width */}
          <button
            className="bg-brown hover:bg-pri-color text-white py-2 mb-4 mt-4 rounded-lg w-48"
            onClick={handleFinishClick}
          >
            Submit Feedback
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedBackInterest;