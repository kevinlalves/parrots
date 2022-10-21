import express from "express";
const app = express();
const port = 8000;

app.disable("x-powered-by");
app.use(express.static("."));

app.get("/", (req, res) => {
  res.send("index");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
