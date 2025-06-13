import Router, { Request, Response } from "express";
import {GetRoutine} from '../modules/routines/routineController'

const router = Router();
//const routine = new RoutineService();

//router.get("/",GetRoutine);
/*router.get("/", async (req: Request, res: Response) => {
    try {
        const result = ""
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});*/

export default router;
