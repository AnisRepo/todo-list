const express = require('express')
const app  =  express();
const bodyParser = require("body-parser");

const userRoute = require("./controller/userRoute");
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRoute);


app.use(express.static("public"));

app.listen(PORT,()=>{
    console.log("App is listening on "+PORT);
});