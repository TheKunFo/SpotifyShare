import { useContext } from "react";
import "./Header.css";
import CurrencyAuthUser from "../../contexts/CurrencyAuthUser";
import { Link } from "react-router-dom";

export default function Header({ setShowLogin, setShowSignUp, isLogging }) {
  const currencyUser = useContext(CurrencyAuthUser);
  return (
    <header>
      <div className="header__container">
        <div className="header__logo">
          <h2>
            Spotify <span>Playlist Share</span>
          </h2>
        </div>
        <nav className="header__nav">
          <Link className="header__link" to="/">
            Home
          </Link>
          {currencyUser && isLogging ? (
            <>
              <Link className="header__link" to="/playlist">
                Playlist
              </Link>
              <Link className="header__link" to="/profile">
                Profile
              </Link>
              <img
                className="header__avatar"
                src={currencyUser.avatar}
                alt={currencyUser.name}
              />
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)}>Login</button>
              <button onClick={() => setShowSignUp(true)}>Sign Up</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
