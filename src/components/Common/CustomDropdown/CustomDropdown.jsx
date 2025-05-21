"use client";

import IconsLibrary from "@/util/IconsLibrary";
import { useState } from "react";

export default function CustomDropdown() {
  const options = ["Option One", "Option Two", "Option Three"];
  const [selected, setSelected] = useState("");

  return (
    <div className="relative w-full">
      {/* Hidden input to store selected value */}
      <input type="hidden" name="dropdownValue" value={selected} />

      {/* Dropdown trigger */}
      <div
        onClick={() => setSelected((prev) => (prev ? "" : "open"))}
        className="bg-[#0c0d060d] rounded-xl  relative text-base max-h-[48px] px-4 py-3 cursor-pointer w-full"
      >
        {selected && selected !== "open" ? selected : "Choose one..."}

        <div className="absolute  right-5 top-[21px]">
          <IconsLibrary
            styling={`${
              selected ? "scale-y-[-1]" : ""
            } transition-all duration-300`}
            name="customDropdown"
          />
        </div>
      </div>

      {/* Options */}
      {selected === "open" && (
        <ul className="absolute z-10 bg-white border border-gray-200 mt-1 rounded w-full shadow">
          {options.map((option, idx) => (
            <li
              key={idx}
              onClick={() => setSelected(option)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
