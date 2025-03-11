import React, { useState, useEffect, useRef } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import { RiAiGenerate } from "react-icons/ri";

const LoadingSpinner = () => (
  <div
    className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-orange-400 border-r-transparent"
    role="status"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

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
    if (
      !recipeData?.ingredients ||
      !recipeData?.mealType ||
      !recipeData?.cuisine ||
      !recipeData?.cookingTime ||
      !recipeData?.complexity
    ) {
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
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setLoading(false);
    };
  };

  const closeEventStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    setRecipeData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-8xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Recipe Wizard
          </h1>
          <p className="text-gray-600">
            Transform your ingredients into culinary masterpieces
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <Form onSubmit={onSubmit} loading={loading} />
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 min-h-[600px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-3xl">
                <div className="text-center space-y-4">
                  <PacmanLoader color="#ff6b35" size={30} />
                  <p className="text-orange-600 font-medium animate-pulse">
                    Crafting your recipe...
                  </p>
                </div>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                {displayedText ? (
                  displayedText.split("\n").map((line, index) => (
                    <p key={index} className="animate-fadeIn">
                      {line.startsWith("**") && line.endsWith("**") ? (
                        <strong className="text-2xl text-orange-600 block mb-4">
                          {line.replace(/\*\*/g, "")}
                        </strong>
                      ) : (
                        line
                      )}
                    </p>
                  ))
                ) : (
                  <div className="text-gray-400 italic h-full flex items-center justify-center text-center p-8">
                    <p>
                      Enter your ingredients and preferences to generate a
                      delicious recipe! 🍳
                      <br />
                      Your custom recipe will appear here once ready...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Form = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    ingredients: "",
    mealType: "",
    cuisine: "",
    cookingTime: "",
    complexity: "",
    type: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <InputField
        id="ingredients"
        label="What ingredients do you have?"
        placeholder="e.g., chicken, rice, tomatoes..."
        icon="🥑"
        value={formData.ingredients}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          id="mealType"
          label="Meal Type"
          icon="🍜"
          value={formData.mealType}
          onChange={handleChange}
          options={["Breakfast", "Lunch", "Dinner", "Snack"]}
        />

        <SelectField
          id="complexity"
          label="Cooking Skill"
          icon="🎓"
          value={formData.complexity}
          onChange={handleChange}
          options={["Beginner", "Intermediate", "Advanced"]}
        />
      </div>

      <InputField
        id="cuisine"
        label="Preferred Cuisine"
        placeholder="e.g., Italian, Thai, Mexican..."
        icon="🌏"
        value={formData.cuisine}
        onChange={handleChange}
      />
      <SelectField
        id="type"
        label="type"
        icon="🥝/🍗"
        value={formData.type}
        onChange={handleChange}
        options={["Veg", "Non-Veg"]}
      />

      <SelectField
        id="cookingTime"
        label="Time Available"
        icon="⏲️"
        value={formData.cookingTime}
        onChange={handleChange}
        options={["<30 min", "30-60 min", ">1 hour"]}
      />

      <button
        onClick={() => onSubmit(formData)}
        disabled={loading}
        className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-85 disabled:hover:shadow-lg"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <PacmanLoader color="#fff" size={20} />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            Generate Recipe <RiAiGenerate />
          </div>
        )}
      </button>
    </div>
  );
};

const InputField = ({ id, label, icon, ...props }) => (
  <div>
    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
      <span className="text-2xl">{icon}</span>
      {label}
    </label>
    <input
      id={id}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
      {...props}
    />
  </div>
);

const SelectField = ({ id, label, icon, options, ...props }) => (
  <div>
    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
      <span className="text-2xl">{icon}</span>
      {label}
    </label>
    <select
      id={id}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all appearance-none"
      {...props}
    >
      <option value="">Select...</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default RecipeGenerate;