import React from "react";
import RecipeGenerate from "./components/RecipeGenerate";

const App = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-80"></div>

      <div className="relative flex flex-col min-h-screen">
        <header className="w-full py-8">
          <div className="container mx-auto text-center">
            <h1 className="text-6xl font-extrabold text-white drop-shadow-lg">
              Culinary Wizardry
            </h1>
            <p className="text-xl text-white mt-2 drop-shadow-md">
              Unleash Your Inner Chef!
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 flex-grow">
          <RecipeGenerate />
        </main>

        <footer className="w-full py-6">
          <div className="text-center text-white text-sm">
            <hr className="border-gray-300/30 mx-auto max-w-lg" />
            <p className="mt-4">
              &copy; {new Date().getFullYear()} Culinary Wizardry. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;