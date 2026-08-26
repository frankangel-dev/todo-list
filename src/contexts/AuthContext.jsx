import {createContext, useContext, useRef, useState} from "react";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
}

export function AuthProvider({children}) {
  // initialize from localStorage so the user stays logged in after a page refresh
  const [email, setEmail] = useState(() => localStorage.getItem('email') || '');
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [roles, setRoles] = useState(() => {
    const stored = localStorage.getItem('roles');
    return stored ? JSON.parse(stored) : [];
  });

  // using a ref instead of state so it doesn't trigger a re-render, just need RequireAuth to read this before redirecting
  const isLoggingOut = useRef(false);

  const wasLoggingOutIntentional = () => {
    const wasIntentional = isLoggingOut.current;
    isLoggingOut.current = false;

    return wasIntentional;
  };

  // clearing state and localStorage
  const clearCredentials = () => {
    setEmail('');
    setToken('');
    setRoles([]);
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
  };

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
        setToken(data.csrfToken);
        setRoles(data.roles || []);
        localStorage.setItem('email', data.name);
        localStorage.setItem('token', data.csrfToken);
        localStorage.setItem('roles', JSON.stringify(data.roles || []));
        return {success: true};
      } else {
        return {
          success: false,
          error: `${data?.message}`
        };
      }
    } catch {
      return {
        success: false,
        error: 'Network error during login'
      };
    }
  };

  const googleLogin = async (authorizationCode) => {
    try {
      const response = await fetch('/api/users/googleLogon', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          authorizationCode
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name);
        setToken(data.csrfToken);
        setRoles(data.roles || []);
        localStorage.setItem('email', data.name);
        localStorage.setItem('token', data.csrfToken);
        localStorage.setItem('roles', JSON.stringify(data.roles || []));
        return {success: true};
      } else {
        return {
          success: false,
          error: `${data?.message}`
        };
      }
    } catch {
      return {
        success: false,
        error: 'Network error during Google login'
      };
    }
  }

  const logout = async () => {
    isLoggingOut.current = true;

    if (!token) {
      clearCredentials();
      return {success: true};
    }

    try {
      await fetch('/api/users/logoff', {
        method: 'POST',
        headers: {'X-CSRF-TOKEN': token},
        credentials: 'include'
      });

      return {success: true};

    } catch {
      return {
        success: false,
        error: 'Network error during logout'
      };
    } finally {
      // always logs the user out
      clearCredentials();
    }
  };

  const value = {
    email,
    token,
    roles,
    isAdmin: roles.includes('admin'),
    isAuthenticated: !!token,
    wasLoggingOutIntentional,
    login,
    googleLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
