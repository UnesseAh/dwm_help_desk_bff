import Router from "express";
import {
  ticketCreate,
  ticketGet,
  ticketListGet,
  ticketMessageCreate,
  ticketStatusUpdate,
} from "../controllers/ticketController";
import authorize from "../middleware/auth/authorize";
import { authenticate } from "../middleware/auth/authenticator";

const router = Router();

router.use(authenticate);

router.get("/", authorize(["ADMIN", "AGENT", "USER"]), ticketListGet);
router.post("/", authorize(["USER", "AGENT", "ADMIN"]), ticketCreate);
router.get("/:id", authorize(["ADMIN", "AGENT", "USER"]), ticketGet);
router.patch("/:id/status", authorize(["ADMIN", "AGENT"]), ticketStatusUpdate);
router.post("/:id/messages", authorize(["ADMIN", "AGENT", "USER"]), ticketMessageCreate);


export default router;
