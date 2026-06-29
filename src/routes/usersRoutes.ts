import {connectedUser, statsUsersByRoleUser, toggleActivationUser, updateUser, userListGet, userLogin, userRegister}  from "../controllers/userController";
import Router from "express";
import { userLoginValidator, userRegisterValidator, userUpdateValidator } from "../middleware/userValidator";
import authorize from "../middleware/auth/authorize";

const router = Router();

router.post("/register", userRegisterValidator, userRegister);
router.post("/login", userLoginValidator, userLogin);
router.put("/update", authorize(["ADMIN"]), userUpdateValidator, updateUser);
router.patch("/toggleActivation", authorize(["ADMIN"]), toggleActivationUser);
router.get("/stats", authorize(["ADMIN"]), statsUsersByRoleUser);
router.get("/", authorize(["ADMIN"]), userListGet);
router.get("/me", connectedUser);

export default router;