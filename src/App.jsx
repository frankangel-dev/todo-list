import Header from "./shared/Header.jsx";
import {Route, Routes} from "react-router";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import TodosPage from "./pages/TodosPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import BottomNav from "./shared/BottomNav.jsx"
import RequireAdmin from "./components/RequireAdmin.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";

function App() {
  return (
    <>
      <a href='#main-content'
         className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-accent-text'>
        Skip to content
      </a>
      <Header/>
      <main id={'main-content'} role={'main'} className={'flex-1 pb-28 md:pb-0'}>
        <Routes>
          <Route path={'/'} element={<HomePage/>}/>
          <Route path={'/about'} element={<AboutPage/>}/>
          <Route path={'/login'} element={<LoginPage/>}/>
          <Route path={'/register'} element={<RegisterPage/>}/>
          <Route path={'/todos'} element={<RequireAuth><TodosPage/></RequireAuth>}/>
          <Route path={'/profile'} element={<RequireAuth><ProfilePage/></RequireAuth>}/>
          <Route path={'/analytics'} element={<RequireAuth><RequireAdmin><AnalyticsPage/></RequireAdmin></RequireAuth>}/>
          <Route path={'*'} element={<NotFoundPage/>}/>
        </Routes>
      </main>
      <BottomNav/>
    </>
  );
}

export default App
