import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchDogs, deleteDog } from "../services/dogService";

function DogList() {
  const [dogs, setDogs] = useState([]);
  const [error, setError] = useState(null);

  const fetchDogsData = async () => {
    try {
      const data = await fetchDogs();
      if (!Array.isArray(data)) throw new Error("Invalid data format");
      setDogs(data);
    } catch (err) {
      console.error("Error fetching dogs:", err);
      setError("Could not load dogs.");
    }
  };

  useEffect(() => {
    fetchDogsData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDog(id);
      fetchDogsData();
    } catch (err) {
      console.error("Error deleting dog:", err);
      setError("Failed to delete dog.");
    }
  };

  return (
    <div>
      <h1>Dogbook</h1>
      <Link to="/create" className="add-btn">
        Create new dog
      </Link>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {dogs.length === 0 ? (
        <p className="dogs-available">No dogs available.</p>
      ) : (
        dogs.map((dog) => (
          <div key={dog._id} className="dog-card">
            <h2>
              <Link to={`/dog/${dog._id}`}>@{dog.name}</Link>
            </h2>
            <p style={{ color: dog.present ? "green" : "red" }}>
              {dog.present ? "In daycare" : "Not present"}
            </p>
            <img src={dog.image} alt={dog.name} />
            {/* Add friends display */}
            <p>
              <strong>Friends:</strong>{" "}
              {dog.friends && dog.friends.length > 0 ? (
                dog.friends.map((friend) => (
                  <span key={friend._id}>
                    <Link to={`/dog/${friend._id}`} className="friend-link">
                      {friend.name}
                    </Link>
                    {dog.friends.indexOf(friend) < dog.friends.length - 1 ? ", " : ""}
                  </span>
                ))
              ) : (
                "No friends yet"
              )}
            </p>
            <div className="button-group">
              <Link to={`/edit/${dog._id}`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => handleDelete(dog._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DogList;