{let t=function(){let e=$("#new-post-form");e.submit(function(t){t.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:e.serialize(),success:function(t){t=s(t.data.post);$("#display-posts>dl").prepend(t),o($(" .delete-post-button",t))},error:function(t){console.log(t.resposeText)}})})},s=function(t){return $(`
        <dt id="post-head-${t._id}">
            <b>Post uploaded by ${t.user.name} on ${t.createdAt.getDate}-${t.createdAt.getMonth+1}-${t.createdAt.getFullYear}</b>
            <a class = "delete-post-button" href="/posts/destroy/${t._id}"><i class="fa-solid fa-trash"></i></a>
        </dt>
        <dd id="post-${t._id}">
            <p>
                ${t.content}
            </p>
        <div>
        <a class="likes" href="likes/toggle/?id=${t._id}&type=Post">${t.likes.length}  
            <% if(post.likes.find(obj => obj.user == locals.user.id)){ %>
                <i class="fa-solid fa-thumbs-up"></i>
            <% }else{ %>
                <i class="fa-regular fa-thumbs-up"></i>
            <% } %>
        </a>
        </div>
            <div class="post-comments-list">
                <ul id="post-comments-${t._id}">
                    
                </ul>
            </div>
            <div class="post-comments">
                <form action="/comments/create" method="POST">
                    <textarea type="text" name="content" cols="20" rows="1" placeholder="Comment on the post!"></textarea>
                    <input type="hidden" name="post" value="${t._id}">
                    <input type="submit" value="Add comment">
                </form>
            </div>
        </dd>
        `)},o=function(e){$(e).click(function(t){t.preventDefault(),$.ajax({type:"get",url:$(e).prop("href"),success:function(t){$("#post-head-"+t.data.post_id).remove(),$("#post-"+t.data.post_id).remove()},error:function(t){console.log(t.resposeText)}})})};t()}