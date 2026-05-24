import Router from "express";
import authorize from "../middleware/auth/authorize";
import { departmentStoreValidator } from "../middleware/departmentValidator";
import { departmentCreate, departmentDelete, departmentGet, departmentListGet, departmentUpdate } from "../controllers/departmentController";
import departmentUpdateValidator from "../middleware/departmentValidator/departmentUpdateValidator";

const router = Router();

router.get("/:id", authorize(["ADMIN"]), departmentGet);
router.get("/", authorize(["ADMIN"]), departmentListGet);
router.post("/", authorize(["ADMIN"]), departmentStoreValidator, departmentCreate);
router.put("/", authorize(["ADMIN"]), departmentUpdateValidator, departmentUpdate);
router.delete("/:id", authorize(["ADMIN"]), departmentDelete);


export default router;