import { NextFunction, Request, Response } from "express";
import * as yup from "yup"; 
// Definición del esquema de validación con Yup
const userSchema = yup.object().shape({
  password: yup.string().required("La contraseña es obligatoria."),
  email: yup.string().email("El email debe ser válido.").required("El email es obligatorio."),
  username: yup.string().required("El nombre de usuario es obligatorio."),
  id: yup.number().required("El id es obligatorio."),
});
class UserValidator {
  // Middleware para validar los datos del usuario
  public async validateUser(req: Request, res: Response, next: NextFunction) {
    try {
      // Validar los datos del cuerpo de la solicitud
      await userSchema.validate(req.body);
      
      // Si la validación pasa, se llama a la siguiente función de middleware o controlador
      next();
    } catch (error) {
      // Manejo de errores de validación
      return res.status(400).json({
        status: 400,
        message: `Error en la validación: ${error}`,
      });
    }
  }
}

export const userValidator = new UserValidator();