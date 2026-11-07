const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

const client = new MongoClient("mongodb://localhost:27017");

let db;

async function startServer() {
    try {

        await client.connect();

        console.log("MongoDB Connected");

        db = client.db("26csel21");

        app.listen(3000, () => {
            console.log("Server running at http://localhost:3000");
        });

    } catch (err) {
        console.log(err);
    }
}

startServer();


// REGISTER

app.post("/register", async (req, res) => {

    const { name, email, password } = req.body;
    console.log(name);
    console.log(email);
    console.log(password);


    try {

        const collection = db.collection("myprofile");

        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            return res.send("Email already registered");
        }

        await collection.insertOne({
            name,
            email,
            password
        });

      
        res.redirect("/index.html");

    } catch (err) {
        console.log(err);
        res.send("Registration Failed");
    }

});


// LOGIN

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const collection = db.collection("myprofile");

        const user = await collection.findOne({
            email,
            password
        });

        if (!user) {
            return res.send("Invalid Email or Password");
        }

        res.redirect("/index.html");
         
        

    } catch (err) {

        console.log(err);
        res.send("Login Failed");

    }
});
app.listen(3000, () => console.log("Server running on http://localhost:3000"));