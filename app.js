import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;
const currentDate = new Date().toDateString();
const aboutMe = "I make a good blog post everyday, so make you you read all my posts and make me feel good"
const contactMe = "Contact me at 3939393939393939 for a discussion about reading blog and how to write one"

var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));	

// routing
app.get("/", (req, res) => {
  const blogData = loadExistingData();

  res.render("home.ejs", {blogData: blogData});
});

app.get("/about", (req, res) => {
  res.render("about.ejs", {about: aboutMe});
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs", {contact: contactMe});
});

app.get("/post", (req, res) => {
  res.render("post.ejs");
});

app.get("/composer", (req, res) => {
  const blogData = loadExistingData();

  res.render("composer.ejs", {blogData: blogData});
});

// function to save file to JSON file
function saveDataToFile(blogData) {
  const jsonData = JSON.stringify(blogData);
  fs.writeFile('blogData.json', jsonData, (err) => {
    if (err) {
      console.error('Error saving data to file:', err);
    } else {
      console.log('Data saved to file');
    }
  });
}

// function to load existing data, inorder to transfer data and not replace
function loadExistingData() {
  try {
    const data = fs.readFileSync('blogData.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from file:', error);
    return [];
  }
}

// logic read file first then save to json
app.post("/submit", (req, res) => {
  const blogTitleUser = req.body.blogTitleInput;
  const blogBodyUser = req.body.blogBodyInput;

  const data = {
    blogTitle: blogTitleUser,
    blogBody: blogBodyUser,
    today: currentDate
  };

  let blogData = loadExistingData();

  blogData.push(data);

  saveDataToFile(blogData);

  res.render("/", data);
});

app.listen(port, () => {
      console.log(`Listening on port ${port}`);
});
