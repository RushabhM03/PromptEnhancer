import { Router } from "express";
import { generatePromptHandler } from "../controllers/prompt.controller";
import { refinePromptHandler } from "../controllers/refine.controller";

const router = Router();

router.post("/generate", generatePromptHandler);
router.post("/refine", refinePromptHandler);

export default router;
