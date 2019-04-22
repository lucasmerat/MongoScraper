$.getJSON("/articles", data => {
  console.log(data);
  data.map(article => {
    $(".all-articles").append(
      `<div class='col s12'><a href='${article.link}'><h3 class='title'>${
        article.title
      }</h3></a><p class='teaser'>${
        article.teaser
      }</p><button class='btn-small save-article' data-id='${
        article._id
      }'>Save</button></div>`
    );
  });
});

$(".scrape").on("click", () => {
  $.ajax("/api/scrape", {
    type: "GET"
  }).then(articles => {
    console.log("Hello");
    location.reload();
  });
});

$(document).on("click", ".save-article", function() {
  $.ajax("/api/save", {
    type: "PUT",
    data: { id: $(this).attr("data-id") }
  })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
});

$(document).on("click", ".delete-save", function() {
  $.ajax("/api/delete", {
    type: "PUT",
    data: { id: $(this).attr("data-id") }
  })
    .then(result => {
      location.reload();
    })
    .catch(err => {
      console.log(err);
    });
});

$(document).on("click", ".article-comments", function() {
  $(".comment-section").empty();
  let id = $(this).attr("data-id");
  $(".add-comment").attr("data-id", id);
  $.ajax("/api/comments/" + id, {
    type: "GET"
  }).then(articles => {
    if(!articles.comment){
        $(".comment-section").append("<h5>No comments yet... add one!</h5")
    } else{
        let commentId = articles.comment._id;
        let commentBody = articles.comment.body;
        $(".comment-section").append(
          `<h5>${commentBody}</h5><button data-id='${commentId}' class='btn-small red'>X</button>`
        );
    } 
  });
});

$(document).on("click", ".add-comment", function(e) {
  e.preventDefault();
  let id = $(this).attr("data-id");
  let comment = $(".comment-body")
    .val()
    .trim();
  $.ajax("/api/addcomment/" + id, {
    type: "POST",
    data: { body: comment }
  }).then(dbArticle => {
    $(".comment-section").empty();
    $(".comment-section").append(
      `<h5>${dbArticle.comment.body}</h5><button data-id='${
        dbArticle.comment._id
      }' class='btn-small red'>X</button>`
    );
    $(".comment-body").val("");
    console.log(dbArticle);
  });
});
