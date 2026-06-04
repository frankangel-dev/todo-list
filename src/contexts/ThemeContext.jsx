import {createContext, useContext, useState, useEffect} from "react";

const ThemeContext = createContext();

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within an ThemeProvider');
    }
    return context;
}

export function ThemeProvider({children}) {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // add or remove the 'dark' class on <html> so Tailwind dark mode applies
    useEffect(() => {
        theme === 'dark' ?
            document.documentElement.classList.add('dark')
            :
            document.documentElement.classList.remove('dark');
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const value = {
        theme,
        toggleTheme
    };
    
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}