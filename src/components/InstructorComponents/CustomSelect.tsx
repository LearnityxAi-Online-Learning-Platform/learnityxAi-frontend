"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from "./InstructorComponents.module.scss";

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  required?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  label,
  required = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label className={`block text-sm font-medium mb-2 ${styles.formLabel}`}>
        {label} {required && <span className="text-error">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-lg border text-left flex items-center justify-between transition-all ${
          styles.customSelectButton
        } ${isOpen ? styles.customSelectOpen : ""}`}
      >
        <span className={value ? styles.customSelectValue : styles.customSelectPlaceholder}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""} ${
            styles.customSelectIcon
          }`}
        />
      </button>

      {isOpen && (
        <div className={`absolute z-50 w-full mt-2 rounded-lg border shadow-xl ${styles.customSelectDropdown}`}>
          {/* Search Input */}
          <div className={`p-2 border-b ${styles.customSelectSearch}`}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className={`w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 transition-all ${styles.customSelectSearchInput}`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className={`max-h-60 overflow-y-auto ${styles.customSelectList}`}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-all ${
                    styles.customSelectOption
                  } ${value === option ? styles.customSelectOptionActive : ""}`}
                >
                  <span className="text-sm">{option}</span>
                  {value === option && (
                    <Check className={`w-4 h-4 ${styles.customSelectCheckIcon}`} />
                  )}
                </button>
              ))
            ) : (
              <div className={`px-4 py-3 text-sm text-center ${styles.customSelectEmpty}`}>
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
