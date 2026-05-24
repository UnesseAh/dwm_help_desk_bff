import {userLogin, userRegister}  from "../controllers/userController";
import Router from "express";
import authorize from "../middleware/auth/authorize";
import { userLoginValidator, userRegisterValidator } from "../userValidator";

const router = Router();

router.post("/register", authorize(["ADMIN"]), userRegisterValidator, userRegister);
router.post("/login", userLoginValidator, userLogin);


export default router;