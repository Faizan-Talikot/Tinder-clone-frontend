import React, { useState } from "react";
import axios from "axios";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    college: "",
    eventDate: "",
    eventDetails:""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.eventDetails.length < 10) {
      setErrorMessage("Event details must be at least 10 characters long");
      return; // Stop further execution
    }

    // Validate event date
    const today = new Date();
    const selectedDate = new Date(formData.eventDate);
    if (selectedDate < today) {
      // Set error message for invalid event date
      setErrorMessage("Event date cannot be previous to today's date");
      return; // Stop further execution
    }

    try {
      // Make API call to add event
      await axios.post("http://localhost:8000/addevent", formData);
      // Show success alert or message
      alert("Event added successfully");
      // Clear form fields
      setErrorMessage(false);
      setFormData({
        eventName: "",
        college: "",
        eventDate: "",
        eventDetails:"",
      });
    } catch (error) {
      console.error("Error adding event:", error);
      // Show error alert or message
      alert("Failed to add event");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error message when user starts typing
    setErrorMessage("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="add-event-form">
        <label>
          Event Name:
          <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} required />
        </label>
        <label>
          Event Details:
          <textarea name="eventDetails" value={formData.eventDetails} onChange={handleChange} minLength="10" required></textarea>
        </label>
        <label>
          College:
          <select name="college" value={formData.college} onChange={handleChange} required>
            <option value="">Select College</option>
            <option value="KSI Institute">KSI Institute</option>
            <option value="Patkar College">Patkar College</option>
            <option value="Bhavans College">Bhavans College</option>
            <option value="Valia College">Valia College</option>
            <option value="Mitibai College">Mitibai College</option>
            <option value="KJ Somaiya College">KJ Somaiya College</option>
            <option value="Xavier College">Xavier College</option>
            <option value="Jai Hind College">Jai Hind College</option>
            <option value="NM College">NM College</option>
            <option value="Rizvi College">Rizvi College</option>
            <option value="SNDT College">SNDT College</option>
            <option value="Hinduja  College">Hinduja College</option>
          </select>
        </label>
        <label>
          Event Date:
          <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required />
        </label>
        <button type="submit">Add Event</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default AddEvent;
