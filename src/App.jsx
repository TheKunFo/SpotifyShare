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


function App() {
  const [activeItem, setActiveItem] = useState(null);
  const [authSpotify, setAuthSpotify] = useState({})
  
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

  return (
    <CurrencyAuthSpotify.Provider value={authSpotify} >
      <div className="app">
        <Header
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
      </div>
    </CurrencyAuthSpotify.Provider>
  )

}

export default App
