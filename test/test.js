import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 4000;

app.get("/", async (req, res) => {
  try {
    res.send("Proxy server is running.");
    for (let i = 0; i < 1000000000; i++) {
      await axios.get(
        "http://localhost:3000/faculty/queue-proof-of-payment-review",
      );
      console.log(`let check the request count: ${i}`);
    }
  } catch (error) {
    console.log(`reach the maximum requestr number`);
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
