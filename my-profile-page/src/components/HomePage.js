import React, { useState } from 'react';
import { Container, Image, FormControl, Button } from 'react-bootstrap'; // Assuming you are using Bootstrap
import profilePic from '../img/pp.jpg'

function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Pavan Pujara");
  const [description, setDescription] = useState("Hey, How yo doin? ;-)");
  const [tempName, setTempName] = useState(name);
  const [tempDescription, setTempDescription] = useState(description);
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setName(tempName);
    setDescription(tempDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(name);
    setTempDescription(description);
    setIsEditing(false);
  };

  return (
    <Container className="mt-5 d-flex profile-container">
      <Image src={profilePic} className="profile-pic" />
      <div className="profile-details">
        {isEditing ? (
          <>
            <FormControl
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="name-input"
            />
            <FormControl
              as="textarea"
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              className="description-textarea mt-2"
            />
            <Button
              variant="success"
              onClick={handleSave}
              className="save-btn mr-2"
            >
              Save
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              className="cancel-btn"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <h5 className="name-display">
              {name}{' '}
              <i
                className="bi bi-pencil-square edit-icon"
                onClick={handleEdit}
              ></i>
            </h5>
            <p className="description-display">
              {description}{' '}
              <i
                className="bi bi-pencil-square edit-icon"
                onClick={handleEdit}
              ></i>
            </p>
          </>
        )}
      </div>
    </Container>
  );
}

export default ProfileSection;
