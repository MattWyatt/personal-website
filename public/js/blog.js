$.get("/getPosts", (data) => {
    data.posts.reverse().forEach((element) => {
        var div = document.createElement("div");
        div.className = "blog-post-section";
        div.id = element.title;
        document.getElementById("posts").appendChild(div).innerHTML = element.content;
    })
})