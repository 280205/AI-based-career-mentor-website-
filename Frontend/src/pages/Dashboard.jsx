import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of Link
import './RateYourself.css';

const RateYourself = () => {
  const [profile, setProfile] = useState({
    skills: '',
    interests: '',
    education: '',
    experience: ''
  });

  const [careerContent, setCareerContent] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitProfile = {
      skills: profile.skills.split(',').map(s => s.trim()),
      interests: profile.interests.split(',').map(i => i.trim()),
      education: profile.education.trim(),
      experience: profile.experience.trim()
    };

    if (
      submitProfile.skills.includes('randi') ||
      submitProfile.interests.includes('randi')
    ) {
      if (!window.confirm('Did you mean "random" or something else for "randi"? Proceed anyway?')) {
        return;
      }
    }

    try {
      const res = await axios.post('http://localhost:5000/api/profile', { profile: submitProfile });
      setCareerContent(res.data.career_description || '');
      setChatMessages([]);
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      alert('Failed to get career description');
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { text: message, sender: 'user' };
    setChatMessages(prev => [...prev, userMsg]);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message });
      setChatMessages(prev => [...prev, { text: res.data.response, sender: 'mentor' }]);
    } catch (err) {
      console.error('Chat Error:', err.response?.data || err.message);
      setChatMessages(prev => [
        ...prev,
        { text: 'Sorry, I couldn’t reach the mentor. Try again!', sender: 'mentor' }
      ]);
    }
  };

  const handleInsightsClick = () => {
    navigate('/industry-insights'); // Programmatic navigation to insights page
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Card */}
          <div className="card">
            <h3 className="card-title">Fill the form</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {['skills', 'interests', 'education', 'experience'].map((field, i) => (
                <div key={i}>
                  <label className="block mb-2 font-semibold text-gray-200">
                    {field.charAt(0).toUpperCase() + field.slice(1)}{field === 'skills' || field === 'interests' ? ' (comma-separated)' : ''}
                  </label>
                  <input
                    type="text"
                    value={profile[field]}
                    onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                    placeholder={
                      field === 'skills' ? 'e.g., Python, coding, data analysis' :
                      field === 'interests' ? 'e.g., AI, web development, finance' :
                      field === 'education' ? 'e.g., BSc Computer Science' :
                      'e.g., 2 years in programming'
                    }
                    className="input-field"
                  />
                </div>
              ))}
              <button type="submit" className="submit-btn">Discover your career</button>
            </form>
          </div>

          {/* Career & Chat */}
          <div className="chat-card relative">
            <h3 className="card-title">Career & Mentor</h3>
            {careerContent ? (
              <div className="career-content">
                <div className="career-description">
                  {careerContent}
                </div>
                <div className="chat-box">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'mentor-message'}`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleChatSubmit} className="chat-input-form">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What can I help with?"
                    className="chat-input"
                  />
                  <button type="submit" className="send-btn" aria-label="Send">↑</button>
                </form>
                <button
                  onClick={handleInsightsClick}
                  className="mt-4 insights-btn"
                >
                  View Industry Insights
                </button>
              </div>
            ) : (
              <div>
                <p className="recommendation-item">No recommendations available. Fill the form to get started!</p>
                <button
                  onClick={handleInsightsClick}
                  className="mt-4 insights-btn"
                >
                  View Industry Insights
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateYourself;