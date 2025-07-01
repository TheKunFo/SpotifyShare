import { useEffect, useState } from "react"
import { 
  authenticationSpotify,
  getAlbum, 
} from "./utils/spotify";
import CurrencyAuthSpotify from "./contexts/CurrencyAuthSpotify";
import Home from "./components/Home/Home";
import './App.css';


function App() {
  const [authSpotify, setAuthSpotify] = useState({})
  const [album, setAlbum] = useState({})

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
        console.log(data);
        setAlbum(data);
      }).catch((err) => {
        console.log(err);
      })
  },[]);


  return (
        <CurrencyAuthSpotify.Provider value={authSpotify} >
            <div className="app">
              <Home 
              />
            </div>
        </CurrencyAuthSpotify.Provider>
    )
  
}

export default App
