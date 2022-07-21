function getCookies(cookieName) {
    const cookieArr = document.cookie.split(";");
    const cookieRes = [];
    for (let i = 0; i < cookieArr.length; ++i) {
        const cookie = cookieArr[i].trimStart();
        if (cookie.startsWith(cookieName)) {
            const cookieValue = cookieArr[i].split("=")[1];
            cookieRes.push(decodeURIComponent(cookieValue));
        }
    }

    return cookieRes;
}

function setCookie(cookieName, cookieValue, cookieAgeDay) {
    document.cookie = cookieName + "=" + cookieValue + "; max-age=" + cookieAgeDay*24*60*60 + ";";
}

function addBlog() {
    const blogInput = document.getElementsByName("blog")[0];
    let blogData = blogInput.value;
    if (blogData === "")
        return;
    
    const encodedBlogData = encodeURIComponent(blogData);
    setCookie("blogWebTech" + Date.now(), encodedBlogData, 1);
    blogInput.value = "";
    const leftDocument = parent.frames[0].leftDocument;
    leftDocument.body.insertAdjacentHTML("afterbegin", "<p>" + blogData + "</p>");
}

function loadSavedBlog(document) {
    const blogs = getCookies("blogWebTech");
    for (let i = blogs.length - 1; i >= 0; --i) {
        document.writeln("<p>" + blogs[i] + "</p>");
    }
}