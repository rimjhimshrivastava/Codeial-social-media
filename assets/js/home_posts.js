{
    //method to submit form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),   //converts the form data into json object
                success: function(res){
                    let newPost = newPostDom(res.data.post);
                    $('#display-posts>dl').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                }, 
                error: function(err){
                    console.log(err.resposeText);
                }
            })
        });
    }

    //method to create a post in DOM
    let newPostDom = function(post){
        return $(`
        <dt id="post-head-${post._id}">
            <b>Post uploaded by ${post.user.name} on ${post.createdAt.getDate}-${ post.createdAt.getMonth+1 }-${post.createdAt.getFullYear}</b>
            <a class = "delete-post-button" href="/posts/destroy/${post._id}"><i class="fa-solid fa-trash"></i></a>
        </dt>
        <dd id="post-${post._id}">
            <p>
                ${post.content}
            </p>
            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">
                    
                </ul>
            </div>
            <div class="post-comments">
                <form action="/comments/create" method="POST">
                    <textarea type="text" name="content" cols="20" rows="1" placeholder="Comment on the post!"></textarea>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add comment">
                </form>
            </div>
        </dd>
        `)
    }

    //method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(res){
                    $(`#post-head-${res.data.post_id}`).remove();
                    $(`#post-${res.data.post_id}`).remove();
                },
                error: function(err){
                    console.log(err.resposeText);
                }
            })
        })
    }


    createPost();
}