import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDog, updateDog, fetchDogs } from "../services/dogService";

function DogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dog, setDog] = useState(null);
  const [allDogs, setAllDogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDog(id)
      .then((data) => {
        if (!data) throw new Error("Dog not found");
        const friends = (data.friends || []).map((friend) =>
          typeof friend === "object" ? friend._id : friend
        );
        setDog({ ...data, friends });
      })
      .catch((err) => {
        console.error("Error fetching dog:", err);
        setError("Failed to load dog.");
      });

    fetchDogs()
      .then(setAllDogs)
      .catch((err) => {
        console.error("Error fetching dogs:", err);
        setError("Failed to load dogs.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDog((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleFriend = (friendId) => {
    setDog((prev) => {
      const currentFriends = prev.friends || [];
      const updatedFriends = currentFriends.includes(friendId)
        ? currentFriends.filter((id) => id !== friendId)
        : [...currentFriends, friendId];
      return { ...prev, friends: updatedFriends };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Skapa en kopia av dog utan onödiga fält
      const dogData = {
        name: dog.name,
        nickname: dog.nickname,
        age: dog.age,
        bio: dog.bio,
        image: dog.image,
        present: dog.present,
        friends: dog.friends || [],
      };
      await updateDog(id, dogData);
      navigate(`/dog/${id}`);
    } catch (err) {
      console.error("Error updating dog:", err);
      setError("Failed to update dog.");
    }
  };

  if (error) return <p>{error}</p>;
  if (!dog) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Dog</h2>
      <input
        name="name"
        value={dog.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        name="nickname"
        value={dog.nickname}
        onChange={handleChange}
        placeholder="Nickname"
      />
      <input
        name="age"
        value={dog.age}
        onChange={handleChange}
        placeholder="Age"
      />
      <input
        name="bio"
        value={dog.bio}
        onChange={handleChange}
        placeholder="Bio"
      />
      <input
        name="image"
        value={dog.image}
        onChange={handleChange}
        placeholder="Image URL"
      />
      <label>
        <input
          type="checkbox"
          name="present"
          checked={dog.present}
          onChange={handleChange}
        />
        Present at daycare?
      </label>
      <hr />
      <div>
        <strong>Friends:</strong>
        <br />
        <br />
        {allDogs
          .filter((d) => d._id !== dog._id)
          .map((friend) => (
            <label key={friend._id} style={{ display: "block" }}>
              {friend.name}
              <input
                className="friend-checkbox-edit"
                type="checkbox"
                checked={(dog.friends || []).includes(friend._id)}
                onChange={() => toggleFriend(friend._id)}
              />
              <hr />
            </label>
          ))}
      </div>

      <button type="submit">Save Changes</button>
    </form>
  );
}

export default DogEdit;
