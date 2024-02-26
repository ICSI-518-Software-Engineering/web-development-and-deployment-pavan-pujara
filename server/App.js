// Import necessary modules
const express = require('express');
const cors = require("cors");
const path = require("path");


// Create Express app
const app = express();
const port = 3000; // Choose any port you prefer

app.use(cors());
app.use(express.static(path.join(__dirname,"build")));

// Define a route for the addition API
app.get('/Addition', (req, res) => {
  // Get query parameters from URL (assuming num1 and num2 are passed)
  const num1 = parseInt(req.query.num1);
  const num2 = parseInt(req.query.num2);

  // Check if num1 and num2 are not NaN
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Both num1 and num2 must be valid numbers" });
  }

  // Perform addition
  const result = num1 + num2;

  // Send response with result
  res.json({ result });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
