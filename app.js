const express = require("express");
const app = express();
app.use(express.static("public"));
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", 'ejs')

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true })

const newSchema = {
    author: String,
    quote: String
}

const Article = mongoose.model("Article", newSchema);

app.get("/articles", function(req, res) {
    Article.find(function(err, foundArticles) {
        res.send(foundArticles)
    })
})

app.post('/articles', function(req, res) {


    const newArticle = new Article({
        author: req.body.title,
        quote: req.body.content
    })
    newArticle.save();
    res.send("successfully added")

})


app.delete("/articles", function(req, res) {
    Article.deleteMany(function(err) {
        if (!err) {
            console.log("successfully deleted everything");
        } else {
            console.log(err);
        }
    })
})

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({ author: req.params.articleTitle }, function(err, foundArticle) {
        if (foundArticle) {
            res.send(foundArticle)
        } else {
            res.send("no matching articles")
        }
    })
}).put(function(req, res) {
    Article.updateOne({ author: req.params.articleTitle }, { author: req.body.tit, quote: req.body.con },
        function(err) {
            if (!err) {
                res.send("successfully added");
            } else {
                res.send(err);
            }
        }

    )
}).patch(function(req, res) {
    Article.updateOne({ author: req.params.articleTitle }, { $set: req.body }, { overwrite: true }, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send("successfully added");
        }
    })
})


app.get("/", function(req, res) {
    res.render("index", {})
})


app.listen("3000", function() {
    console.log("listening on port 3000");
})