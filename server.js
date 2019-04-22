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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/api/scrape", (req, res) =>{
    axios.get("https://www.npr.org/sections/allsongs/").then((response)=>{
        let $ = cheerio.load(response.data);
        let articles = [];

        $("div.item-info-wrap").each((i, element) =>{

            let article = {
                title: $(element).find($('.title')).text(),
                link: $(element).find($('.title')).children().attr('href'),
                teaser: $(element).find($('.teaser')).text()
            }
            articles.push(article);
        });
        console.log(articles)
    });
});

app.listen(PORT, () => {
  console.log("App running on port " + PORT + "!");
});
