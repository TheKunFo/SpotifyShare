import { useState, useContext, useEffect } from "react";
import "./Playlist.css";
import CurrencyAuthUser from "../../contexts/CurrencyAuthUser";
import {
  getAllPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  likePlaylist,
  unlikePlaylist,
} from "../../utils/playlist";
import { searchSpotify } from "../../utils/spotify";
import { Modal } from "../Modal/Modal.jsx";
import { useFormAndValidation } from "../../hooks/useFormAndValidation";

export default function Playlist() {
  const { currentUser } = useContext(CurrencyAuthUser);
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [likingPlaylist, setLikingPlaylist] = useState(null);
  const [sharingPlaylist, setSharingPlaylist] = useState(null);

  // Load playlists on component mount
  useEffect(() => {
    if (currentUser) {
      loadPlaylists();
    }
  }, [currentUser]);

  const loadPlaylists = () => {
    if (!currentUser) {
      console.error("Please log in to view playlists.");
      return;
    }

    setIsLoading(true);
    getAllPlaylists()
      .then((data) => {
        setPlaylists(data.playlists || []);
        setError("");
      })
      .catch((err) => {
        console.error(err.message);
        console.error("Failed to load playlists:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);

    try {
      const playlistData = {
        name: values.name,
        description: values.description || "",
        items: [],
        isPublic: values.isPublic !== false, // default to true if not set
      };

      const data = await createPlaylist(playlistData);
      console.log(data);
      setPlaylists((prev) => [data.playlist, ...prev]);
      resetForm();
      setShowCreateModal(false);
      setError("");
      console.log(`Playlist "${data.playlist.name}" created successfully!`);
    } catch (err) {
      console.error("Create playlist error:", err);
      console.error(
        err.message || "Failed to create playlist. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlaylist = (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      setIsLoading(true);
      deletePlaylist(playlistId)
        .then(() => {
          setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
          setError("");
          console.log("Playlist deleted successfully!");
        })
        .catch((err) => {
          console.error(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleEditPlaylist = (playlist) => {
    setEditingPlaylist({
      id: playlist._id,
      name: playlist.name,
      description: playlist.description,
    });
  };

  const handleUpdatePlaylist = (e) => {
    e.preventDefault();
    if (editingPlaylist && editingPlaylist.name.trim()) {
      setIsLoading(true);

      const updateData = {
        name: editingPlaylist.name,
        description: editingPlaylist.description,
      };

      updatePlaylist(editingPlaylist.id, updateData)
        .then((data) => {
          setPlaylists((prev) =>
            prev.map((p) => (p._id === editingPlaylist.id ? data.playlist : p))
          );
          setEditingPlaylist(null);
          setError("");
          console.log(`Playlist "${data.playlist.name}" updated successfully!`);
        })
        .catch((err) => {
          console.error(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleLikePlaylist = (playlistId) => {
    if (!currentUser) {
      console.error("Please login to like playlists");
      return;
    }

    setLikingPlaylist(playlistId);
    likePlaylist(playlistId)
      .then(() => {
        // Update local state to reflect the like
        setPlaylists((prev) =>
          prev.map((p) => (p._id === playlistId ? { ...p, isLiked: true } : p))
        );
        setError("");
        console.log("Playlist liked!");
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        setLikingPlaylist(null);
      });
  };

  const handleUnlikePlaylist = (playlistId) => {
    if (!currentUser) {
      console.error("Please login to unlike playlists");
      return;
    }

    setLikingPlaylist(playlistId);
    unlikePlaylist(playlistId)
      .then(() => {
        // Update local state to reflect the unlike
        setPlaylists((prev) =>
          prev.map((p) => (p._id === playlistId ? { ...p, isLiked: false } : p))
        );
        setError("");
        console.log("Playlist unliked!");
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        setLikingPlaylist(null);
      });
  };

  const handleSharePlaylist = (playlist) => {
    const playlistId = playlist._id || playlist.id;
    setSharingPlaylist(playlistId);

    const playlistUrl = `${window.location.origin}/playlist/${playlistId}`;
    const shareText = `Check out this playlist: "${playlist.name}" ${
      playlist.description ? `- ${playlist.description}` : ""
    }`;

    try {
      // Try to use Web Share API if available (mobile/modern browsers)
      if (navigator.share) {
        navigator.share({
          title: `Spotify Playlist: ${playlist.name}`,
          text: shareText,
          url: playlistUrl,
        });
      } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(`${shareText}\n${playlistUrl}`);

        // Show temporary success message
        setError("");
        const tempError = error;
        setError("✅ Playlist link copied to clipboard!");
        setTimeout(() => {
          setError(tempError);
        }, 3000);
      }
    } catch (err) {
      console.error("Error sharing playlist:", err);

      // Final fallback: manual copy
      try {
        const textArea = document.createElement("textarea");
        textArea.value = `${shareText}\n${playlistUrl}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        setError("✅ Playlist link copied to clipboard!");
        setTimeout(() => {
          setError("");
        }, 3000);
      } catch (fallbackErr) {
        setError("Unable to share playlist. Please copy the URL manually.");
      }
    } finally {
      setSharingPlaylist(null);
    }
  };

  const filteredPlaylists = playlists
    .filter(
      (playlist) =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        playlist.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "tracks":
          return b.trackCount - a.trackCount;
        case "recent":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <main className="playlist__main">
      <div className="playlist__container">
        <div className="playlist__header">
          <h1>My Playlists</h1>
          <p className="playlist__subtitle">
            {currentUser?.name
              ? `${currentUser.name}'s music collection`
              : "Your music collection"}
          </p>
        </div>

        <div className="playlist__controls">
          <div className="playlist__search-sort">
            <div className="playlist__search">
              <input
                type="text"
                placeholder="Search playlists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="playlist__search-input"
              />
              <span className="playlist__search-icon">🔍</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="playlist__sort-select"
            >
              <option value="recent">Recently Created</option>
              <option value="name">Name (A-Z)</option>
              <option value="tracks">Track Count</option>
            </select>
          </div>

          <button
            className="playlist__create-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <span>+</span>
            Create Playlist
          </button>
        </div>

        <div className="playlist__stats">
          <div className="playlist__stat">
            <span className="playlist__stat-number">{playlists.length}</span>
            <span className="playlist__stat-label">Playlists</span>
          </div>
          <div className="playlist__stat">
            <span className="playlist__stat-number">
              {playlists.reduce((sum, p) => sum + p.trackCount, 0)}
            </span>
            <span className="playlist__stat-label">Total Tracks</span>
          </div>
          <div className="playlist__stat">
            <span className="playlist__stat-number">
              {playlists.filter((p) => p.isPublic).length}
            </span>
            <span className="playlist__stat-label">Public</span>
          </div>
        </div>

        <div className="playlist__grid">
          {error && (
            <div className="playlist__error">
              <p>{error}</p>
              <button onClick={loadPlaylists} className="playlist__retry-btn">
                Try Again
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="playlist__loading">
              <div className="playlist__spinner"></div>
              <p>Loading playlists...</p>
            </div>
          ) : filteredPlaylists.length > 0 ? (
            filteredPlaylists.map((playlist) => (
              <div key={playlist._id || playlist.id} className="playlist__card">
                <div className="playlist__card-image">
                  <img
                    src={
                      playlist.image ||
                      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
                    }
                    alt={playlist.name}
                  />
                  <div className="playlist__card-overlay">
                    <button className="playlist__play-btn">▶</button>
                  </div>
                </div>

                <div className="playlist__card-content">
                  {editingPlaylist &&
                  editingPlaylist.id === (playlist._id || playlist.id) ? (
                    <form
                      onSubmit={handleUpdatePlaylist}
                      className="playlist__edit-form"
                    >
                      <input
                        type="text"
                        value={editingPlaylist.name}
                        onChange={(e) =>
                          setEditingPlaylist((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Playlist name"
                        required
                        className="playlist__edit-input"
                      />
                      <textarea
                        value={editingPlaylist.description}
                        onChange={(e) =>
                          setEditingPlaylist((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Description (optional)"
                        className="playlist__edit-textarea"
                      />
                      <div className="playlist__edit-buttons">
                        <button type="submit" className="playlist__save-btn">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPlaylist(null)}
                          className="playlist__cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 className="playlist__card-title">{playlist.name}</h3>
                      <p className="playlist__card-description">
                        {playlist.description}
                      </p>

                      <div className="playlist__card-stats">
                        <span className="playlist__card-tracks">
                          {playlist.items?.length || playlist.trackCount || 0}{" "}
                          tracks
                        </span>
                        <span
                          className={`playlist__card-visibility ${
                            playlist.isPublic ? "public" : "private"
                          }`}
                        >
                          {playlist.isPublic ? "🌐 Public" : "🔒 Private"}
                        </span>
                      </div>

                      <div className="playlist__card-actions">
                        {(playlist.owner?._id === currentUser?._id ||
                          !playlist.owner) && (
                          <>
                            <button
                              className="playlist__action-btn edit"
                              onClick={() => handleEditPlaylist(playlist)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="playlist__action-btn delete"
                              onClick={() =>
                                handleDeletePlaylist(
                                  playlist._id || playlist.id
                                )
                              }
                            >
                              �️ Delete
                            </button>
                          </>
                        )}
                        <button
                          className="playlist__action-btn share"
                          onClick={() => handleSharePlaylist(playlist)}
                          disabled={sharingPlaylist === playlist._id}
                          title="Share this playlist"
                          aria-label={`Share ${playlist.name} playlist`}
                        >
                          {sharingPlaylist === playlist._id ? (
                            <>⏳ Sharing...</>
                          ) : (
                            <>📤 Share</>
                          )}
                        </button>
                        <button
                          className={`playlist__action-btn like ${
                            playlist.isLiked ? "liked" : ""
                          }`}
                          onClick={() =>
                            playlist.isLiked
                              ? handleUnlikePlaylist(
                                  playlist._id || playlist.id
                                )
                              : handleLikePlaylist(playlist._id || playlist.id)
                          }
                          disabled={
                            !currentUser ||
                            likingPlaylist === (playlist._id || playlist.id)
                          }
                          title={
                            !currentUser
                              ? "Please login to like playlists"
                              : playlist.isLiked
                              ? "Unlike this playlist"
                              : "Like this playlist"
                          }
                          aria-label={
                            playlist.isLiked
                              ? `Unlike ${playlist.name} playlist`
                              : `Like ${playlist.name} playlist`
                          }
                        >
                          {likingPlaylist === (playlist._id || playlist.id)
                            ? "⏳ Loading..."
                            : playlist.isLiked
                            ? "❤️ Liked"
                            : "🤍 Like"}
                        </button>
                        <button
                          className="playlist__action-btn share"
                          onClick={() => handleSharePlaylist(playlist)}
                          disabled={sharingPlaylist === playlist._id}
                          title="Share this playlist"
                          aria-label={`Share ${playlist.name} playlist`}
                        >
                          {sharingPlaylist === playlist._id ? (
                            <>⏳ Sharing...</>
                          ) : (
                            <>📤 Share</>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="playlist__empty">
              <div className="playlist__empty-icon">🎵</div>
              <h3>No playlists found</h3>
              <p>
                {searchTerm
                  ? "Try a different search term"
                  : "Create your first playlist to get started!"}
              </p>
              {!searchTerm && (
                <button
                  className="playlist__create-btn"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Playlist
                </button>
              )}
            </div>
          )}
        </div>

        {/* Create Playlist Modal */}
        {showCreateModal && (
          <Modal
            name="create-playlist"
            onClose={() => {
              setShowCreateModal(false);
              resetForm();
            }}
          >
            <div className="playlist__modal-header">
              <h2>Create New Playlist</h2>
            </div>

            <form onSubmit={handleCreatePlaylist} className="playlist__form">
              <div className="playlist__form-group">
                <label htmlFor="name">Playlist Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={values.name || ""}
                  onChange={handleChange}
                  placeholder="Enter playlist name"
                  required
                  minLength="1"
                  maxLength="100"
                />
                {errors.name && (
                  <span className="playlist__error">{errors.name}</span>
                )}
              </div>

              <div className="playlist__form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={values.description || ""}
                  onChange={handleChange}
                  placeholder="Describe your playlist..."
                  rows="3"
                  maxLength="300"
                />
                {errors.description && (
                  <span className="playlist__error">{errors.description}</span>
                )}
              </div>

              <div className="playlist__form-group">
                <label className="playlist__checkbox-label">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={values.isPublic !== false}
                    onChange={handleChange}
                  />
                  <span className="playlist__checkbox-custom"></span>
                  Make this playlist public
                </label>
              </div>

              <div className="playlist__form-actions">
                <button
                  type="submit"
                  className="playlist__submit-btn"
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? "Creating..." : "Create Playlist"}
                </button>
                <button
                  type="button"
                  className="playlist__cancel-btn"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </main>
  );
}
