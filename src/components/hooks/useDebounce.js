import React from "react";
import { useState, useEffect } from "react";

const useDebounce = (initializeValue = "", delay = 1000) => {
  const [debounceValue, setDebounceValue] = useState(initializeValue);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(initializeValue);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [delay, initializeValue]);
  return debounceValue;
};

export default useDebounce;
