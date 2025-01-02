import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.set("getPort", (process.env.PORT || 8080));
app.set('view engin', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/public/', express.static(path.join(__dirname, "/public")));


const start = function () {
    const port = app.get("getPort");
    app.listen(port, (req, res) => {
        console.log(`listing at port no : ${port}`);
    });


    app.get('/', (req, res) => {
        res.render('index.ejs');
    });

    app.all("*",(req,res,next)=>{
        console.log("call me!");
        res.json({message : "The backend api's development are undergoing , so please wait till new update push"}).status(400);
    })
}

start();