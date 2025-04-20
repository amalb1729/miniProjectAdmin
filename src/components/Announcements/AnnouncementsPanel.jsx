import { useState, useEffect, useContext } from "react";
import { myContext } from "../../App";
import "./AnnouncementsPanel.css";
import AddAnnouncementModal from "./AddAnnouncementModal";
import EditAnnouncementModal from "./EditAnnouncementModal";

function AnnouncementsPanel() {
  const { accessToken, refreshRequest } = useContext(myContext);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [message, setMessage] = useState(""); // For success/error messages

  // Fetch all announcements when component mounts
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        let token = accessToken;
        if (!token) token = await refreshRequest();
        
        let response = await fetch("/api/announcement", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
          },
          credentials: 'include'
        });
        
        if (response.status === 401) {
          token = await refreshRequest();
          response = await fetch("/api/announcement", {
            method: "GET",
            headers: { 
              "Content-Type": "application/json", 
              "Authorization": `Bearer ${token}` 
            },
            credentials: 'include'
          });
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Server responded with ${response.status}: ${errorText}`);
          setError(`Error: ${response.status === 403 ? "Admin access required" : errorText}`);
          return;
        }
        
        const data = await response.json();
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [accessToken]);

  // Delete announcement
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        let token = accessToken;
        if (!token) token = await refreshRequest();
        
        let response = await fetch(`/api/announcement/${id}`, {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
          },
          credentials: 'include'
        });
        
        if (response.status === 401) {
          token = await refreshRequest();
          response = await fetch(`/api/announcement/${id}`, {
            method: "DELETE",
            headers: { 
              "Content-Type": "application/json", 
              "Authorization": `Bearer ${token}` 
            },
            credentials: 'include'
          });
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Server responded with ${response.status}: ${errorText}`);
          setMessage(`Error: ${response.status === 403 ? "Admin access required" : errorText}`);
          return;
        }
        
        const data = await response.json();
        setAnnouncements(announcements.filter(announcement => announcement._id !== id));
        setMessage(data.message || "Announcement deleted successfully");
        
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      } catch (err) {
        console.error("Error deleting announcement:", err);
        setMessage("Error: " + (err.message || "Failed to delete announcement"));
        
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      }
    }
  };

  // Toggle announcement active status
  const toggleActive = async (announcement) => {
    try {
      const updatedAnnouncement = { ...announcement, active: !announcement.active };
      
      let token = accessToken;
      if (!token) token = await refreshRequest();
      
      let response = await fetch(`/api/announcement/${announcement._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(updatedAnnouncement),
        credentials: 'include'
      });
      
      if (response.status === 401) {
        token = await refreshRequest();
        response = await fetch(`/api/announcement/${announcement._id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify(updatedAnnouncement),
          credentials: 'include'
        });
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server responded with ${response.status}: ${errorText}`);
        setMessage(`Error: ${response.status === 403 ? "Admin access required" : errorText}`);
        return;
      }
      
      setAnnouncements(announcements.map(a => 
        a._id === announcement._id ? { ...a, active: !a.active } : a
      ));
      setMessage("Announcement status updated successfully");
      
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } catch (err) {
      console.error("Error updating announcement status:", err);
      setMessage("Error: " + (err.message || "Failed to update announcement status"));
      
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  };

  // Open edit modal with selected announcement
  const handleEdit = (announcement) => {
    setCurrentAnnouncement(announcement);
    setShowEditModal(true);
  };

  // Add new announcement
  const handleAdd = (newAnnouncement) => {
    setAnnouncements([...announcements, newAnnouncement]);
    setShowAddModal(false);
    setMessage("Announcement added successfully");
    
    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  // Update announcement
  const handleUpdate = (updatedAnnouncement) => {
    setAnnouncements(announcements.map(a => 
      a._id === updatedAnnouncement._id ? updatedAnnouncement : a
    ));
    setShowEditModal(false);
    setCurrentAnnouncement(null);
    setMessage("Announcement updated successfully");
    
    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  return (
    <div className="announcements-panel">
      <h2 className="admin-panel-title">Admin Dashboard</h2>
      
      <div className="panel-header">
        <h3 className="section-title">Manage Announcements</h3>
        <button className="add-item-btn" onClick={() => setShowAddModal(true)}>
          <span className="btn-text">Add Announcement</span>
        </button>
      </div>

      {message && <p className="status-message success">{message}</p>}
      {error && <p className="status-message error">{error}</p>}

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="no-announcements">No announcements found. Add one to get started.</div>
        ) : (
          <table className="announcements-table">
            <thead>
              <tr>
                <th className="text-column">Text</th>
                <th className="status-column">Status</th>
                <th className="priority-column">Priority</th>
                <th className="date-column">Created</th>
                <th className="date-column">Updated</th>
                <th className="actions-column">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <tr key={announcement._id} className={announcement.active ? 'active-row' : 'inactive-row'}>
                  <td className="text-cell">{announcement.text}</td>
                  <td className="status-cell">
                    <span className={`status-badge ${announcement.active ? 'active' : 'inactive'}`}>
                      {announcement.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="priority-cell">{announcement.priority}</td>
                  <td className="date-cell">{new Date(announcement.createdAt).toLocaleDateString()}</td>
                  <td className="date-cell">{new Date(announcement.updatedAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button className="action-btn toggle-btn" onClick={() => toggleActive(announcement)}>
                        {announcement.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="action-btn edit-btn"onClick={() => handleEdit(announcement)}>
                        Edit</button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(announcement._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <AddAnnouncementModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
          accessToken={accessToken}
          refreshRequest={refreshRequest}
        />
      )}

      {showEditModal && currentAnnouncement && (
        <EditAnnouncementModal
          announcement={currentAnnouncement}
          onClose={() => {
            setShowEditModal(false);
            setCurrentAnnouncement(null);
          }}
          onUpdate={handleUpdate}
          accessToken={accessToken}
          refreshRequest={refreshRequest}
        />
      )}
    </div>
  );
};

export default AnnouncementsPanel;
