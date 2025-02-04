import React, { useState } from "react";

const RecipeCard = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    ingredients: "",
    mealType: "",
    cuisine: "",
    cookingTime: "",
    complexity: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = () => onSubmit(formData);

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl mt-8">
      {" "}
      {/* Centered and added margin */}
      {/* Card Header */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Recipe Wizard 🧙‍♂️
        </h2>{" "}
        {/* Centered title */}
        <p className="text-white/90 text-center">
          Let's cook something amazing!
        </p>{" "}
        {/* Centered subtitle */}
      </div>
      {/* Card Body */}
      <div className="p-6 space-y-4">
        {" "}
        {/* Reduced spacing */}
        <InputField
          id="ingredients"
          label="Ingredients"
          placeholder="What's in your pantry?"
          icon="🥕"
          value={formData.ingredients}
          onChange={handleChange}
        />
        <SelectField
          id="mealType"
          label="Meal Type"
          icon="🍽️"
          value={formData.mealType}
          onChange={handleChange}
          options={["Breakfast", "Lunch", "Dinner", "Snack"]}
        />
        <InputField
          id="cuisine"
          label="Cuisine Preference"
          placeholder="Italian, Mexican, Japanese..."
          icon="🌍"
          value={formData.cuisine}
          onChange={handleChange}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          {/* Responsive grid */}
          <SelectField
            id="cookingTime"
            label="Cooking Time"
            icon="⏳"
            value={formData.cookingTime}
            onChange={handleChange}
            options={["<30 min", "30-60 min", ">1 hour"]}
          />
          <SelectField
            id="complexity"
            label="Complexity"
            icon="🎚️"
            value={formData.complexity}
            onChange={handleChange}
            options={["Beginner", "Intermediate", "Advanced"]}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="cursor-pointer w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-3 rounded-xl font-semibold 
                      hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg"
        >
          ✨ Generate Recipe
        </button>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ id, label, icon, ...props }) => (
  <div className="mb-4">
    {" "}
    {/* Added margin bottom */}
    <label className="flex items-center text-gray-600 font-medium gap-2 mb-1">
      {" "}
      {/* Added margin bottom to label */}
      <span className="text-xl">{icon}</span>
      {label}
    </label>
    <input
      id={id}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 
                  focus:border-transparent transition-all placeholder:text-gray-400"
      {...props}
    />
  </div>
);

// Reusable Select Component
const SelectField = ({ id, label, icon, options, ...props }) => (
  <div className="mb-4">
    {" "}
    {/* Added margin bottom */}
    <label className="flex items-center text-gray-600 font-medium gap-2 mb-1">
      {" "}
      {/* Added margin bottom to label */}
      <span className="text-xl">{icon}</span>
      {label}
    </label>
    <select
      id={id}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 
                  focus:border-transparent transition-all appearance-none bg-white"
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

export default RecipeCard;
