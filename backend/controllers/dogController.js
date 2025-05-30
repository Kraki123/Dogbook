// backend/controllers/dogcontroller.js
import Dog from "../models/dogModel.js";

// Hjälpfunktion: synkronisera vänskap ömsesidigt
async function syncFriendship(dogId, newFriendIds) {
  const allDogs = await Dog.find();
  for (const friend of allDogs) {
    const isFriendNow = newFriendIds.includes(friend._id.toString());
    const hasDogAsFriend = friend.friends
      .map((f) => f.toString())
      .includes(dogId.toString());

    if (isFriendNow && !hasDogAsFriend) {
      friend.friends.push(dogId);
      await friend.save();
    } else if (!isFriendNow && hasDogAsFriend) {
      friend.friends = friend.friends.filter(
        (fid) => fid.toString() !== dogId.toString()
      );
      await friend.save();
    }
  }
}

export const getAllDogs = async (req, res) => {
  try {
    const populatedDogs = await Dog.find().populate("friends", null, {
      _id: { $exists: true },
    });
    res.json(populatedDogs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch dogs", details: error.message });
  }
};

export const getDogById = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id).populate("friends", null, {
      _id: { $exists: true },
    });
    if (!dog) return res.status(404).json({ error: "Dog not found" });
    res.json(dog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch dog", details: error.message });
  }
};

export const createDog = async (req, res) => {
  try {
    const dog = new Dog(req.body);
    const saved = await dog.save();
    await syncFriendship(saved._id, req.body.friends || []);
    res.status(201).json(saved);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create dog", details: error.message });
  }
};

export const updateDog = async (req, res) => {
  try {
    const updated = await Dog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Dog not found" });
    await syncFriendship(updated._id, req.body.friends || []);
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update dog", details: error.message });
  }
};

export const deleteDog = async (req, res) => {
  try {
    const deletedDog = await Dog.findByIdAndDelete(req.params.id);
    if (!deletedDog) return res.status(404).json({ error: "Dog not found" });

    await Dog.updateMany(
      { friends: deletedDog._id },
      { $pull: { friends: deletedDog._id } }
    );

    res.json({ message: "Dog removed" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete dog", details: error.message });
  }
};
