function generatePostPage(postName) {
    let data = {"name": postName};
    console.log("running generatePostPage()!");
    $.post("/getPostByName", data, (postData) => {
        $("#postContent").html(postData.html);
    });
}


$.get("/getPosts", (data) => {
    data.posts.reverse().forEach((element) => {
        let url = "https://google.com";
        let shortDescription = element.content.slice(0, 100);

        let column = document.createElement("div");
        column.className = "pure-u-1-2 pure-u-md-1-3";
        column.id = element.title;
        let card = document.createElement("div");
        card.className = "card";
        document.getElementById("posts").appendChild(column);
        document.getElementById(element.title).appendChild(card);

        let header = document.createElement("h2");
        let button = document.createElement("button");
        button.appendChild(document.createTextNode(element.title));
        button.onclick = () => {generatePostPage(element.title)};
        header.appendChild(button);
        let description = document.createElement("p");
        description.appendChild(document.createTextNode(element.shortText));
        card.appendChild(header);
        card.appendChild(description);
    });
});