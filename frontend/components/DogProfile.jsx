import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchDog } from "../services/dogService";

function DogProfile() {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDog(id)
      .then(setDog)
      .catch((err) => {
        console.error("Error fetching dog:", err);
        setError("Could not load dog.");
      });
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!dog) return <p>Loading...</p>;

  return (
    <div className="dog-card">
      <h1>{dog.name}</h1>
      <img src={dog.image} alt={dog.name} />
      <p>
        <strong>Nickname:</strong> {dog.nickname}
      </p>
      <p>
        <strong>Age:</strong> {dog.age}
      </p>
      <p>
        <strong>Bio:</strong> {dog.bio}
      </p>
      <p>
        <strong>Present:</strong> {dog.present ? "Yes" : "No"}
      </p>
      <strong className="profile-friends">Friends:</strong>
      {dog.friends && dog.friends.length > 0 ? (
        <ul>
          {dog.friends.map((friend) => (
            <p key={friend._id}>
              <Link className="profile-friends-link" to={`/dog/${friend._id}`}>{friend.name}</Link>
            </p>
          ))}
        </ul>
      ) : (
        <p>No friends yet.</p>
      )}

      <Link to={`/edit/${dog._id}`}>
        <button>Edit</button>
      </Link>
      <br />
      <Link to="/">Back to list</Link>
    </div>
  );
}

export default DogProfile;
