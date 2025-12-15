import { Request, Response } from "express";
import { GeneratedPrompt } from "../types/prompt";
import { refinePromptWithLLM } from "../services/refine.service";

export const refinePromptHandler = async (req: Request, res: Response) => {
  try {
    const prompt = req.body as GeneratedPrompt;
    const refined = await refinePromptWithLLM(prompt);
    return res.json(refined);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? "Refine failed" });
  }
};
