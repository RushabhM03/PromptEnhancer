import { Request, Response } from "express";
import { buildPrompt } from "../services/prompt.service";
import { PromptParameters } from "../types/prompt";

export const generatePromptHandler = (req: Request, res: Response) => {
  try {
    const params = req.body as PromptParameters;
    const result = buildPrompt(params);
    return res.json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ error: err.message ?? "Bad request" });
  }
};
