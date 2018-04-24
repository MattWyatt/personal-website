const marked = require("marked");
const database = require("./database.js");

module.exports.makePost = (postTitle, description, contentFile) => {
    database.get((connection) => {
        console.log("creating new post called '" + postTitle + "'...");
    connection.query("INSERT INTO posts (title, description, content) VALUES (\"" + postTitle + "\", \"" + description + "\", \"" + contentFile + "\")", (error, result) => {
        if (error) {reject(); throw error;}
        console.log("post '" + postTitle + "' created!");
        });
    });
}

module.exports.deletePost = (postTitle) => {
    database.get((connection) => {
        console.log("deleting post '" + postTitle + "'...");
        connection.query("DELETE FROM posts WHERE title=\"" + postTitle + "\"", (error, result) => {
            if (error) {throw error;}
            console.log("post '" + postTitle + "' deleted from database!");
        });
    });
};

module.exports.getPostByName = (postTitle, callback) => {
    database.get((connection) => {
        connection.query("SELECT * FROM posts WHERE title=\"" + postTitle + "\"", (error, result) => {
            if (error) {throw error;}
            let post = result[0];
            marked(post.content, (error, html) => {
                post.html = html;
            });
            callback(post)
        });
    });
};

module.exports.getPosts = (callback) => {
    console.log("generating post listing for transfer...");
    let htmlPosts = {
        "posts": []
    };
    database.get((connection) => {
        connection.query("SELECT title, description, content FROM posts", (error, result) => {
            if (error) throw error;
            for (var i = 0; i < result.length; i++) {
                marked(result[i].content, (error, html) => {
                    console.log(html);
                    htmlPosts.posts.push({"title": result[i].title, "content": html, "shortText": result[i].description});
                });
                if (i == result.length-1) finished();
            }
        });
    });
    function finished() {
        console.log("post listing generated and sent!");
        callback(htmlPosts);
    }
};