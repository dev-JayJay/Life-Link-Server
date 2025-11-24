import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { role, name, email, phone, password, bloodType, hospitalName, location } = req.body;

    const result = await authService.registerUser({
      role,
      name,
      email,
      phone,
      password,
      bloodType,
      hospitalName,
      location,
    });

    console.log("this is the creation response from the server", result);
    return res.status(201).json(result);
  } catch (err: any) {
    console.log("this is the creation error from the server", err);
    return res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    res.status(200).json(result);
  } catch (err: any) {
    console.log("this is the login error from the server", err);
    res.status(401).json({ error: err.message });
  }
};