import Router from "express";
import authorize from "../middleware/auth/authorize";
import { serviceCreate, serviceDelete, serviceGet, serviceListGet, serviceUpdate } from "../controllers/serviceController";
import serviceStoreValidator from "../middleware/serviceValidator.ts/serviceStoreValidator";
import serviceUpdateValidator from "../middleware/serviceValidator.ts/serviceUpdateValidator";

const router = Router();

router.get("/:id", authorize(["ADMIN"]), serviceGet);
router.get("/", authorize([]), serviceListGet);
router.post("/", authorize(["ADMIN"]), serviceStoreValidator, serviceCreate);
router.put("/", authorize(["ADMIN"]), serviceUpdateValidator, serviceUpdate);
router.delete("/:id", authorize(["ADMIN"]), serviceDelete);


export default router;