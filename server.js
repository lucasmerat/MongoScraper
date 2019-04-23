const express = require("express");
var exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = 3000;
const app = express();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

//Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/MongoScraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Render home page
app.get("/", (req, res) => {
  res.render("home");
});

//Display articles on load

app.get("/articles", (req, res) => {
  db.Article.find({ saved: false })
    .sort({ createdAt: 1 })
    .then(dbArticles => {
      res.json(dbArticles);
    })
    .catch(err => {
      res.json(err);
    });
});

//Scrape NPR for latest music news

app.get("/api/scrape", (req, res) => {
  axios.get("https://www.npr.org/sections/allsongs/").then(response => {
    let $ = cheerio.load(response.data);
    $("div.item-info-wrap").each((i, element) => {
      let article = {
        title: $(element)
          .find($(".title"))
          .text(),
        link: $(element)
          .find($(".title"))
          .children()
          .attr("href"),
        teaser: $(element)
          .find($(".teaser"))
          .text()
      };
      db.Article.findOne({ title: article.title }).then(dbArticle => {
        if (!dbArticle) {
          db.Article.create(article)
            .then(dbArticle => {
              console.log("Creating article");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    });
    res.json("Done");
  });
});

//Save an article for later
app.put("/api/save", (req, res) => {
  db.Article.updateOne({ _id: req.body.id }, { $set: { saved: true , createdAt:new Date()} }).then(
    record => {
      res.json(record);
    }
  );
});

//Remove an article from saved
app.put("/api/delete", (req, res) => {
  db.Article.updateOne({ _id: req.body.id }, { $set: { saved: false } }).then(
    record => {
      res.json(record);
    }
  );
});

//Load saved articles
app.get("/saved", (req, res) => {
  db.Article.find({ saved: true })
    .sort({ createdAt: -1 })
    .then(results => {
      res.render("saved", { articles: results });
    });
});

//Load comments for and article
app.get("/api/comments/:id", (req, res) => {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    });
});

//Add comment to an article
app.post("/api/addcomment/:id", (req, res) => {
  db.Comment.create(req.body).then(dbComment => {
    return db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comment: dbComment._id } },
      { new: true }
    ).then(dbArticle => {
      res.json(dbComment);
    });
  });
});

//Delete a comment from an article
app.delete("/api/deletecomment/:id", (req, res) => {
  db.Comment.deleteOne({ _id: req.params.id }).then(result => {
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log("App running on port " + PORT + "!");
});
