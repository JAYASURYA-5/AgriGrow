import React, { useState } from 'react';

const CommunityPage = () => {
  // Sample data for chats (like WhatsApp chats)
  const [chats, setChats] = useState([
    { id: 1, name: 'Crop Farming Group', lastMessage: 'How to improve soil health?', timestamp: '10:00 AM', unread: 2, isGroup: true, members: 450 },
    { id: 2, name: 'Livestock Chat', lastMessage: 'Best feed for chickens?', timestamp: '9:45 AM', unread: 0, isGroup: true, members: 320 },
    { id: 3, name: 'Weather Updates', lastMessage: 'Rain expected tomorrow', timestamp: 'Yesterday', unread: 1, isGroup: true, members: 280 },
    { id: 4, name: 'Organic Farming', lastMessage: 'Natural pest control methods', timestamp: '2 days ago', unread: 0, isGroup: true, members: 180 },
    { id: 5, name: 'Dairy Farming', lastMessage: 'Milking schedule tips', timestamp: '3 days ago', unread: 0, isGroup: true, members: 150 },
    { id: 6, name: 'John Farmer', lastMessage: 'Thanks for the advice!', timestamp: '5 min ago', unread: 1, isGroup: false, online: true },
    { id: 7, name: 'AgriTech Support', lastMessage: 'Your order has been shipped', timestamp: '1 hour ago', unread: 0, isGroup: false, online: false },
  ]);

  // State for selected chat and messages
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [messages, setMessages] = useState({
    1: [
      { id: 1, text: 'Welcome to the Crop Farming group!', sender: 'Admin', timestamp: '10:00 AM', status: 'read' },
      { id: 2, text: 'Any tips for pest control?', sender: 'Farmer1', timestamp: '10:05 AM', status: 'read' },
      { id: 3, text: 'Use neem oil spray', sender: 'You', timestamp: '10:10 AM', status: 'read' },
    ],
    2: [
      { id: 1, text: 'Best feed for chickens?', sender: 'Farmer2', timestamp: '9:45 AM', status: 'read' },
    ],
    3: [
      { id: 1, text: 'Rain expected tomorrow', sender: 'WeatherBot', timestamp: 'Yesterday', status: 'read' },
    ],
    4: [
      { id: 1, text: 'Natural pest control methods', sender: 'OrganicFarmer', timestamp: '2 days ago', status: 'read' },
    ],
    5: [
      { id: 1, text: 'Milking schedule tips', sender: 'DairyExpert', timestamp: '3 days ago', status: 'read' },
    ],
    6: [
      { id: 1, text: 'Hi, how are the crops?', sender: 'John Farmer', timestamp: '5 min ago', status: 'delivered' },
      { id: 2, text: 'Doing well, thanks!', sender: 'You', timestamp: '4 min ago', status: 'sent' },
    ],
    7: [
      { id: 1, text: 'Your order has been shipped', sender: 'AgriTech Support', timestamp: '1 hour ago', status: 'read' },
    ],
  });
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: (messages[selectedChat.id] || []).length + 1,
        text: newMessage,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString(),
        status: 'sent'
      };
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg]
      }));
      setNewMessage('');
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    if (chat.unread > 0) {
      setChats(prevChats =>
        prevChats.map(c =>
          c.id === chat.id ? { ...c, unread: 0 } : c
        )
      );
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      backgroundColor: '#f0f8e7'
    }}>
      {/* Sidebar - Chats List */}
      <div style={{
        width: '30%',
        borderRight: '2px solid #4caf50',
        backgroundColor: '#ffffff',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '15px',
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0', fontSize: '1.5em' }}>🌾 WhatsFarm</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', opacity: '0.9' }}>
            Connecting farmers worldwide 🌍
          </p>
        </div>

        {/* Search */}
        <div style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '20px',
              outline: 'none',
              fontSize: '0.9em'
            }}
          />
        </div>

        {/* Chats List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              style={{
                padding: '15px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                backgroundColor: selectedChat.id === chat.id ? '#e8f5e8' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: chat.isGroup ? 'linear-gradient(135deg, #4caf50, #66bb6a)' : 'linear-gradient(135deg, #2196f3, #21cbf3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2em',
                marginRight: '15px'
              }}>
                {chat.isGroup ? '👥' : '👤'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '5px'
                }}>
                  <strong style={{
                    color: selectedChat.id === chat.id ? '#2e7d32' : '#333',
                    fontSize: '1em'
                  }}>
                    {chat.name}
                  </strong>
                  <small style={{ color: '#666', fontSize: '0.8em' }}>
                    {chat.timestamp}
                  </small>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    color: '#666',
                    fontSize: '0.9em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}>
                    {chat.lastMessage}
                  </span>
                  {chat.unread > 0 && (
                    <span style={{
                      backgroundColor: '#4caf50',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7em',
                      fontWeight: 'bold',
                      marginLeft: '10px'
                    }}>
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fafafa'
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '15px',
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          color: 'white',
          borderBottom: '2px solid #388e3c',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: selectedChat.isGroup ? 'linear-gradient(135deg, #4caf50, #66bb6a)' : 'linear-gradient(135deg, #2196f3, #21cbf3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1em',
            marginRight: '15px'
          }}>
            {selectedChat.isGroup ? '👥' : '👤'}
          </div>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3em' }}>
              {selectedChat.name}
            </h3>
            <p style={{
              margin: '0',
              fontSize: '0.9em',
              opacity: '0.9'
            }}>
              {selectedChat.isGroup ? `${selectedChat.members} members` : (selectedChat.online ? 'Online' : 'Offline')}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          padding: '15px',
          overflowY: 'auto',
          backgroundImage: 'linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}>
          {(messages[selectedChat.id] || []).map(msg => (
            <div key={msg.id} style={{
              marginBottom: '12px',
              display: 'flex',
              justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '10px 14px',
                backgroundColor: msg.sender === 'You' ? '#dcf8c6' : '#ffffff',
                border: `1px solid ${msg.sender === 'You' ? '#c3e88d' : '#e0e0e0'}`,
                borderRadius: msg.sender === 'You' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                {msg.sender !== 'You' && (
                  <div style={{
                    fontSize: '0.85em',
                    fontWeight: 'bold',
                    color: '#1976d2',
                    marginBottom: '4px'
                  }}>
                    {msg.sender}
                  </div>
                )}
                <div style={{ fontSize: '0.95em', lineHeight: '1.4' }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: '0.75em',
                  color: '#666',
                  textAlign: 'right',
                  marginTop: '4px'
                }}>
                  {msg.timestamp}
                  {msg.sender === 'You' && (
                    <span style={{ marginLeft: '4px' }}>
                      {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div style={{
          padding: '15px',
          backgroundColor: '#ffffff',
          borderTop: '2px solid #4caf50',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #c8e6c9',
              borderRadius: '25px',
              fontSize: '0.95em',
              outline: 'none',
              backgroundColor: '#f8f9fa'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            style={{
              marginLeft: '10px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '25px',
              fontSize: '0.9em',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(76,175,80,0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
