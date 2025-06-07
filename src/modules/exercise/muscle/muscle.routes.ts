import Router,{ Request,Response } from "express";

const router = Router();
import { MuscleService } from "./muscleService";
import { GetMuscle } from "./muscleController";

const muscle = new MuscleService();


router.get("/", GetMuscle);

router.post("/", GetMuscle);

router.patch("/:muscle", (_req: Request, res: Response) => {
  res.send("Update an existing workout");
});

router.delete("/:muscle", (_req: Request, res: Response) => {
  res.send("Delete an existing workout");
});
export default router;
