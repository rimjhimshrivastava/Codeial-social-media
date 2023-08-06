{
  //method to submit form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(), //converts the form data into json object
        success: function (res) {
          let newPost = newPostDom(res.data.post);
          $("#display-posts>ul").prepend(newPost);
          deletePost($(".delete-post-button", newPost));
          $(".like-now").each(toggleONE);
          $("#new-post-form")[0].reset();
        },
        error: function (err) {
          console.log(err.resposeText);
        },
      });
    });
  };

  //method to create a post in DOM
  let newPostDom = function (post) {
    return $(`
    <li class="list-posts" id="post-head-${post._id}" >

    <!-- header for the post -->
    <div class="post-head">
        <a href="/users/profile/${post.user.id}">
          <img src="${post.user.avatar}" alt="">
        </a>
        <a class="name" href="/users/profile/${post.user.id}"> ${post.user.name} </a>
        <div class="upload-date">Post uploaded just now</div>
        <a class = "delete-post-button" href="/posts/destroy/${post._id}"><i class="fa-solid fa-trash"></i></a>
    </div>


    <!-- content of the post -->
    <div id="post-${post._id}" class="post-container">
        <div class="post-content">
            ${post.content}
        </div>

        
        <!-- likes for post -->
        <div class="likes">
        <a class="like-now" href="likes/toggle/?id=${post._id}&type=Post">${post.likes.length} 
            <i class="fa-regular fa-thumbs-up"></i> Like
        </a>
        </div>
    </div>
    


    <!-- comments on post -->
    <div class="comments-container">
        <div class="comments-head">Comments section</div>

        <!-- list of comments -->
        <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
            </ul>
        </div>

        <!-- new comment can be created if user is logged in -->
        <div class="create-comment">
                <form action="/comments/create" method="POST">
                    <textarea type="text" name="content" cols="30" rows="1" placeholder="Comment on the post!"></textarea>
                    <input type="hidden" name="post" value="${post._id}">
                    <input class="button" type="submit" value="Add comment">
                </form>
        </div>
    </div>
    </li>
    `);
  };

  //method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (res) {
          $(`#post-head-${res.data.post_id}`).remove();
        },
        error: function (err) {
          console.log(err.resposeText);
        },
      });
    });
  };

  createPost();
}
