import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';


const app = express();
const port = 3000;
const currentDate = new Date().toDateString();

var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));	
app.use(methodOverride('_method'));

// load .env environment
dotenv.config();

// Connect to mongodDB using async function
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}

// calling the mongoDB asunc function
connectDB();

// creating model for mongoDB
const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// define the model as Post
const Post = mongoose.model('Post', PostSchema);

// Get route, passing title and date
app.get("/", async (req, res) => {
  try {
    const data = await Post.find();
    res.render("home.ejs", {data: data});
  } catch(error) {
    console.log(error);
  }
});

// Get /post, passing _id
app.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug});
    res.render("post.ejs", {data: data});
  } catch(error) {
    console.log(error);
  }
});

// Post /search, search keywords
app.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });
    res.render("search.ejs", {data: data});
  } catch(error) {
    console.log(error);
  }
});

// get composer
app.get("/composer", (req, res) => {
  res.render("composer.ejs");
});

// post composer
app.post("/composer", async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body['blogTitleInput'],
      body: req.body['blogBodyInput']
    })
    await Post.create(newPost);
    res.redirect("/");
  } catch(error) {
    console.log(error);
  }
});

// get an edit route
app.get("/postedit/:id", async (req, res) => {
  try{
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug});
    res.render("postedit.ejs", {data: data});
  } catch(error) {
    console.log(error);
  }
});

// Put edit route
app.put("/postedit/:id", async (req, res) => {
  try{
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });
    res.redirect('/');
  } catch(error) {
    console.log(error);
  }
});

// Delete post
app.delete("/postdelete/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    await Post.deleteOne({ _id: slug});
    res.redirect('/');
  } catch(error) {

  }
});

// Need to allow for edit 
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

// Need to allow for edit 
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.listen(port, () => {
      console.log(`Listening on port ${port}`);
});


// function to insert data to MongoDB, random blog from online
// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }

// insertPostData();