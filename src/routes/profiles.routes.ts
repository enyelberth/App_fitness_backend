import Router, { Request, Response } from "express";
import {
  CreateNewProfile,
  GetProfiles,
} from "../controllers/profileController";
import { profileValidator } from "../validators/profile.validators";
const router = Router();

router.get("/", GetProfiles);
router.post("/",profileValidator.validateProfile.bind(profileValidator) ,CreateNewProfile);
// router.delete("/", deleteUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

export default router;
