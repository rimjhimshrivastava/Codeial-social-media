{
    
    var toggleONE = function(){
        let likeable = $(this);
        //add click event listener
        likeable.click(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: likeable.prop('href'),
                success: function (res) {
                    if (res.data.deleted) {
                        likeable.html(`${res.data.num} <i class="fa-regular fa-thumbs-up"></i> Like`);
                    }
                    else {
                        likeable.html(`${res.data.num} <i class="fa-solid fa-thumbs-up"></i> Liked`);
                    }
                },
                error: function (err) {
                    console.log(err.resposeText);
                }
            })
        })
    }
    // execute function toggleONE on every object with class likes
    $('.like-now').each(toggleONE)
}