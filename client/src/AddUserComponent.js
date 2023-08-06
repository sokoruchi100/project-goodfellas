import React, { useEffect, useState } from "react";
import axios from "axios"; // Assuming you are using axios for HTTP requests

const AddUserComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  const handleSearchChange = async (e) => {
    setSearchTerm(e.target.value);
    if (searchTerm.length > 2) {
      // Start search after 3 characters for optimization
      try {
        const response = await axios.get(
          `/api/search-users?displayName=${searchTerm}`
        );
        setUsersList(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setUsersList([]); // Clear user list if searchTerm is too short
    }
  };

  const handleAddMember = async () => {
    if (selectedUser) {
      try {
        const response = await axios.post(`/api/add-member`, {
          userId: selectedUser.id,
        });
        if (response.data.success) {
          setIsAdded(true);
          // You might want to add notifications or messages for user feedback
        }
      } catch (error) {
        console.error("Error adding user to community:", error);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search for a user"
      />
      {usersList.map((user) => (
        <div key={user.id} onClick={() => setSelectedUser(user)}>
          {user.displayName}
        </div>
      ))}
      {selectedUser && (
        <button onClick={handleAddMember}>Add User to Community</button>
      )}
    </div>
  );
};

export default AddUserComponent;
