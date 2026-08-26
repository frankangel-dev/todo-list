import {useEffect} from 'react';
import {useNavigate} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();

  useEffect(() => {
    isAuthenticated ? navigate('/todos', {replace: true}) : navigate('/login', {replace: true});
  }, [isAuthenticated, navigate]);
  return (
    <div>Redirecting...</div>
  );
}