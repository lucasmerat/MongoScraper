const db = require("../models");

module.exports = function(app) {
  //Render home page
  app.get("/", (req, res) => {
    res.render("home");
  });

  //Display articles on load
  app.get("/articles", (req, res) => {
    db.Article.find({ saved: false })
      .sort({ createdAt: -1 })
      .then(dbArticles => {
        res.json(dbArticles);
      })
      .catch(err => {
        res.json(err);
      });
  });

  //Load saved articles
  app.get("/saved", (req, res) => {
    db.Article.find({ saved: true })
      .sort({ createdAt: -1 })
      .then(results => {
        res.render("saved", { articles: results });
      });
  });
};
