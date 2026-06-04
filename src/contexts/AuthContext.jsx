import {createContext, useContext, useRef, useState} from "react";

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    
    return context;
}

export function AuthProvider({children}) {
    const [email , setEmail] = useState(() => localStorage.getItem('email') || '');
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const isLoggingOut = useRef(false);

    const login = async (userEmail, password) => {
        try {
            const response = await fetch('/api/users/logon', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: userEmail,
                    password
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.status === 200 && data.name && data.csrfToken) {
                setEmail(data.name);
                localStorage.setItem('email', data.name);
                setToken(data.csrfToken);
                localStorage.setItem('token', data.csrfToken);
                return {success: true};
            } else {
                return {
                    success: false,
                    error: `Authentication failed: ${data?.message}`
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Network error during login'
            };
        }
    };

    const logout = async () => {
        isLoggingOut.current = true;
        
        if (!token) {
            setEmail('');
            localStorage.removeItem('email');
            setToken('');
            localStorage.removeItem('token');
            return {success: true};
        }
        
        try {
            await fetch('/api/users/logoff', {
                method: 'POST',
                headers: {'X-CSRF-TOKEN': token},
                credentials: 'include'
            });

            return {success: true};
            
        } catch (error) {
            return {
                success: false,
                error: 'Network error during logout'
            };
        } finally {
            setEmail('');
            localStorage.removeItem('email');
            setToken('');
            localStorage.removeItem('token');
        }
    };

    const value = {
        email,
        token,
        isAuthenticated: !!token,
        isLoggingOut,
        login,
        logout
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}