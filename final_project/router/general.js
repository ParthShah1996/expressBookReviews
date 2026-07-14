const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Username & Password are required"})
  }

  if (isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
})
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  res.send(books[isbn]);
//   return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author
  const bookKeys = Object.keys(books);
  const filteredBooks = [];
  bookKeys.forEach(key => {
    if (books[key].author == author) {
        filteredBooks.push(books[key]);
    }
  });
  res.send(filteredBooks)
  //   return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title
  const bookKeys = Object.keys(books);
  const filteredBooks = [];
  bookKeys.forEach(key => {
    if (books[key].title == title) {
        filteredBooks.push(books[key]);
    }
  });
  res.send(filteredBooks)
//   return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  res.send(books[isbn].reviews)
//   return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get("/async/books", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/");
        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

public_users.get("/async/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(
            `http://localhost:5000/isbn/${isbn}`
        );
        return res.json(response.data);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });

    }
});

public_users.get("/async/author/:author", async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${author}`
        );
        return res.json(response.data);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

public_users.get("/async/title/:title", async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${title}`
        );
        return res.json(response.data);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});


module.exports.general = public_users;
