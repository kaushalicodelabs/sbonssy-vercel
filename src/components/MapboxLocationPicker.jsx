"use client";

import React, { useState, useEffect, useRef } from "react";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const geocodingClient = mbxGeocoding({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
});

const MapboxLocationPicker = ({ value, onChange }) => {
  const [searchQuery, setSearchQuery] = useState(value?.locationName || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: searchQuery,
          limit: 5,
        })
        .send();

      setSuggestions(response.body.features);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (result) => {
    const lng = result?.geometry?.coordinates[1];
    const lat = result?.geometry?.coordinates[0];
    const place = result?.place_name || result?.text;

    if (lng && lat) {
      onChange({
        type: "Point",
        coordinates: [lng, lat],
        locationName:
          place || `Selected location (${lng.toFixed(4)}, ${lat.toFixed(4)})`,
      });
    }
    setSuggestions([]);
    setShowSuggestions(false); // Close suggestions when a value is selected
    setSearchQuery(place || "");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 2) {
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setSearchQuery(""); // Clear the input field
    onChange(null); // Clear the location data
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="mt-4 relative" ref={wrapperRef}>
      <input
        type="search"
        value={searchQuery || ""}
        onChange={handleInputChange}
        onFocus={() => {
          if (searchQuery.length > 2 && suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder="Search for a location"
        className="w-full border p-2 rounded"
      />

      {/* <button
        type="button"
        onClick={handleClear}
        className="absolute right-2 top-2 text-gray-500"
      >
        Clear
      </button> */}

      {isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg p-2">
          Loading...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && !isLoading && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}

      {value?.locationName && !showSuggestions && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {value.locationName}
        </div>
      )}
    </div>
  );
};

export default MapboxLocationPicker;
