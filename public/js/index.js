$(".scrape").on("click", ()=>{
    console.log("Button clicked")
    $.ajax("/api/scrape", {
        type: "GET"
      }).then((articles) => {
        console.log(articles)
      });
});

