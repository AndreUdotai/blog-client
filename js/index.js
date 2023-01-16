let postList = document.getElementById('post-list');

// Fetch all the posts from blog-api
fetch('http://localhost:3000/api/blog/posts')
    .then((response) => response.json())
    .then((data) => {
        // Inititialize an empty array
        let posts = [];
        // Loop over the posts json data returned from blog-api
        for (let element of data) {
            // Push all the posts returned from blog-api in posts array
            posts.push(element);
        }
        // Reverse the order of the posts in the array to make the latest
        // post appears first
        posts.reverse();
        // Loop over the posts in the posts array
        for (let post of posts) {
            // Create a new div element
            let postElement = document.createElement('div');
            // Set the posts-display html below as the inner element of
            // the newly created div element

            let postListComponent = `
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
            postElement.innerHTML = postListComponent;
            // Append the posts component on the postList element
            postList.appendChild(postElement);
        }
    });

// Set a click event listener on the title of posts to extract the
// id of the post and save in the postId variable
postList.addEventListener('click', (e) => {
    let postId = e.target.dataset.id;

    // Use the extracted id saved in postId to fetch the full detail of 
    // the post from the database
    fetch('http://localhost:3000/api/blog/post/' + postId)
        .then((response) => response.json())
        .then((data) => console.log(data));
});
