if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const router = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('<h1>Halo gaiss welkombek!</h1>')
})

app.use("/api/v1", router);

app.listen(PORT, () => console.log("Server running on port", PORT));
