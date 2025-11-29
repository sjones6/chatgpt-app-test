"use client";

import { useState } from "react";

export function DecisionButtons({
  authorizationId,
}: {
  authorizationId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDecision = async (decision: "approve" | "deny") => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/oauth/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision,
          authorization_id: authorizationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to process decision");
        setIsLoading(false);
        return;
      }

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    } catch (error) {
      console.error("Error processing decision:", error);
      alert("An error occurred while processing your decision");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => handleDecision("approve")}
        disabled={isLoading}
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-base h-12 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Approve"}
      </button>
      <button
        type="button"
        onClick={() => handleDecision("deny")}
        disabled={isLoading}
        className="rounded-full border border-solid transition-colors flex items-center justify-center bg-transparent border-foreground text-foreground gap-2 hover:bg-foreground hover:text-background font-medium text-base h-12 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Deny"}
      </button>
    </div>
  );
}

