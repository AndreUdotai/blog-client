

// When the index page is loaded (When website loads),
// Fetch all the posts from blog-api to be displayed on the index page
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
        // Reference the post list element - this is will the parenet element for the posts
        let postList = document.getElementById('post-list');
        // Loop over the posts in the posts array
        for (let post of posts) {
            // Create a new div element for a post element
            let postElement = document.createElement('div');

            // Set the posts-display html below as the inner element of
            // the newly created div element
            let postListComponent = `<div class='post-preview'>
                                        <a href='#'id='post-title'>
                                            <h2 class='post-title' data-id='${post._id}' >
                                                ${post.title}
                                            </h2>
                                        </a>
                                        <p class='post-meta'>
                                            Posted by
                                            <a href='about.html'>Admin</a>
                                            <span>${dayjs(post.timestamp)}</span>
                                        </p>
                                    </div>
                                    <hr class="my-4" />`;
            postElement.innerHTML = postListComponent;

            // Append the posts component on the postList element
            postList.appendChild(postElement);
        }
    });


// Fetch post function for retrieving a particular post when the
// id is supplied
let fetchPost = (id) => {
    // Use the extracted id saved in postId to fetch the full detail of
    // the post from the database
    fetch('http://localhost:3000/api/blog/post/' + id)
        .then((response) => response.json())
        .then((data) => {
            // Insert returned data as inner contents of the created variables
            postTitle.innerText = data.post.title;
            postContent.innerText = data.post.post;
            postDate.innerText = dayjs(data.post.timestamp);

            // Clear the comments node
            comments.innerHTML = '';
            let commentsContainer = document.createElement('div');
            // Declare a variable for comment count component
            let commentCount;
            if (data.comments.length === 0) {
                commentCount = 'No Comments';
            } else if (data.comments.length === 1) {
                commentCount = `<div>${data.comments.length} Comment</div>`;
            } else {
                commentCount = `<div>${data.comments.length} Comments</div>`;
            }
            // Set the comment count component as the first child of the commentsContainer element
            commentsContainer.innerHTML = commentCount;

            // Reverse the order of the data.comments array to make the latest comment appear first
            data.comments.reverse();

            // Loop over the comments in the comments array from the blog-api
            for (let comment of data.comments) {
                // Create a new div element for a comment element
                let commentElement = document.createElement('div');

                // Set the comments-display html below as the inner element of
                // the newly created div element
                let commentComponent = `<div class="card p-3 mt-2">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div class="user d-flex flex-row align-items-center">
                                                    <img src="https://i.imgur.com/CFpa3nK.jpg" alt="" class="rounded-circle" width="40"
                                                        height="40">
                                                    <span><small class="font-weight-bold text-primary">@${comment.username}</small>
                                                        <small class="font-weight-bold">${comment.comment}</small></span>
                                                </div>
                                                <small>${dayjs(comment.timestamp)}</small>
                                            </div>
                                        </div>`;

                commentElement.innerHTML = commentComponent;
                // dayjs(post.timeStamp).toNow(true)
                // Append commentElement to the commentsContainer element
                commentsContainer.appendChild(commentElement);
            }
            // Append commentsContainer to the comments element
            comments.appendChild(commentsContainer);
        });
};

// Create variables for the title, post and date elements
let postTitle = document.getElementById('post_title');
let postContent = document.getElementById('post_content');
let postDate = document.getElementById('post_date');
let comments = document.getElementById('comments');

// Set a click event listener on the title of posts to extract the
// id of the post and save in the postId variable
let postList    = document.getElementById('post-list');
postList.addEventListener('click', (e) => {
    // Checks if the post title is clicked
    if (e.target.hasAttribute('data-id')) {
        let indexPage   = document.getElementById('index-page');
        indexPage.setAttribute("class", "hide");
        let postPage    = document.getElementById('post-detail-page');
        postPage.removeAttribute("class");

        // Extract the post id from the post dataset
        let postId = e.target.dataset.id;
        // Set the postId value as the dataset value of the comment post button
        let postButton  = document.getElementById('post_button');
        postButton.dataset.id = `${postId}`;

        // Call the fetch post function for the clicked post
        fetchPost(postId);
    }
});

// Select the error message divs from the comment form
let emailError = document.getElementById('emailErrorMessage');
let commentError = document.getElementById('commentErrorMessage');
let usernameError = document.getElementById('usernameErrorMessage');

// When User clicks on the comment post button to leave a comment
let postButton  = document.getElementById('post_button');
postButton.addEventListener('click', () => {
    // Set the value of the displayed post id to the variable postId
    let postId = postButton.dataset.id;

    // Set the error displays on comment form if any to empty
    emailError.innerText = '';
    commentError.innerText = '';
    usernameError.innerText = '';

    // THe fetch function with all the headers
    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data),
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    // Initializing a comment object from entered data by the user
    let commentData = {
        username: username.value,
        email: email.value,
        comment: comment.value,
        post: postId,
    };

    // Clear comment form after submission
    username.value = '';
    email.value = '';
    comment.value = '';

    postData(
        'http://localhost:3000/api/blog/post/' + postId + '/comment/create',
        commentData,
    ).then((data) => {
        if (data.errors) {
            username.value = `${data.comment.username}`;
            email.value = `${data.comment.email}`;
            comment.value = `${data.comment.comment}`;

            for (let error of data.errors.errors) {
                if (error.param == 'email') {
                    emailError.innerText = error.msg;
                } else if (error.param == 'comment') {
                    commentError.innerText = error.msg;
                } else if (error.param == 'username') {
                    usernameError.innerText = error.msg;
                }
            }
        } else {
            // Call the fetch post function to display the latest comment
            fetchPost(postId);
        }
    });
});
