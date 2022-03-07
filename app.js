//create an http server
const express = require('express');
const app = express();

const parser = require('body-parser');

const cors = require('cors');

var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database("./books.sqlite", (err) => {
  if (err) {
    console.log('Error when creating the database', err)
  } else {
    console.log('Database created!')
    /* Put code to create table(s) here */
    createTable()
  }
})

const createTable = () => {
  console.log("create database table books");
  db.run("CREATE TABLE IF NOT EXISTS books(id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT,title TEXT,genre TEXT,price DOUBLE)");
}

app.use(cors());
app.use(parser.json());

app.use(express.static('views'));

app.get('/',function (req,res) {
  console.log(__dirname);
  res.sendFile("./views/ergasia.html", {root: __dirname});
});

/*endpoint that will search in the database if there is a title
related to the user's input and will return in json format the series that found*/
app.get('/searchBooks/:title', async(req,res)=> {

  const query = `SELECT * FROM books WHERE title LIKE '%${req.params.title}%'`;

  try{
    const rows = await queryFunction(query);
    res.send(JSON.stringify(rows));
  }catch(err){
    var text ='[{ "id":-1 , "error":"Something Went Wrong With the DataBase" }]';
    res.send(JSON.parse(text));
  }

});

/*endpoint that returns all the rows from the table from database*/
app.get('/searchBooks/', async(req,res)=> {

  const query = 'SELECT * FROM books';

  try{
    const rows = await queryFunction(query);
    res.send(JSON.stringify(rows));
  }catch(err){
    var text ='[{ "id":-1 , "error":"Something Went Wrong With the DataBase" }]';
    res.send(JSON.parse(text));
  }

});

/*endpoint to add-insert a book into the database(into the req exists the inputs of the user that sended from script in html in json format)*/
app.post('/addBook', (req,res)=>{
  const book = req.body;
  const query = `insert into books ("author","title","genre","price") values ('${book.author}' , '${book.title}' , '${book.genre}' , '${book.price}' )`;
  //handling the errors and print to user the correct message
  db.run(query,(err)=>{
    if(err){
      res.send('Error executing insert query');
    } else {
      res.send('Successful add a new book');
    }
  });
});

//a function to achieve async-await
function queryFunction(q){

  //use promise -> syntactic sugar to return
  return new Promise((resolve,reject)=>{

    db.all(q,(err,rows)=>{
      if(err){

        reject(err);
        return;
      }
      resolve(rows);
    });
  });

}

//the port that app listens
app.listen(8080);

//a message to see that everything went well
console.log('hello');
