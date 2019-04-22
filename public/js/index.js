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
  let id = $(this).attr("data-id");
  $(".add-comment").attr("data-id", id);
  loadComments(id);
});

function loadComments(id) {
  $(".comment-section").empty();
  $.ajax("/api/comments/" + id, {
    type: "GET"
  }).then(articles => {
    if (articles.comment.length < 1) {
      $(".comment-section").append("<h5>No comments yet... add one!</h5");
    } else {
      articles.comment.forEach(comment => {
        let commentId = comment._id;
        let commentBody = comment.body;
        $(".comment-section").append(
          `<h5>${commentBody}</h5><button data-id='${commentId}' class='btn-small red delete-comment'>X</button>`
        );
      });
    }
  });
}

$(document).on("click", ".add-comment", function(e) {
  e.preventDefault();
  if ($(".comment-section").children().length === 1) {
    $(".comment-section").empty();
  }
  let id = $(this).attr("data-id");
  let comment = $(".comment-body")
    .val()
    .trim();
  $.ajax("/api/addcomment/" + id, {
    type: "POST",
    data: { body: comment }
  }).then(dbComment => {
    $(".comment-section").append(
      `<h5>${dbComment.body}</h5><button data-id='${
        dbComment._id
      }' class='btn-small red delete-comment'>X</button>`
    );
    $(".comment-body").val("");
  });
});

$(document).on("click", ".delete-comment", function() {
  let commentId = $(this).attr("data-id");
  $.ajax("/api/deletecomment/" + commentId, {
    type: "DELETE",
    data: { _id: commentId }
  }).then(result => {
    $(".comment-section").empty();
    loadComments($(".add-comment").attr("data-id"));
  });
});
