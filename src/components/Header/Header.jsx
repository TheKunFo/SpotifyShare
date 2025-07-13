import { useContext } from "react";
import "./Header.css";
import CurrencyAuthUser from "../../contexts/CurrencyAuthUser";
import { Link } from "react-router-dom";

export default function Header({
  setShowLogin,
  setShowSignUp,
  isLogging,
  onLogout,
}) {
  const { currentUser } = useContext(CurrencyAuthUser);
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <h2 className="header__title">Spotify Playlist Share</h2>
        </div>
        <nav className="header__nav">
          <Link className="header__link" to="/">
            Home
          </Link>
          {currentUser && isLogging ? (
            <>
              <Link className="header__link" to="/playlist">
                Playlist
              </Link>
              <Link className="header__link" to="/profile">
                Profile
              </Link>
              <div className="header__user">
                <img
                  className="header__avatar"
                  src={currentUser.avatar}
                  alt={currentUser.name}
                />
                <button
                  className="header__logout-btn"
                  onClick={onLogout}
                  title="Logout"
                >
                  Logout
                </button>
              </div>
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
