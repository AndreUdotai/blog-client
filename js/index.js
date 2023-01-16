// let postTitle = document.getElementById('post-title');
let postList = document.getElementById('post-list');

fetch('http://localhost:3000/api/blog/posts')
    .then((response) => response.json())
    .then((data) => {
        let posts = [];
        for (let element of data) {
            posts.push(element);
        }
        posts.reverse();
        for (let post of posts) {
            let postElement = document.createElement('div');
            postElement.innerHTML = `
            <div class='post-preview'>
                <a href='#'id='post-title'>
                    <h2 class='post-title' data-id='${post._id}' >
                        ${post.title}
                    </h2>
                </a>
                <p class='post-meta'>
                    Posted by
                    <a href='#!'>Admin</a>
                    <span>${post.timestamp}</span>
                </p>
            </div>
            <hr class="my-4" />
            `;
            postList.appendChild(postElement);
        }
    });

postList.addEventListener('click', (e) => {
    console.log(e.target.dataset.id)
    postId = e.target.dataset.id;

    fetch('http://localhost:3000/api/blog/post/' + postId)
        .then((response) => response.json())
        .then((data) => console.log(data));
});
