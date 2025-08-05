import React, { useState } from 'react';
import './WhatsAppMessage.css';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:5555/users/wp-messages';


const WhatsAppMessage = ({ phoneNumber = '' }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch messages
  const fetchMessages = async (phone = phoneNumber) => {
    if (!phone || phone.trim() === '') {
      setError('Please enter a phone number in the left panel');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Add phone parameter to the API endpoint
      const apiUrl = `${API_ENDPOINT}?phone=${encodeURIComponent(phone.trim())}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const resData = await response.json();
      const messages = resData.data;
      
      // Transform the fetched data to match our message format
      const transformedMessages = messages.slice(0, 6).map((wpMsg, index) => ({
        id: wpMsg.id || index,
        text: wpMsg.message || wpMsg.text || wpMsg.title || 'No message content',
        timestamp: wpMsg.timestamp 
          ? new Date(wpMsg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          : new Date(Date.now() - (index * 2 * 60000)).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }),
        isOutgoing: false,
        status: "read"
      }));
      
      console.log('Fetched messages:', transformedMessages);
      setMessages(transformedMessages);
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);

      // Use mock data when API fails
      const mockMessages = [
        {
          id: 1,
          text: `Problem fetching messages`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOutgoing: false,
          status: "read"
        },
      ];
      
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch messages when phoneNumber prop changes
  React.useEffect(() => {
    if (phoneNumber && phoneNumber.trim()) {
      fetchMessages(phoneNumber);
    } else {
      setMessages([]);
      setError(null);
    }
  }, [phoneNumber]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  return (
    <div className="whatsapp-container">
      <div className="whatsapp-header">
        <div className="contact-info">
          <div className="avatar">
            <span>SA</span>
          </div>
          <div className="contact-details">
            <h3>+{phoneNumber}</h3>
            <span className="status">
              {loading ? "Loading..." : error ? "Offline" : phoneNumber ? `Connected: ${phoneNumber}` : "No phone number"}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="action-btn refresh-btn" 
            onClick={() => fetchMessages(phoneNumber)}
            disabled={loading || !phoneNumber.trim()}
            title="Refresh messages"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="messages-container">
        {!phoneNumber.trim() ? (
          <div className="welcome-container">
            <div className="welcome-message">
              <h3>📱 WhatsApp Message Viewer</h3>
              <p>Enter a phone number above to fetch WhatsApp messages</p>
            </div>
          </div>
        ) : loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading messages for {phoneNumber}...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>⚠️ Failed to load messages from API</p>
            <p className="error-details">
              <strong>Phone:</strong> {phoneNumber}<br/>
              <strong>Endpoint:</strong> {API_ENDPOINT}?phone={encodeURIComponent(phoneNumber)}<br/>
              <strong>Error:</strong> {error}
            </p>
            <button onClick={() => fetchMessages(phoneNumber)} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isOutgoing ? 'outgoing' : 'incoming'}`}
            >
              <div className="message-content">
                <span className="message-text">{message.text}</span>
                <div className="message-meta">
                  <span className="timestamp">{message.timestamp}</span>
                  {message.isOutgoing && (
                    <span className={`status ${message.status}`}>
                      {getStatusIcon(message.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WhatsAppMessage;
