const express = require("express");
const helmet = require("helmet");
const bodyparser = require("body-parser");

const database = require("./database.js");
const blogPost = require("./blogPost.js");
const authentication = require("./authentication.js");

var app = express();

app.use(helmet());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


//basic routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/html/about.html");
});

app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/public/html/about.html");
});

app.get("/work", (req, res) => {
    res.sendFile(__dirname + "/public/html/work.html");
});

app.get("/blog", (req, res) => {
    res.sendFile(__dirname + "/public/html/blog.html");
});


//api routes
app.post("/makePost", (req, res) => {
    authentication.check(req.body.password, (result) => {
        if (result) {
            blogPost.makePost(req.body.title, req.body.description, req.body.content);
            res.sendStatus(200);
        }
        else {
            res.sendStatus(401);
        }
    });
});

app.post("/deletePost", (req, res) => {
    authentication.check(req.body.password, (result) => {
        if (result) {
            blogPost.deletePost(req.body.title);
            res.sendStatus(200);
        }
        else {
            res.sendStatus(401);
        }
    });
});

app.get("/getPosts", (req, res) => {
    blogPost.getPosts((result) => {
        res.send(result);
    });
});

app.post("/getPostByName", (req, res) => {
    blogPost.hasPostNamed(req.body.name, (boolean) => {
        if (!boolean) {
            let no_post = {html: ""};
            no_post.html = "<h1>there doesn't appear to be a post here...</h1>";
            res.send(no_post)
        }
        else {
            blogPost.getPostByName(req.body.name, (post) => {
                res.send(post);
            });
        }
    });
});

app.listen(3000, () => {
	database.init();
	console.log("connected and listening on port 3000!");
})