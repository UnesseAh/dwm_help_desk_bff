import Router from "express";
import { ticketListGet, ticketCreate } from "../controllers/ticketController";
import authorize from "../middleware/auth/authorize";
import { authenticate } from "../middleware/auth/authenticator";

const router = Router();

// Assuming authenticate middleware populates req.user
router.use(authenticate);

router.get("/", authorize(["ADMIN", "AGENT", "USER"]), ticketListGet);
router.post("/", authorize(["USER", "AGENT", "ADMIN"]), ticketCreate);

export default router;
