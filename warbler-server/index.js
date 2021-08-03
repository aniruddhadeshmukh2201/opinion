require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const db = require("./models");
const { loginRequired, ensureCorrectUser } = require("./middleware/auth");
const PORT = 8081;
const path = require('path');

app.use(cors());
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
//Routes
app.use("/api/auth", authRoutes);
app.use(
    "/api/users/:id/messages",
    loginRequired,
    ensureCorrectUser,
    messagesRoutes
);

app.get("/api/messages", loginRequired, async function(req, res, next) {
    try {
        let messages = await db.Message.find()
        .sort({ createdAt: "desc" })
        .populate("user", {
            username: true,
            profileImageUrl: true
        });
        return res.status(200).json(messages);
    } catch(err) {
        return next(err);
    }
});
app.get('/register',function(req,res){
    res.sendFile(path.join(__dirname+'/register.html'));
    //__dirname : It will resolve to your project folder.
  });

  app.get('/login',function(req,res){
    res.sendFile(path.join(__dirname+'/login.html'));
    //__dirname : It will resolve to your project folder.
  });
//Error handling
app.use(function(res, req, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use(errorHandler);

//Deploying
app.listen(PORT, function() {
    console.log(`Server is starting on port ${PORT}`);
});