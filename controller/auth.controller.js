import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
// this PrismaClient acts just like mongoose and gets the data from the database

export const registerUser = async (req, res) => {
  const { email, password, username , } = req.body;

  if (!username || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: "all fields are required",
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
        // we can use User or user cause neon database and mongodb aren't case sensitive
        // in that regards
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Aready Exist",
      });
    }

    // hash password
    const hashedPassword=await bcryptjs.hash(password,10)
    const verificationToken=crypto.randomBytes(32).toString("hex")

    const user=await prisma.user.create({
        data:{
            username,
            email,
            phone,
            password: hashedPassword,
            verificationToken
        }
    })

    // 


  } catch (error) {
    return res.status(400).json({
        success: false,
        error,
        message: "Registeration Failed",
      });
  }
};

export const loginUser = async (req, res) => {
  
  const { email, password } = req.body;

  if ( !email || !password ){
    return res.status(400).json({
      success: false,
      message: "all fields are required",
    });
  }

  try {
    const user=await prisma.user.findUnique({
        where:{email}
    })

    if(!user){
        return res.status(400).json({
      success: false,
      message: "invalid email and password",
    });
    }

    const isMatch= bcryptjs.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({
      success: false,
      message: "invalid email or password",
    });
    }

    const token= jwt.sign(
        {id: user.id,role: user.role,},
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
    )

    const cookieOption={
        httpOnle: true,
    }

    res.cookie('token',token,cookieOption)

    return res.status(201).json({
        success: true,
        token,
        user:{
            id: user.id,
            name: user.name,
            email: user.email,
        },
        message:"User loggedIn",
    })

  } catch (error) {
    return res.status(400).json({
        success: false,
        error,
        message: "Login failed",
      });
  }
};
