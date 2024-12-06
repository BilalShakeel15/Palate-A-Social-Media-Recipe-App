import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/create_story.css';

const CreateStory = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle drag-and-drop
    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0]; // Only select the first file
        setFile(droppedFile);
    };

    // Handle file selection from input
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]; // Only select the first file
        setFile(selectedFile);
    };

    // Handle creating the story
    const handleCreateStory = async () => {
        const userId = localStorage.getItem('userid'); // Retrieve userId from local storage
        if (!file) {
            console.error('No file selected!');
            return;
        }
        if (!userId) {
            console.error('User ID not found in local storage!');
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('file', file);

        setIsSubmitting(true); // Indicate submission in progress
        try {
            // Post data to the backend
            const response = await axios.post('https://localhost:7101/api/Story/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Story uploaded successfully:', response.data);
            alert('Story uploaded successfully!');
            setFile(null); // Clear the file
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error uploading story:', error);
            alert('Failed to upload the story.');
        } finally {
            setIsSubmitting(false); // Reset submission state
        }
    };

    // Render a preview of the selected file (if possible)
    const renderFilePreview = () => {
        if (!file) return null;

        const fileType = file.type.split('/')[0];
        if (fileType === 'image') {
            return <img src={URL.createObjectURL(file)} alt="Preview" className="file-preview-image" />;
        } else if (fileType === 'video') {
            return <video src={URL.createObjectURL(file)} controls className="file-preview-video" />;
        } else {
            return <p>{file.name}</p>;
        }
    };

    return (
        <div className="create-story-modal">
            <div className="modal-content">
                <h2>Create New Story</h2>
                <div
                    className="drag-drop-area"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <p>Drag a photo or video here</p>
                    <label className="select-button">
                        Select from computer
                        <input
                            type="file"
                            onChange={handleFileChange}
                            style={{ display: 'none' }} // Hide the input
                        />
                    </label>
                </div>

                {/* Display selected file preview */}
                <div className="file-preview">
                    {renderFilePreview()}
                </div>

                <button
                    className="create-button"
                    onClick={handleCreateStory}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Uploading...' : 'Create Story'}
                </button>
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default CreateStory;
