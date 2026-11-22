import { useEffect, useState } from 'react';

export default function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, Math.max(0, delay));

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}