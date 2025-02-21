import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import emailjs from '@emailjs/nodejs';
import 'dotenv/config';
import cors from 'cors';
import wrapAround from "./utils/WrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import { Location } from "./init/Locatino.js";
import engine from "ejs-mate";


const app = express();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
//process.env.FLAG==="true" ? "https://travel-and-tour-fjis.onrender.com/Loc" : "http://localhost:8080"
const corsOptions = { origin: "*", methods: ["*"] }
let COUNT = 0;

app.set("getPort", (process.env.PORT || 8080));
app.set('view engin', 'ejs');
app.engine("ejs",engine);
app.set('views', path.join(__dirname, '/views'));
app.use('/public/', express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true ,limit:"16kb"}));
app.use(express.json({limit:"16kb"}));
app.use(cors(corsOptions));



const start = function () {
    const port = app.get("getPort");
    app.listen(port, (req, res) => {
        console.log(`listing at port no : ${port}`);
    });

    app.get("/home", function (req, res) {
        COUNT++;
        res.render("home.ejs", { count: COUNT , Location});
    });

   app.get("/home/book",function(req,res,next){
    COUNT++;
    res.render("book2.ejs",{count:COUNT});
   });

   app.get("/home/review",function(req,res,next){
    COUNT++;
    res.render("feedback.ejs",{count:COUNT});
   })

    app.post("/Loc",wrapAround(async function (req, res, next) {
        const params = req.body;
        if(!params.send)
        {
            next(new ExpressError(503,"LTA"));
            return;
        }
        if (params) {
            try {
                const tempateID = params.key ? process.env.TEMPLATE_ID_BOOK : process.env.TEMPLATE_ID_CONTACT;
                const responce = await emailjs.send(process.env.SERVICE_ID, tempateID, params, {
                    publicKey: process.env.PUBLIC_KEY,
                    privateKey: process.env.PRIVATE_KEY
                });
                res.status(200).json({ responce });
            } catch (err) {
                next(new ExpressError(500,"FAILED"));
            }
        }
        else {
            res.status(204).end();
        }
    }))

    app.all("*", (req, res, next) => {
        console.log("default route");
        res.status(400).json({ message: "The backend api's development are undergoing , so please wait till new update push" });
    });

    app.use((err, req, res, next) => {
        const { status = 503, message = "Something happed at server side" } = err;
        console.log("---ERROR---");
        res.status(status).json({ message });
    })
}

start();