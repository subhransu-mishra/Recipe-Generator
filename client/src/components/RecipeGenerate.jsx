import React, { useEffect, useState, useRef } from "react";
import RecipeCard from "./RecipeCard";
import { HashLoader } from "react-spinners";

const RecipeGenerate = () => {
  const [recipeData, setRecipeData] = useState(null);
  const [recipeText, setRecipeText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [displayIndex, setDisplayIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  let eventSourceRef = useRef(null);

  useEffect(() => {
    closeEventStream();
  }, []);

  useEffect(() => {
    if (recipeData) {
      closeEventStream();
      setRecipeText("");
      setDisplayedText("");
      setDisplayIndex(0);
      setLoading(true);
      initializeEventStream();
    }
  }, [recipeData]);

  useEffect(() => {
    if (displayIndex < recipeText.length) {
      const intervalId = setInterval(() => {
        setDisplayIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          setDisplayedText(recipeText.slice(0, newIndex));
          if (newIndex >= recipeText.length) {
            clearInterval(intervalId);
          }
          return newIndex;
        });
      }, 50);
      return () => clearInterval(intervalId);
    }
  }, [recipeText, displayIndex]);

  const initializeEventStream = () => {
    if (!recipeData?.ingredients || !recipeData?.mealType || !recipeData?.cuisine || !recipeData?.cookingTime || !recipeData?.complexity) {
      console.error("Invalid recipe data:", recipeData);
      return;
    }

    const queryParams = new URLSearchParams(recipeData).toString();
    const url = `http://localhost:3001/recipeStream?${queryParams}`;
    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.action === "close") {
          setLoading(false);
          closeEventStream();
        } else if (data.action === "chunk" && data.chunk) {
          setRecipeText((prev) => prev + data.chunk);
        }
      } catch (error) {
        console.error("Error parsing event data:", error);
      }
    };

    eventSourceRef.current.onerror = () => {
      console.error("EventSource failed.");
      eventSourceRef.current.close();
      setLoading(false);
    };
  };

  const closeEventStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  async function onSubmit(data) {
    console.log("Submitted Data:", data);
    setRecipeData(data);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-6xl mx-auto px-4 py-8 bg-white shadow-2xl rounded-2xl p-6">
        <div className="w-full md:w-1/2">
          <RecipeCard onSubmit={onSubmit} />
        </div>
        <div className="w-full md:w-1/2 h-[600px] text-lg text-gray-900 p-6 border rounded-lg shadow-lg bg-gray-50 whitespace-pre-line overflow-y-auto relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <HashLoader color="#3b82f6" size={80} />
            </div>
          ) : (
            <>{displayedText}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerate;
