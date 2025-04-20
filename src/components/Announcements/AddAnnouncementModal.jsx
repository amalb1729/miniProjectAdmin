import { useState } from "react";
import "./AnnouncementModals.css";
import Modal from "../modals/Modal";

function AddAnnouncementModal({ onClose, onAdd, accessToken, refreshRequest }) {
  const [formData, setFormData] = useState({
    text: "",
    active: true,
    priority: 0
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    setFormData(prev => ({ ...prev, text: e.target.value }));
    setErrors(prev => ({ ...prev, text: "" }));
  };

  const handlePriorityChange = (e) => {
    setFormData(prev => ({ ...prev, priority: Math.max(parseInt(e.target.value) || 0, 0) }));
    setErrors(prev => ({ ...prev, priority: "" }));
  };

  const handleActiveChange = (e) => {
    setFormData(prev => ({ ...prev, active: e.target.checked }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.text.trim()) {
      newErrors.text = "Announcement text is required";
      isValid = false;
    }

    if (formData.priority < 0) {
      newErrors.priority = "Priority must be a non-negative number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Trim text and remove excessive whitespace
      const trimmedData = {
        ...formData,
        text: formData.text.trim().replace(/\s+/g, ' ')
      };

      let token = accessToken;
      if (!token) token = await refreshRequest();
      
      let response = await fetch("/api/announcement", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(trimmedData),
        credentials: 'include'
      });
      
      if (response.status === 401) {
        token = await refreshRequest();
        response = await fetch("/api/announcement", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify(trimmedData),
          credentials: 'include'
        });
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server responded with ${response.status}: ${errorText}`);
        throw new Error(`${response.status === 403 ? "Admin access required" : errorText}`);
      }
      
      const data = await response.json();
      onAdd(data);
    } catch (err) {
      console.error("Error adding announcement:", err);
      setErrors({ submit: err.message || "Failed to add announcement. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} closeModal={onClose}>
      <div className="add-modal-content">
        <h2 className="add-modal-title">Add New Announcement</h2>
        
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <div className="form-group">
          <label htmlFor="text">Announcement Text:</label>
          <textarea
            id="text"
            className={`form-input ${errors.text ? 'input-error' : ''}`}
            value={formData.text}
            onChange={handleTextChange}
            placeholder="Enter announcement text"
            rows="3"
          />
          {errors.text && <span className="error-message">{errors.text}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority:</label>
          <input
            type="number"
            id="priority"
            className={`form-input ${errors.priority ? 'input-error' : ''}`}
            value={formData.priority}
            onChange={handlePriorityChange}
            min="0"
            max="10"
          />
          {errors.priority && <span className="error-message">{errors.priority}</span>}
          <small>Higher priority announcements will be displayed first</small>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.active}
              onChange={handleActiveChange}
            />
            Active
          </label>
        </div>
        
        <div className="modal-actions">
          <button 
            className="btn btn-cancel" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-confirm" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Confirm'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AddAnnouncementModal;
