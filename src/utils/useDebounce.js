import {useEffect, useState} from "react";

// waits until the user stops typing before updating the value, so it doesn't hit the API on every keystroke
export default function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value);
        }, delay)

        // cleanup cancels the timer if the value changes before the delay is up
        return () => clearTimeout(timer);
    },[value, delay]);
    
    return debounceValue;
}