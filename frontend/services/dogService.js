const API = "http://localhost:3000/api/dogs";

const handleResponse = async (res) => {
  let text = "";
  if (!res.ok) {
    text = await res.text();
    console.error(`API Error ${res.status}: ${text}`);
    throw new Error(`API ${res.status}: ${text}`);
  }
  const contentType = res.headers.get("content-type");
  return res.status === 204 ? null : contentType?.includes("application/json") ? await res.json() : text;
};

export const fetchDogs = async () => {
  try {
    const res = await fetch(API);
    const data = await handleResponse(res);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch dogs error:", error.message);
    return [];
  }
};

export const fetchDog = async (id) => {
  try {
    const res = await fetch(`${API}/${id}`);
    const data = await handleResponse(res);
    return data || {
      name: "",
      nickname: "",
      age: "",
      bio: "",
      image: "",
      present: false,
      friends: [],
    };
  } catch (error) {
    console.error(`Fetch dog ${id} error:`, error.message);
    return {
      name: "",
      nickname: "",
      age: "",
      bio: "",
      image: "",
      present: false,
      friends: [],
    };
  }
};

export const createDog = async (dog) => {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dog),
    });
    const data = await handleResponse(res);
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response from server: Expected a dog object");
    }
    console.log("Dog created successfully:", data);
    return data;
  } catch (error) {
    console.error("Create dog error:", error.message);
    throw error;
  }
};

export const updateDog = async (id, dog) => {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dog),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error(`Update dog ${id} error:`, error.message);
    throw error;
  }
};

export const updateDogPresence = async (id, present) => {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ present }),
    });
    const data = await handleResponse(res);
    console.log("Dog presence updated successfully:", data);
    return data;
  } catch (error) {
    console.error(`Update dog presence ${id} error:`, error.message);
    throw error;
  }
};

export const deleteDog = async (id) => {
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    await handleResponse(res);
    return true;
  } catch (error) {
    console.error(`Delete dog ${id} error:`, error.message);
    throw error;
  }
};