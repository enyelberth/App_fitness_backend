import { NextFunction, Request, Response } from "express";
import * as yup from "yup";
const profileSchema = yup.object().shape({
  userId: yup.number().required("El userId es obligatorio."),
  firstName: yup.string().required("el firstName es obligatorio."),
  lastName: yup.string().required("El lastName es obligatorio."),
  dob: yup.date().required("La dob es obligatoria."),
  address: yup.string().required("La address es obligatoria."),
  phone: yup.number().required("El phone es obligatorio."),
});
class ProfileValidator {
  public async validateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await profileSchema.validate(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: `Error en la validación: ${error}`,
      });
    }
  }
}
export const profileValidator = new ProfileValidator();
