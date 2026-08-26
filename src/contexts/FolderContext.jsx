import {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "./AuthContext.jsx";

const FolderContext = createContext();

export function useFolders() {
  const context = useContext(FolderContext);
  if (!context) throw new Error('useFolders must be used within a FolderProvider');

  return context;
}

// lives in TodosPage instead of App since nothing else needs folders
export function FolderProvider({children}) {
  const {token} = useAuth();
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState('');

  // one fetch that the add form, the filter and the manager all read
  useEffect(() => {
    if (!token) return;

    const fetchFolders = async () =>{
      try {
        const response = await fetch(`/api/folders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
          },
          credentials: 'include'
        });

        const data = await response.json();

        if (response.status === 404) {
          setFolders([]);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch folders');
        }

        setFolders(data.folders)

      } catch (error) {
        setError(error.message);
      }
    }

    fetchFolders();
  }, [token]);

  async function createFolder(name) {
    try {
      const response = await fetch(`/api/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({name}),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setFolders(current => [...current, data]);
        return {success: true};
      } else {
        return {
          success: false,
          error: `${data?.message}`
        };
      }

    } catch (error) {
      setError(error.message);
    }
  }

  async function renameFolder(id, name) {
    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({name}),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setFolders(current => current.map(folder => folder.id === id ? data: folder));
        return {success: true};
      } else {
        return {
          success: false,
          error: `${data?.message}`
        };
      }

    } catch (error) {
      setError(error.message);
    }
  }

  async function deleteFolder(id) {
    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setFolders(current => current.filter(folder => folder.id !== id));
        return {success: true};
      } else {
        return {
          success: false,
          error: `${data?.message}`
        };
      }

    } catch (error) {
      setError(error.message);
    }
  }

  const value = {
    folders,
    error,
    createFolder,
    renameFolder,
    deleteFolder,
    clearError: () => setError('')
  };

  return (
    <FolderContext.Provider value={value}>
      {children}
    </FolderContext.Provider>
  );
}
