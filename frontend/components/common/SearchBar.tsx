'use client';

import React, { useRef, useState } from "react";
import cn from "classnames";

type SearchBarProps = { 
  placeholder?: string;
  // Function to call when spyglass is clicked
  onSearchIconClick: (value: string) => void | Promise<void>;
  // Optional loading state from parent component (e.g. while waiting for search results)
  isLoading?: boolean;
};


const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearchIconClick,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleSearchIconClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!inputValue.trim()) return  ; // Do not search if input is empty

    if (!isLoading) {
      await onSearchIconClick(inputValue);
    }
  };

  return (
    // <div className="relative w-full mx-auto-flex items-center ">
      <div 
        className={cn(
          // size & layout
          "h-full w-full flex items-center rounded-full",
          "px-3 py-2 sm:px-4 font-medium",
          
          // background & text
          "bg-white dark:bg-white/5 shadow-sm",
          "text-sm sm:text-sm/6 text-gray-900 dark:text-white",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          
          // outline (base)
          "outline-1 -outline-offset-2 outline-gray-300 dark:outline-white/10",
          // outline when input is focused
          "focus-within:outline-2 focus-within:-outline-offset-2",
          "focus-within:outline-indigo-600 dark:focus-within:outline-indigo-500",

          // transitions
          "transition-colors duration-150",
        )}
      >
        {/* Spyglass button */}
        <button
          type="button"
          onClick={handleSearchIconClick}
          className={cn("mr-2 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed",
            "text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors duration-150"
          )}
          aria-label="Search"
          disabled={isLoading}
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 "
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex-1 min-w-0 bg-transparent",
            "text-sm sm:text-base outline-none"
          )}
        />

        {/* Clear (X) button - always rendered, just hidden when empty*/}
        <button
          type="button"
          onClick={handleClearClick}
          disabled={!inputValue || isLoading }
          aria-label="Clear search"
          aria-hidden={!inputValue}
          className={cn(
            // "absolute right-0 inset-y-0",
            "ml-2 flex items-center justify-center rounded-full",
            "w-5 h-5 sm:w-5 sm:h-5", // fixed size so layout doesn't move
            "text-gray-400  hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors duration-150",
            inputValue
              ? "opacity-100 cursor-pointer"
              : "opacity-0 pointer-events-none" // invisible & not clickable when no input
          )}
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    // </div>
  );
}

export default SearchBar;




    {/* <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className={cn(
          "w-full px-5 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500",
          className
        )}
        {...rest}
      />
      <div className="absolute right-0 inset-y-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400 hover:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12" //M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
          />
        </svg>
      </div>
      <div className="absolute left-0 inset-y-0 flex items-center">
        <svg
          className="w-5 h-5 text-gray-400 hover:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" //M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
          />
        </svg>  */}
