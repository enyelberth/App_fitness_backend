import { Router, Request, Response } from "express";
import passport from "passport";

const router = Router();

// Ruta para iniciar autenticación con Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
  
);

// Ruta callback que Google redirige tras autenticación
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    // Autenticación exitosa
    res.redirect('/dashboard');
  }
);

export default router;
