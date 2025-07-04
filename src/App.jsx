import { useEffect, useState } from "react"
import {
  authenticationSpotify,
  getAlbum,
} from "./utils/spotify";
import CurrencyAuthSpotify from "./contexts/CurrencyAuthSpotify";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import ItemModal from "./components/ItemModal/ItemModal";
import './App.css';
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";


function App() {
  const [activeItem, setActiveItem] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [authSpotify, setAuthSpotify] = useState({})
  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([])

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
  }, [])


  useEffect(() => {
    getAlbum()
      .then((data) => {
        setItems(data.tracks.items);
      }).catch((err) => {
        console.log(err);
      })
  }, []);

  const handleSubmitSignIn = (e) => {
    e.preventDefault();
    if (validateAll()) {
      console.log('Login Success:', { email, password });
      onClose();
    }
  };

  const handleSubmitSignUp = (e) => {
    e.preventDefault();
    if (validateAll()) {
      console.log('Sign Up Success:', form);
      onClose();
    }
  };

  return (
    <CurrencyAuthSpotify.Provider value={authSpotify} >
      <div className="app">
        <Header
          setShowLogin={setShowLogin}
          setShowSignUp={setShowSignUp}
        />
        <Home
          items={items}
          onCardClick={setActiveItem}
        />
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
          handleSubmit={handleSubmitSignIn}
        />
        <SignUp 
          isOpen={showSignUp}
          onClose={() => setShowSignUp(false)}
          errors={errors}
          setErrors={setErrors}
          handleSubmit={handleSubmitSignIn}
        />
      </div>
    </CurrencyAuthSpotify.Provider>
  )

}

export default App
