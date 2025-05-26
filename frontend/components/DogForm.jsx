import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createDog,
  fetchDog,
  updateDog,
  fetchDogs,
  updateDogPresence,
} from "../services/dogService";
// Form
function DogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [dog, setDog] = useState({
    name: "",
    nickname: "",
    age: "",
    bio: "",
    image: "",
    present: false,
    friends: [],
  });
  const [allDogs, setAllDogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDogs()
      .then((data) => {
        setAllDogs(data);
      })
      .catch((err) => {
        console.error("Error fetching dogs:", err);
        setError("Failed to load dogs.");
      });

    if (editing) {
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
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDog((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFriendToggle = (friendId) => {
    setDog((prev) => {
      const current = prev.friends || [];
      const updated = current.includes(friendId)
        ? current.filter((id) => id !== friendId)
        : [...current, friendId];
      return { ...prev, friends: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const dogData = {
        name: dog.name,
        nickname: dog.nickname,
        age: dog.age,
        bio: dog.bio,
        image: dog.image,
        present: dog.present,
        friends: dog.friends || [],
      };
      const result = editing
        ? await updateDog(id, dogData)
        : await createDog(dogData);
      if (result) {
        console.log("Dog saved successfully:", result);
        navigate("/", { state: { refresh: true } });
      } else {
        throw new Error("No data returned from server");
      }
    } catch (err) {
      console.error("Error saving dog:", err.message);
      setError(`Failed to save dog: ${err.message}`);
    }
  };

  const handleMarkNotPresent = async () => {
    if (!id) return;
    try {
      const result = await updateDogPresence(id, false);
      if (result) {
        setDog((prev) => ({ ...prev, present: false }));
        console.log("Dog marked as not present:", result);
      } else {
        throw new Error("Failed to update presence");
      }
    } catch (err) {
      console.error("Error marking not present:", err.message);
      setError(`Failed to mark dog as not present: ${err.message}`);
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editing ? "Edit Dog" : "Create Dog"}</h2>
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
        type="number"
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
      {editing && (
        <button
          type="button"
          onClick={handleMarkNotPresent}
          style={{
            marginTop: "1rem",
            background: "#dc3545",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Mark Not Present
        </button>
      )}

      <div>
        <strong>Friends:</strong>
        <br />
        <br />
        {allDogs
          .filter((d) => !id || d._id !== id)
          .map((friend) => (
            <label key={friend._id} style={{ display: "block" }}>
              {friend.name}
              <input
                className="friend-checkbox-edit"
                type="checkbox"
                checked={(dog.friends || []).includes(friend._id)}
                onChange={() => handleFriendToggle(friend._id)}
              />
              <hr />
            </label>
          ))}
      </div>

      <button type="submit">{editing ? "Update Dog" : "Create Dog"}</button>
    </form>
  );
}

export default DogForm;
