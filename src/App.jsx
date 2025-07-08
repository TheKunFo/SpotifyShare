import { useEffect, useState } from "react"
import {
  authenticationSpotify,
  getAlbum,
} from "./utils/spotify";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CurrencyAuthSpotify from "./contexts/CurrencyAuthSpotify";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import ItemModal from "./components/ItemModal/ItemModal";
import './App.css';
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import CurrencyAuthUser from "./contexts/CurrencyAuthUser";
import { currencyUser } from "./utils/user";
import Profile from "./components/Profile/Profile";


function App() {
  const [activeItem, setActiveItem] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [user, setUser] = useState({})
  const [authSpotify, setAuthSpotify] = useState({})
  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    authenticationSpotify()
      .then((spotify) => {
        const token = spotify.access_token;
        localStorage.setItem('token', token);
        setAuthSpotify(spotify);
      })
      .catch((error) => {
        console.error("Error in useEffect:", error);
      });

    getAlbum()
      .then((data) => {
        setItems(data.tracks.items);
      }).catch((err) => {
        console.log(err);
      })

    currencyUser()
      .then((response) => {
        setUser(response.data)
      })
  }, [])


  return (
    <BrowserRouter>
      <CurrencyAuthUser.Provider value={user} >
        <CurrencyAuthSpotify.Provider value={authSpotify} >
          <div className="app">
            <Header
              setShowLogin={setShowLogin}
              setShowSignUp={setShowSignUp}
              isLogging={isLogging}
            />
            <Routes>
              <Route path="/" element={
                <Home
                  items={items}
                  onCardClick={setActiveItem}
                />
              }/>
              <Route path="/profile" element={
                <Profile
                
                />
              }/>
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
        </CurrencyAuthSpotify.Provider>
      </CurrencyAuthUser.Provider>
    </BrowserRouter>
  )

}

export default App
