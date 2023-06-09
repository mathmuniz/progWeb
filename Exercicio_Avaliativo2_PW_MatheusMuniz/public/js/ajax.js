
var selectElement = $('#sl-opt');
var content = $("#content");

selectElement.change(function() {
    var selectedOption = $(this).val();

    if(selectedOption === "default"){
        content.empty();
        return
    }

    $.ajax({
        url: `https://jsonplaceholder.typicode.com/${selectedOption}`,
        type: "GET",
        beforeSend: function() {
            $("#load-page").css('display','block');
        },
        success: function(resultado) {
            $("#load-page").css('display','none');
            content.empty();

            if (selectedOption === 'posts') {
                build_posts(resultado)
            } else if (selectedOption === 'comments') {
                build_comments(resultado)
            } else if (selectedOption === 'photos') {
                build_photos(resultado)
            }
        }
    });
    
});


function build_posts(data){
    var posts = $(`<div class="container" id="posts"></div>`);
    data.forEach(element => {
        var card = `<div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${element.title}</h5>
                            <p class="card-text">${element.body}</p>
                        </div>
                    </div>`
        posts.append(card);
    });
    content.append(posts);
};

function build_comments(data){
    var comments = $(`<div class="container comments" id="comments"></div>`);
    data.forEach(element => {
        var card = `<div class="card">
                        <div class="card-body">
                            <h5 class="card-title d-flex align-items-center">
                                <div class="avatar border border-secondary-subtle p-1">
                                    <img src="public/img/generic_avatar.jpg" alt="avatar">
                                </div>
                                ${element.name}
                            </h5>
                            <p class="card-text">${element.body}</p>
                            <div class="list d-flex">
                                <div class="item">
                                    <img src="public/img/email_icon.png" alt="email">
                                    <a href="" onclick="event.preventDefault()">${element.email}</a>
                                </div>
                                <div class="item">
                                    <a href="" onclick="event.preventDefault()" title="like"><img src="public/img/like_icon.png" alt="like"></a>
                                    <span>0</span>
                                </div>
                                <div class="item">
                                    <a href="" onclick="event.preventDefault()" title="dislike"><img src="public/img/dislike_icon.png" alt="dislike"></a>
                                    <span>0</span>
                                </div>
                            </div>
                        </div>
                    </div>`
        comments.append(card);
    });
    content.append(comments);
};

function build_modal(title, url ){
    var modalContent = $("#modal-content");
    modalContent.empty();
    modalContent.append(`
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">${title}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-0">
            <img src="${url}" alt="600x600">
        </div>`
    )
}

function build_photos(data){
    var photos = $(`<div class="container photos row gallery" id="photos"></div>`);
    content.append(`
    <div id="modal-container">
        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" id="modal-content">
                </div>
            </div>
        </div>
    </div>`
    )

    data.forEach(element => {
        var card = `<!-- Card-->
                    <div class="card p-1 col-md-3 mb-4" style="width: 18rem;" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="build_modal('${element.title}', '${element.url}')">
                        <img src="${element.thumbnailUrl}" class="card-img-top" alt="150x150">
                    </div>`
        photos.append(card);
    }); 
    content.append(photos);
};