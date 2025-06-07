import Router,{ Request,Response } from "express";

const router = Router();
import { MuscleService } from "../modules/exercise/muscle/muscleService";
import { GetMuscle } from "../modules/exercise/muscle/muscleController";

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
