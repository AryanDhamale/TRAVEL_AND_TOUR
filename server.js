import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import emailjs from '@emailjs/nodejs';
import 'dotenv/config';
import cors from 'cors';


const app = express();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const corsOptions = { origin: process.env.FLAG==="true" ? "https://travel-and-tour-fjis.onrender.com/Loc" : "http://localhost:8080/Loc", methods: ["GET","POST"] }

app.set("getPort", (process.env.PORT || 8080));
app.set('view engin', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/public/', express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cors(corsOptions));


const start = function () {
    const port = app.get("getPort");
    app.listen(port, (req, res) => {
        console.log(`listing at port no : ${port}`);
    });

    //  DON'T CHAGE THIS CODE TO VIOLATE SOME CONDITION  // 
    app.use((req,res,next)=>{
        res.render("404NotFound.ejs");
    })

    app.get('/',function(req,res){
        res.render("index.ejs");
    }); 

    app.post("/Loc",function(req,res,next){
        const params=req.body;
        if(params && params.key)
        {
           emailjs.send(process.env.SERVICE_ID,process.env.TEMPLATE_ID,params,{
            publicKey : process.env.PUBLIC_KEY,
            privateKey : process.env.PRIVATE_KEY
           }).then((responce)=>{
            // console.log({message : 'SUCCESS !' , responce});
             res.json({message : 'success'}).status(200);
           }).catch((err)=>{
            // console.log({error : err, message : "FAILED"});
             res.status(500).end();
           })
        }else 
        {
            res.status(204).end();
        }
    })

    app.all("*",(req,res,next)=>{
        console.log("default route");
        res.json({message : "The backend api's development are undergoing , so please wait till new update push"}).status(400);
    })
}

start();