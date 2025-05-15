import express from "express"
import dotenv from "dotenv"
import cookieParser  from "cookie-parser"
import userRouter from "./routes/auth.route.js"
import cors from "cors"


dotenv.config() 
// this will make the config to fetch the dotenv file under config({path:"path_address"})


const port= process.env.PORT || 5000

const app= express();

app.use(cookieParser())
app.use(
    cors({
        origin: "http://localhost:4000",
    })
);

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message: "test checked",
    });
});

app.use("/api/v1/user",userRouter);


app.listen(port,()=>{
    console.log(`Backend is listening at port: ${port}`)
})