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
