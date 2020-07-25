const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const file = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// On request send user's favourites

app.get("/get", (req, res) => {
  file.readFile("user_favourites.json", (err, data) => {
    const array = JSON.parse(data);
    if (err) res.send("Favourites not found");
    else
      res.send({
        array: array,
      });
  });
});

// On request save user's favourites to an array

app.post("/post", (req, res) => {
  file.readFile("user_favourites.json", (err, data) => {
    if (err) throw err;
    const newLog = req.body.favourite;
    const json = JSON.parse(data);
    json.push(newLog);
    file.writeFile("user_favourites.json", JSON.stringify(json), (err) => {
      if (err) throw err;
    });
  });
});

// On request delete user's favourites from array

app.delete("/delete", (req, res) => {
  file.readFile("user_favourites.json", (err, data) => {
    if (err) throw err;
    const array = req.body.favourite;
    file.writeFile("user_favourites.json", JSON.stringify(array), (err) => {
      if (err) throw err;
    });
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
