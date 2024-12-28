"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../controllers/profileController");
const profile_validators_1 = require("../validators/profile.validators");
const router = (0, express_1.default)();
router.get("/", profileController_1.GetProfiles);
router.post("/", profile_validators_1.profileValidator.validateProfile.bind(profile_validators_1.profileValidator), profileController_1.CreateNewProfile);
// router.delete("/", deleteUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });
// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });
exports.default = router;
