import React from "react";
import RecipeGenerate from "./components/RecipeGenerate";

const App = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-80"></div>

      <div className="relative flex flex-col min-h-screen">
    

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