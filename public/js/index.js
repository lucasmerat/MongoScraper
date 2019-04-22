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

$(document).on("click", ".article-comments", function(){
    console.log("Clicked article comments. Will pop modal up")
});

$(document).on("click", ".delete-save", function(){
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


$(document).on("click", ".article-comments", function(){
    let id = $(this).attr('data-id');
    $.ajax("/api/comments/" + id, {
        type: "GET"
      }).then(articles => {
        console.log("Hello");
        console.log(articles)
      });
})