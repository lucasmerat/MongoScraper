$.getJSON("/articles", (data) =>{
    console.log(data)
    data.map(article => {
        $(".row").append(
          `<div class='col s12'><a href='${article.link}'><h3 class='title'>${article.title}</h3></a><p class='teaser'>${article.teaser}</p></div>`
        );
      });
  });

$(".scrape").on("click", () => {
  $.ajax("/api/scrape", {
    type: "GET"
  }).then(articles => {
      console.log("Hello")
      location.reload();
  });
});
