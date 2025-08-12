import express from "express"
import {signup, login, logout} from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectedRoute, updateProfile);
export default router;