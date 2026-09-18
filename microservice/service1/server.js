const express = require("express");
const { addNumbers } = require("./client");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the addition microservice: Service1!");
});

app.post("/add", (req, res) => {
  const { a, b } = req.body;

  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({
      error: "a and b must be numbers",
    });
  }

  const result = a + b;

  res.json({
    a,
    b,
    result,
  });
});

app.post("/service-calling", async (req, res) => {
  const { a, b } = req.body;

  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({
      error: "a and b must be numbers",
    });
  }

  const result = await addNumbers(a, b);
  console.log("Result from service-calling:", result);

  res.json({
    a,
    b,
    result,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// node server.js