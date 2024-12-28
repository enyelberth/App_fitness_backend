import { validatePassword, validateUser } from "../system/users/userService";
// import bcrypt from 'bcrypt';
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// import { getUserByUsername } from "./userService";

const secret = process.env.SECRET;

export const login = async (username: string, password: string) => {
  const user = await validateUser(username)
  if (!user) {
    return {
      status: 401,
      message: "Usuario no encontrado",
    };
  }
  const passwordd = user.data?.password;
//   console.log(passwordd);
//   console.log(password);
//   const isPasswordValid = await bcrypt.compare(String(password), String(passwordd));
  const validatepass =await validatePassword(username, password);
//   console.log(da)
//   bcrypt
  if (!validatepass.password) {
    return {
      status: 401,
      message: "Contraseña incorrecta",
    };
  }

  const token = jwt.sign({ username }, secret, { expiresIn: "1h" });

  return {
    status: 200,
    message: "El usuario ha iniciado sesión correctamente",
    token: token,
  };
};

export const logout = (token: string) => {
    (token: string) => {
        // In a real-world application, you would invalidate the token by adding it to a blacklist
        // Here, we'll just return a success message for simplicity
        return {
            status: 200,
            message: "El usuario ha cerrado sesión correctamente",
        };
    }
    // Invalidate the token (this can be done by maintaining a blacklist of tokens)
    // For simplicity, we'll just return a success message
    return {
        status: 200,
        message: "El usuario ha cerrado sesión correctamente",
    };
};
