import Dog from "../models/dogModel.js";

export const getAllDogs = async (req, res) => {
  try {
    console.log("Received request for /dogs");
    console.log("Fetching dogs from MongoDB...");
    const dogs = await Dog.find();
    console.log("Dogs fetched:", dogs);
    console.log("Populating friends...");
    const populatedDogs = await Dog.find().populate("friends", null, {
      _id: { $exists: true },
    });
    console.log("Populated dogs:", populatedDogs);
    res.json(populatedDogs);
  } catch (error) {
    console.error("Error in getAllDogs:", error.message, error.stack);
    res
      .status(500)
      .json({ error: "Failed to fetch dogs", details: error.message });
  }
};

export const getDogById = async (req, res) => {
  try {
    console.log(`Fetching dog with ID: ${req.params.id}`);
    const dog = await Dog.findById(req.params.id).populate("friends", null, {
      _id: { $exists: true },
    });
    if (!dog) {
      console.log(`Dog with ID ${req.params.id} not found`);
      return res.status(404).json({ error: "Dog not found" });
    }
    console.log("Dog fetched:", dog);
    res.json(dog);
  } catch (error) {
    console.error("Error in getDogById:", error.message, error.stack);
    res
      .status(500)
      .json({ error: "Failed to fetch dog", details: error.message });
  }
};

export const createDog = async (req, res) => {
  try {
    console.log("Creating new dog:", req.body);
    const dog = new Dog(req.body);
    const saved = await dog.save();
    console.log("Dog created:", saved);
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error in createDog:", error.message, error.stack);
    res
      .status(500)
      .json({ error: "Failed to create dog", details: error.message });
  }
};

export const updateDog = async (req, res) => {
  try {
    console.log(`Updating dog with ID: ${req.params.id}`, req.body);
    const updated = await Dog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      console.log(`Dog with ID ${req.params.id} not found`);
      return res.status(404).json({ error: "Dog not found" });
    }
    console.log("Dog updated:", updated);
    res.json(updated);
  } catch (error) {
    console.error("Error in updateDog:", error.message, error.stack);
    res
      .status(500)
      .json({ error: "Failed to update dog", details: error.message });
  }
};

export const deleteDog = async (req, res) => {
  try {
    console.log(`Deleting dog with ID: ${req.params.id}`);
    const deletedDog = await Dog.findByIdAndDelete(req.params.id);
    if (!deletedDog) {
      console.log(`Dog with ID ${req.params.id} not found`);
      return res.status(404).json({ error: "Dog not found" });
    }
    console.log("Dog deleted:", deletedDog);
    console.log("Removing dog from friends lists...");
    await Dog.updateMany(
      { friends: deletedDog._id },
      { $pull: { friends: deletedDog._id } }
    );
    console.log("Friends lists updated");
    res.json({ message: "Dog removed" });
  } catch (error) {
    console.error("Error in deleteDog:", error.message, error.stack);
    res
      .status(500)
      .json({ error: "Failed to delete dog", details: error.message });
  }
};
