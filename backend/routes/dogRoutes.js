import express from "express";
import {
  getAllDogs,
  getDogById,
  createDog,
  updateDog,
  deleteDog,
} from "../controllers/dogController.js";

const router = express.Router();

router.get("/", getAllDogs);
router.get("/:id", getDogById);
router.post("/", createDog);
router.put("/:id", updateDog);
router.delete("/:id", deleteDog);

export default router;
