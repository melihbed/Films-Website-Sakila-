const express = require("express");
const cors = require("cors");
const pool = require("./db/db");

const port = 3000;

const app = express();

// Middleware START
app.use(cors());
app.use(express.json());
// Middleware END

// Routes START

// Create GET routes for the Top 5
app.get("/api/films/top-rented", async (req, res) => {
  try {
    const query = `
    SELECT
        f.film_id,
        f.title,
        c.name AS category,
        COUNT(DISTINCT r.rental_id) AS rental_count
    FROM film f
    JOIN inventory i 
        ON i.film_id = f.film_id
    JOIN rental r 
        ON r.inventory_id = i.inventory_id
    JOIN film_category fc 
        ON fc.film_id = f.film_id
    JOIN category c 
        ON c.category_id = fc.category_id
    GROUP BY
        f.film_id,
        f.title,
        c.name
    ORDER BY
        rental_count DESC
    LIMIT 5;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

// Routes END

// This should be at the very bottom of your app.js, after all other routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found. Check your URL in Postman!",
  });
});

app.listen(port, () => {
  console.log("Server listening on port:" + port);
});
