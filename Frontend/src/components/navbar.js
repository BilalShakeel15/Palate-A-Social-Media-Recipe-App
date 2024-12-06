import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../images/logo.png';
import searchIcon from '../images/search icon.png';
import notificationsIcon from '../images/heart.png';
import messagesIcon from '../images/messages.png';
import defaultdp from '../images/default_dp.jpg';
import closeIcon from '../images/close.png';
import { createAPIEndpoint, ENDPOINTS } from '../api/api.js';
import axios from 'axios';

const Navbar = () => {
  const BASE_URL = 'https://localhost:7101';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const [biodata, setBiodata] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [noti, setnoti] = useState([]);

 

  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfilePopup = () => setIsProfilePopupOpen(!isProfilePopupOpen);
  const toggleNotificationsPopup = () =>{
    setIsNotificationsOpen(!isNotificationsOpen);
  
  } 
  const markNotificationsAsRead = async () => {
    // Get the list of notification IDs that are unread
    const notificationIds = noti
    .filter(notification => !notification.IsRead)
    .map(notification => notification.NotificationId);
    console.log(notificationIds);
    // Check the list of IDs being sent

// Send the notification IDs to the backend
axios.put('https://localhost:7101/api/Notification/markAsRead', notificationIds, {
  headers: {
    'Content-Type': 'application/json',  // Ensure proper content type
  }
})
.then(response => {
  console.log('Notifications marked as read successfully:', response.data);
})
.catch(error => {
  console.error('Error marking notifications as read:', error);
});

  };
  
  useEffect(() => {
    if (isNotificationsOpen) {
      
      
      // Collect the notification IDs you want to mark as read
//       const notificationIds = noti
//   .filter(notification => notification.IsRead !== undefined && !notification.IsRead) // Ensure `IsRead` is defined and false
//   .map(notification => notification.NotificationId); // Use `NotificationId` instead of `notificationId`
// console.log(notificationIds);


      // if (notificationIds.length > 0) {
        markNotificationsAsRead(); // Send the request with the IDs
      // }
    }
  }, [isNotificationsOpen, noti]);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
    createAPIEndpoint(ENDPOINTS.users)
      .fetch()
      .then((response) => setUsers(response.data))
      .catch((err) => console.log(err));
  };

  const closeSearchBar = () => {
    setIsSearchOpen(false);
    setSearchResults([])
  }

  useEffect(() => {
    const u_id = localStorage.getItem("userid");
    console.log('User ID from localStorage:', u_id); // Debugging log
    if (!u_id) {
      console.error('User ID is not set in localStorage');
      return; // Prevent API call if user ID is missing
    }

    const apiUrl = `https://localhost:7101/api/Notification/getnotifications/${u_id}`;
    console.log('API URL:', apiUrl); // Debugging log

    axios.get(apiUrl)
      .then((response) => {
        setnoti(response.data);
        console.log('Notifications fetched:', response.data); // Debugging log
      })
      .catch((err) => {
        console.log('Error fetching notifications:', err);
      });
  }, []);


  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.navbar')) {
        closeSearchBar();
        setIsNotificationsOpen(false);
        setIsProfilePopupOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', storedTheme);
    setIsDarkMode(storedTheme === 'dark');
    const bio = JSON.parse(localStorage.getItem('bioData'));
    setBiodata(bio);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userid');
    localStorage.removeItem('bioData');
    navigate('/');
  };
  const handleSearchChange = (e) => {
    setSearchResults([])
    const searchQuery = e.target.value.toLowerCase();


    if (searchQuery.trim() === "") {
      // If the search input is empty, reset the search results
      setSearchResults([]);
    } else {
      // Filter users based on the search query
      const filteredResults = users.filter((user) =>
        user.Username.toLowerCase().includes(searchQuery)
      );
      setSearchResults(filteredResults);
    }
  };

  const test = (id) => {
    navigate('/search-profile', { state: { id } });
    window.location.reload();
  }

  const handleAccept = (followerId, notificationId) => {
    const followedId = localStorage.getItem("userid");
  
    axios.post(`https://localhost:7101/api/Follow/acceptFollow/${followerId}/${followedId}/${notificationId}`)
      .then((response) => {
        console.log('Follow request accepted', response.data);
        // Update notification state to mark the notification as accepted
        setnoti(prevNoti => 
          prevNoti.map(notification => 
            notification.NotificationId === notificationId ? 
            { ...notification, Message: 'Follow request Accepted.',isRead:true } : notification
          )
        );
      })
      .catch((error) => {
        console.error('Error accepting follow request:', error);
      });
  };

  const handleDecline = (notificationId, followerId) => {
    const followedId = localStorage.getItem("userid");
  
    // Remove notification from the state
    setnoti(prevNoti => prevNoti.filter(notification => notification.NotificationId !== notificationId));
  
    // Send a request to delete the notification
    
  
    // Optionally, send a decline notification if needed
    axios.post(`https://localhost:7101/api/Follow/rejectFollow/${followerId}/${followedId}/${notificationId}`)
      .then((response) => {
        console.log('Follow request declined', response.data);
      })
      .catch((error) => {
        console.error('Error declining follow request:', error);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Left: Hamburger and Logo */}
        <div className="d-flex align-items-center">
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <a className="navbar-brand mx-2" href="/">
            <img src={logo} alt="Logo" className="logo-img" />
          </a>
        </div>

        {/* Navbar Links for larger screens */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active-link" to="/home">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active-link" to="/recipes">
                Recipes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active-link" to="/feed">
                Feed
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active-link" to="/about">
                About
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right: Icons */}
        <div className="d-flex align-items-center right-icons">
          {isSearchOpen && (
            <div className="search-popup">
              <input
                type="text"
                className="search-bar"
                placeholder="Search..."
                ref={searchInputRef}
                onChange={handleSearchChange}
              />
              <div className="notifications-popup" style={{ width: "200px", right: "220px" }}>
                {searchResults.map((result) => (
                  <div key={result.id} className="notification-item" onClick={() => test(result.Id)}>
                    <img className="avatar" src={result.Bio?.dp ? `${BASE_URL}${result.Bio.dp}` : defaultdp} alt="User" style={{ height: "6vh" }} />
                    <span >{result.Username}</span>
                  </div>
                  
                ))}
              </div>
            </div>
          )}
          <img
            src={searchIcon}
            alt="Search"
            className="icon search-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleSearchIconClick();
            }}
          />
          <img
            src={notificationsIcon}
            alt="Notifications"
            className="icon notifications-icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleNotificationsPopup();
            }}
          />
          <img src={messagesIcon} alt="Messages" className="icon messages-icon" onClick={() => {
            console.log(noti);
          }} />
          <img
            src={biodata?.dp ? `${BASE_URL}${biodata.dp}` : defaultdp}
            alt="User"
            className="avatar"
            onClick={toggleProfilePopup}
          />
        </div>
      </div>

      {/* Profile Popup */}
      {isProfilePopupOpen && (
        <div className="profile-popup">
          <button className="view-profile-btn" onClick={() => navigate('/profile-recipes')}>
            View Profile
          </button>
          <button className="settings-btn">Settings</button>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* Notifications Popup */}
      {/* Notifications Popup */}
      {/* Notifications Popup */}
{isNotificationsOpen && (
  <div className="notifications-popup">
    <div className="notifications-header">
      <span>Notifications</span>
      
    </div>
    <div className="notifications-list">
      {noti.length > 0 ? (
        noti.map((notification) => (
          <div key={notification.NotificationId} className={`notification-item ${notification.isRead ? '' : 'unread'}`}>
            <div className="notification-content">
              {notification.Follower ? (
                <>
                  <img
                    src={
                      notification.Follower.DisplayPicture
                        ? `${BASE_URL}${notification.Follower.DisplayPicture}`
                        : defaultdp
                    }
                    alt={notification.Follower.Username}
                    className="notification-avatar"
                  />
                  <strong>{notification.Follower.Username}</strong>
                  <div className="notification-text">
                    
                    
                  </div>
                  {/* Accept/Decline Buttons */}

                  {notification.Message.includes("Your follow request has been rejected.") && (
                    <div style={{color:"#E53935"}}>
                      {`${notification.Follower.Username} has rejected your request`}
                    </div>
                  )}
                  {notification.Message.includes("Your follow request has been accepted.") && (
                    <div style={{color:"#A6CE39"}}>
                      {`${notification.Follower.Username} has accepted your request`}
                    </div>
                  )}
                  {notification.Message.includes("Please accept") && (
                    <div className="notification-buttons">
                      <p>{notification.Follower.Username} has requested you.</p>
                      <div className='d-flex'>
                      <button className="accept-btn" onClick={() => handleAccept(notification.FollowerId, notification.NotificationId)}>Accept</button>
                      <button className="decline-btn" style={{backgroundColor:"#E53935"}} onClick={() => handleDecline(notification.NotificationId, notification.FollowerId)}>Decline</button>
                      </div>
                    </div>
                  )}
                  {notification.Message.includes("Follow request Accepted.") && (
                    <div style={{color:"#A6CE39"}}>
                      {notification.Message}
                    </div>
                  )}
                  
                </>
              ) : (
                <p>{notification.Message}</p>
              )}
              {/* <span className="notification-time">
                {new Date(notification.DateCreated).toLocaleString()}
              </span> */}
            </div>
          </div>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  </div>
)}



      {/* Sidebar menu for smaller screens */}
      <div className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header d-flex align-items-center">
          <img src={logo} alt="Logo" className="sidebar-logo" />
          <img src={closeIcon} alt="Close Menu" className="close-icon ml-auto" onClick={toggleMenu} />
        </div>
        <ul className="nav-links">
          <li>
            <NavLink className="nav-link" activeClassName="active-link" to="/home">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" activeClassName="active-link" to="/recipes">
              Recipes
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" activeClassName="active-link" to="/feed">
              Feed
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" activeClassName="active-link" to="/about">
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
