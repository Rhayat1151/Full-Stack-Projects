// Import required modules
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
//Create an instance of the Express app
const app = express();
const port = 3000;
//Configure Express to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//Create a PostgreSQL client instance
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Books notes",
  password: "m1.r2.h3.",
  port: 5432,
});
db.connect();




app.get('/',async (req, res) => {

  try {
    const result = await db.query("select * from books");
    const bookdetail = result.rows;
    res.render("index.ejs", {
      book: bookdetail,
    });    
  } catch (err) {
    console.log(err);
  }

});

app.get('/books/add', (req, res) => {
  res.render('newbook.ejs');
});



app.post('/books/add', async (req, res) => {
  const  title   = req.body.title;
  const  rating = req.body.rating;
  const  recency = req.body.recency;
  const  notes = req.body.notes;
  try {

    await db.query("insert into books (title, notes, rating, recency) values ($1,$2,$3,$4)", [title, notes, rating, recency]);
    res.redirect("/");    
  } catch (err) {
    console.log(err);
  }
});



app.get('/sort/:criteria',async (req, res) => {
  const criteria = req.params.criteria;
  
  // Fetch books from the database
  const result = await db.query("select * from books");
  const bookdetail = result.rows;
  
  // Sort books based on criteria
  if (criteria === 'rating') {
    bookdetail.sort((a, b) => b.rating - a.rating);
  } else if (criteria === 'recency') {
    bookdetail.sort((a, b) => new Date(b.recency) - new Date(a.recency));
  } else if (criteria === 'title') {
    bookdetail.sort((a, b) => a.title.localeCompare(b.title));
  }

  res.render("index.ejs", {
    book: bookdetail,
  });   

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


  