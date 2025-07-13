import { useContext, useState } from "react";
import "./Profile.css";
import CurrencyAuthUser from "../../contexts/CurrencyAuthUser";
import SpotifyConnect from "../SpotifyConnect/SpotifyConnect";

export default function Profile() {
  const { currentUser } = useContext(CurrencyAuthUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    console.log("Profile update:", editForm);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
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
          <button
            className="profile__edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
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
                  value={editForm.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="profile__form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="profile__form-group">
                <label htmlFor="avatar">Avatar URL</label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={editForm.avatar}
                  onChange={handleInputChange}
                  placeholder="Enter avatar image URL"
                />
              </div>

              <div className="profile__form-actions">
                <button type="submit" className="profile__save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="profile__cancel-btn"
                  onClick={() => setIsEditing(false)}
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
