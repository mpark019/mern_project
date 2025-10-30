import User from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler"

// create a new user
export const createUser = asyncHandler(async (req, res) => {

  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    console.error(err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      res.status(400).send({ error: err.message });
    } else if (err.code === 11000) {
      // Duplicate key error
      res.status(400).send({ error: "Username or email already exists" });
    } else {
      res.status(500).send("Error creating user");
    }
  }
});

// fetch all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
};

// fetch a single user 
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user");
  }
};

// update user
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true, runValidators: true } // Return updated doc and run validators
    );
    
    if (!updatedUser) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (err) {
    console.error(err);
    
    if (err.name === 'ValidationError') {
      res.status(400).send({ error: err.message });
    } else if (err.code === 11000) {
      res.status(400).send({ error: "Username or email already exists" });
    } else {
      res.status(500).send("Error updating user");
    }
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send({ message: "User deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
};

