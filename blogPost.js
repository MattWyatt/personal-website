const marked = require("marked");
const database = require("./database.js");

module.exports.makePost = (postTitle, contentFile) => {
    database.get((connection) => {
        console.log("creating new post called '" + postTitle + "'...");
    connection.query("INSERT INTO posts (title, content) VALUES (\"" + postTitle + "\", \"" + contentFile + "\")", (error, result) => {
        if (error) {reject(); throw error;}
        console.log("post '" + postTitle + "' created!");
        });
    });
}

module.exports.deletePost = (postTitle) => {
    database.get((connection) => {
        console.log("deleting post '" + postTitle + "'...");
        connection.query("DELETE FROM posts WHERE title=\"" + postTitle + "\"", (error, result) => {
            if(error) {reject(); throw error;}
            console.log("post '" + postTitle + "' deleted from database!");
        });
    });
}

module.exports.getPosts = (callback) => {
    console.log("generating post listing for transfer...")
    var htmlPosts = {
        "posts": []
    };
    database.get((connection) => {
        connection.query("SELECT title, content FROM posts", (error, result) => {
            if (error) throw error;
            for (var i = 0; i < result.length; i++) {
                marked(result[i].content, (error, html) => {
                    console.log(html);
                    htmlPosts.posts.push({"title": result[i].title, "content": html})
                });
                if (i == result.length-1) finished();
            }
        });
    });
    function finished() {
        console.log("post listing generated and sent!");
        callback(htmlPosts);
    }
}