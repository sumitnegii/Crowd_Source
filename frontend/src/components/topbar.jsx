import React from "react";  // ✅ Add this line
import { FaSearch } from "react-icons/fa";
import "./topBar.css";

const TopBar = () => {
  return (
    <nav className="flex items-center justify-between bg-gray-100 px-6 py-3 shadow-md">
      {/* Left Section - Logo & Navigation */}
      <div className="flex items-center space-x-6">
        <span className="text-2xl font-bold">W.</span>
        <div className="hidden md:flex space-x-5 text-gray-800 text-sm">
          <a href="#" className="hover:underline">Explore ⌄</a>
          <a href="#" className="hover:underline">Directory</a>
          <a href="#" className="hover:underline flex items-center">
            Academy <span className="ml-1 text-xs bg-black text-white px-2 py-0.5 rounded">New</span>
          </a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Market</a>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-200 px-4 py-2 rounded-full w-1/3">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by Inspiration"
          className="bg-transparent outline-none text-sm px-2 w-full"
        />
      </div>

      {/* Right Section - Buttons */}
      <div className="flex items-center space-x-4 text-sm">
        <a href="#" className="hover:underline text-gray-800">Log in</a>
        <a href="#" className="hover:underline text-gray-800">Sign Up</a>
        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">Be Pro</button>
        <button className="border border-black px-4 py-2 rounded-lg text-sm">Submit Website</button>
      </div>
    </nav>
  );
};

export default TopBar;
