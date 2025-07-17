import { useContext, useState } from "react";
import "./Profile.css";
import CurrencyAuthUser from "../../contexts/CurrencyAuthUser";
import SpotifyConnect from "../SpotifyConnect/SpotifyConnect";
import { useFormAndValidation } from "../../hooks/useFormAndValidation";
import { updateUser } from "../../utils/user";

export default function Profile() {
  const { currentUser, setCurrentUser } = useContext(CurrencyAuthUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { values, handleChange, errors, isValid, setValues, resetForm } =
    useFormAndValidation();

  // Initialize form with current user data when editing starts
  const handleEditStart = () => {
    setValues({
      name: currentUser?.name || "",
      avatar: currentUser?.avatar || "",
    });
    setIsEditing(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    try {
      // promise
      updateUser(values).then((updatedUser) => {
        setCurrentUser(updatedUser.data);
        console.log(values);
        console.log(updatedUser);
      });
      setIsEditing(false);
      resetForm();
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  return (
    <section className="profile__container">
      <aside className="profile__sidebar">
        <div className="profile__user-card">
          <div className="profile__avatar-container">
            <img
              src={currentUser?.avatar || "/default-avatar.png"}
              alt={currentUser?.name || "User"}
              className="profile__avatar"
            />
          </div>
          <h2 className="profile__username">
            {currentUser?.name || "Guest User"}
          </h2>
          <p className="profile__email">{currentUser?.email || "No email"}</p>
          <button className="profile__edit-btn" onClick={handleEditStart}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="profile__stats">
          <h3>Stats</h3>
          <div className="profile__stat-item">
            <span className="profile__stat-label">Playlists Created</span>
            <span className="profile__stat-value">12</span>
          </div>
          <div className="profile__stat-item">
            <span className="profile__stat-label">Songs Shared</span>
            <span className="profile__stat-value">47</span>
          </div>
          <div className="profile__stat-item">
            <span className="profile__stat-label">Favorites</span>
            <span className="profile__stat-value">23</span>
          </div>
        </div>
      </aside>

      <main className="profile__main">
        {isEditing ? (
          <div className="profile__edit-section">
            <h1>Edit Profile</h1>
            <form onSubmit={handleEditSubmit} className="profile__edit-form">
              <div className="profile__form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={values.name || ""}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
                {errors.name && (
                  <span className="profile__error">{errors.name}</span>
                )}
              </div>

              {/* <div className="profile__form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={values.email || ""}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <span className="profile__error">{errors.email}</span>
                )}
              </div> */}

              <div className="profile__form-group">
                <label htmlFor="avatar">Avatar URL</label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={values.avatar || ""}
                  onChange={handleChange}
                  placeholder="Enter avatar image URL"
                />
                {errors.avatar && (
                  <span className="profile__error">{errors.avatar}</span>
                )}
              </div>

              <div className="profile__form-actions">
                <button
                  type="submit"
                  className="profile__save-btn"
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="profile__cancel-btn"
                  onClick={handleEditCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="profile__content">
            <h1>Welcome back, {currentUser?.name || "Guest"}!</h1>

            <section className="profile__recent-activity">
              <h2>Recent Activity</h2>
              <div className="profile__activity-list">
                <div className="profile__activity-item">
                  <div className="profile__activity-icon">🎵</div>
                  <div className="profile__activity-details">
                    <p className="profile__activity-title">
                      Shared "Summer Vibes" playlist
                    </p>
                    <p className="profile__activity-time">2 hours ago</p>
                  </div>
                </div>
                <div className="profile__activity-item">
                  <div className="profile__activity-icon">❤️</div>
                  <div className="profile__activity-details">
                    <p className="profile__activity-title">
                      Liked "Chill Beats" by MusicLover
                    </p>
                    <p className="profile__activity-time">1 day ago</p>
                  </div>
                </div>
                <div className="profile__activity-item">
                  <div className="profile__activity-icon">🎶</div>
                  <div className="profile__activity-details">
                    <p className="profile__activity-title">
                      Created new playlist "Workout Mix"
                    </p>
                    <p className="profile__activity-time">3 days ago</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="profile__favorite-genres">
              <h2>Favorite Genres</h2>
              <div className="profile__genre-tags">
                <span className="profile__genre-tag">Pop</span>
                <span className="profile__genre-tag">Rock</span>
                <span className="profile__genre-tag">Jazz</span>
                <span className="profile__genre-tag">Electronic</span>
                <span className="profile__genre-tag">Hip Hop</span>
              </div>
            </section>

            <section className="profile__spotify-connection">
              <h2>Spotify Integration</h2>
              <SpotifyConnect />
            </section>

            <section className="profile__quick-actions">
              <h2>Quick Actions</h2>
              <div className="profile__action-buttons">
                <button className="profile__action-btn">
                  <span>🎵</span>
                  Create Playlist
                </button>
                <button className="profile__action-btn">
                  <span>🔍</span>
                  Discover Music
                </button>
                <button className="profile__action-btn">
                  <span>👥</span>
                  Find Friends
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </section>
  );
}
