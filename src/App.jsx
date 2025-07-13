import { useEffect, useState } from "react";
import { authenticationSpotify, getAlbum } from "./utils/spotify";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CurrencyAuthSpotify from "./contexts/CurrencyAuthSpotify";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import ItemModal from "./components/ItemModal/ItemModal";
import ResponsiveContainer from "./components/ResponsiveContainer";
import "./App.css";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import CurrencyAuthUser from "./contexts/CurrencyAuthUser";
import { currencyUser, logoutUser } from "./utils/user";
import Profile from "./components/Profile/Profile";
import Playlist from "./components/Playlist/Playlist";
import SpotifyCallback from "./components/SpotifyCallback/SpotifyCallback";
import { ToastProvider } from "./components/Toast/Toast";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  const [activeItem, setActiveItem] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [user, setUser] = useState({});
  const [authSpotify, setAuthSpotify] = useState({});
  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(null);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logoutUser()
        .then(() => {
          setUser({});
          setIsLogging(false);
          setAuthSpotify({});
          // Optionally redirect to home page
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    }
  };

  useEffect(() => {
    authenticationSpotify()
      .then((spotify) => {
        const token = spotify.access_token;
        localStorage.setItem("token", token);
        setAuthSpotify(spotify);
      })
      .catch((error) => {
        console.error("Error in useEffect:", error);
      });

    getAlbum()
      .then((data) => {
        setItems(data.tracks.items);
      })
      .catch((err) => {
        console.log(err);
      });

    currencyUser()
      .then((response) => {
        if (response && response.data) {
          setUser(response.data);
          setIsLogging(true);
        }
      })
      .catch((error) => {
        console.log("User not authenticated:", error);
        setIsLogging(false);
      });
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <CurrencyAuthUser.Provider value={{ currentUser: user, isLogging }}>
            <CurrencyAuthSpotify.Provider value={authSpotify}>
              <ResponsiveContainer>
                <div className="app">
                  <Header
                    setShowLogin={setShowLogin}
                    setShowSignUp={setShowSignUp}
                    isLogging={isLogging}
                    onLogout={handleLogout}
                  />
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Home items={items} onCardClick={setActiveItem} />
                      }
                    />
                    <Route path="/playlist" element={<Playlist />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/callback" element={<SpotifyCallback />} />
                  </Routes>

                  {activeItem && (
                    <ItemModal
                      item={activeItem}
                      onClose={() => setActiveItem(null)}
                    />
                  )}
                  <SignIn
                    isOpen={showLogin}
                    onClose={() => setShowLogin(false)}
                    errors={errors}
                    setErrors={setErrors}
                    saving={saving}
                    setSaving={setSaving}
                    setUser={setUser}
                    setIsLogging={setIsLogging}
                  />
                  <SignUp
                    isOpen={showSignUp}
                    onClose={() => setShowSignUp(false)}
                    errors={errors}
                    setErrors={setErrors}
                    saving={saving}
                    setSaving={setSaving}
                  />
                </div>
              </ResponsiveContainer>
            </CurrencyAuthSpotify.Provider>
          </CurrencyAuthUser.Provider>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
