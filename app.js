import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));	

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/composer", (req, res) => {
  res.render("composer.ejs");
});

app.get("/post", (req, res) => {
  res.render("post.ejs");
});

app.post("/submit", (req, res) => {
  const blogTitleUser = req.body.blogTitleInput;
  const blogBodyUser = req.body.blogBodyInput;

  // Render composer.ejs and pass data
  res.render("composer.ejs", {
    blogTitle: blogTitleUser,
    blogBody: blogBodyUser
  });
});

// Define another route for rendering home.ejs
app.post("/submit", (req, res) => {
  const blogTitleUser = req.body.blogTitleInput;
  const blogBodyUser = req.body.blogBodyInput;

  // Render composer.ejs and pass data
  res.render("composer.ejs", {
    blogTitle: blogTitleUser,
    blogBody: blogBodyUser
  });
});

app.listen(port, () => {
      console.log(`Listening on port ${port}`);
});
