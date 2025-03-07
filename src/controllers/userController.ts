import { Request, Response } from "express";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

interface UserRequest extends Request {
  user?: { id: string };
}

const maxAge = 3 * 24 * 60 * 60;

const createToken = (user: { id: string }): string => {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: maxAge,
  });
};

const signupHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!validator.isEmail(email)) {
      res
        .status(400)
        .json({ errors: { email: "Invalid Email" }, success: false });
      return;
    }
    if (await User.findOne({ email })) {
      res
        .status(400)
        .json({ errors: { user: "User already exists" }, success: false });
      return;
    }

    const hashedPassword =
      password.length >= 6 ? await bcrypt.hash(password, 10) : "";
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res
      .status(201)
      .json({ message: "User created successfully", success: true });
    return;
  } catch (err) {
    res.status(400).json({ errors: err, success: false });
    return;
  }
};

const signinHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials", success: false });
      return;
    }
    const token = createToken({ id: user._id.toString() });
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res
      .status(200)
      .json({ message: "User signed in successfully", success: true, token });
    return;
  } catch (err) {
    res.status(400).json({ errors: err, success: false });
    return;
  }
};

const updateProfile = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
      return;
    }

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (password && password.length >= 6)
      user.password = await bcrypt.hash(password, 10);
    if (email && validator.isEmail(email)) user.email = email;

    await user.save();
    res.status(200).json({ message: "Profile updated", success: true, user });
    return;
  } catch (err) {
    res.status(500).json({
      message: "Error updating profile",
      success: false,
      error: (err as Error).message,
    });
    return;
  }
};

const logoutHandler = (_: Request, res: Response): void => {
  res.cookie("jwt", "", { maxAge: 1 });
  // your logout logic here
  res.status(200).json({ message: "Logged out successfully", success: true });
  return;
};

const getProfile = async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).populate("blogs");
    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
      return;
    }
    res.status(200).json({ message: "User found", success: true, user });
    return;
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving profile",
      success: false,
      error: (err as Error).message,
    });
    return;
  }
};



export {
  signupHandler,
  signinHandler,
  updateProfile,
  logoutHandler,
  getProfile,
};
