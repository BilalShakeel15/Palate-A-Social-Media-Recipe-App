import React, { useEffect, useState } from 'react';
import axios from 'axios'; // For making API calls
import '../../styles/edit_profile.css';
import ProfileIcon from '../../images/default_dp.jpg';
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
    const navigate = useNavigate();
    const BASE_URL = 'https://localhost:7101';
    const [selectedImage, setSelectedImage] = useState(ProfileIcon);
    const [file, setFile] = useState(null); // File to upload
    const [biodata, setbiodata] = useState(null); // File to upload
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        link: '',
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };
    useEffect(() => {
        const bio = JSON.parse(localStorage.getItem("bioData"));
        setbiodata(bio);
    }, [])

    // Handle image upload and preview
    const handleImageUpload = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setSelectedImage(imageUrl); // Update the image preview
            setFile(selectedFile); // Store the file to send to the backend
        } else {
            console.error("No file selected");
        }
    };


    // Handle form submission
    const onlydp = async () => {
        const userId = localStorage.getItem("userid");
        const profile = new FormData();
        profile.append("UserId", userId);  // Append the userId
        profile.append("File", file);      // Append the file

        createAPIEndpoint(ENDPOINTS.bio + "/UploadProfile")
            .customPost(profile)  // Send the form data directly
            .then((response) => {
                console.log(response.data);
                createAPIEndpoint(ENDPOINTS.bio)
                    .fetchById(localStorage.getItem("userid"))
                    .then((res) => localStorage.setItem("bioData", JSON.stringify(res.data)))
                    .catch((err) => console.log(err))  // Handle the response
                    navigate("/profile-recipes");
            })
            .catch((error) => {
                console.error("Error uploading profile:", error);
            });
    }
    const handleUpdate = async () => {
        if (!formData.name || !formData.bio || !formData.link) {
            alert("Please fill all fields before updating.");
            return;
        }

        const data = new FormData();
        data.append('UserId', localStorage.getItem("userid"));
        data.append('name', formData.name);
        data.append('description', formData.bio); // Assuming 'bio' maps to 'Description'
        data.append('link', formData.link);

        createAPIEndpoint(ENDPOINTS.bio)
            .post(data)
            .then((response) => alert("Saved Bio."))
            .catch((error) => alert(error))

        setFormData({
            name: '',
            bio: '',
            link: '',
        })






        if (file) {
            const userId = localStorage.getItem("userid");
            const profile = new FormData();
            profile.append("UserId", userId);  // Append the userId
            profile.append("File", file);      // Append the file

            createAPIEndpoint(ENDPOINTS.bio + "/UploadProfile")
                .customPost(profile)  // Send the form data directly
                .then((response) => {
                    console.log(response.data);  // Handle the response
                })
                .catch((error) => {
                    console.error("Error uploading profile:", error);
                });
        }

    };

    return (
        <div className="edit-profile-page">
            {/* Profile Upload Section */}
            <div className="upload-section">
            <div className="profile-image">
  {/* Display the selected image preview if available, otherwise show the biodata or default profile image */}
  <img
    src={file ? selectedImage : biodata?.dp ? `${BASE_URL}${biodata.dp}` : ProfileIcon}
    alt="Profile"
  />
</div>

                <div className="upload-options">
                    <h2>Upload a New Photo</h2>
                    <div className="button-group">
                        <label htmlFor="file" className="browse-button">
                            Browse
                        </label>
                        <input
                            id="file"
                            type="file"
                            accept="image/*"
                            name='file'
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />
                        <button className="update-button" onClick={onlydp}>
                            Update
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Profile Form */}
            <div className="edit-profile-form">
                <h2>Edit Profile</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            rows="4"
                            value={formData.bio}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="link">Add Link</label>
                        <input
                            type="text"
                            id="link"
                            value={formData.link}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-buttons">
                        <button
                            type="button"
                            className="change-password-button"
                            onClick={() => alert('Change password functionality not implemented')}
                        >
                            Change Password
                        </button>
                        <button
                            type="button"
                            className="save-changes-button"
                            onClick={handleUpdate}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
