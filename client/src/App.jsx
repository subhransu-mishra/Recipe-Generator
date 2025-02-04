import React from "react";
import RecipeGenerate from "./components/RecipeGenerate";

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-80 z-0"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen">
        {/* Header */}
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

        {/* Main Content */}
        <main className="container mx-auto px-4 flex-grow flex items-center justify-center">
          <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-8 max-w-3xl w-full">
            <RecipeGenerate />
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-6">
          <div className="text-center text-white text-sm">
            <hr className="border-gray-300 mx-auto max-w-lg" />
            <p className="mt-4">
              &copy; {new Date().getFullYear()} Culinary Wizardry. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
