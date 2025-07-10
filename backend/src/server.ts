import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import "./container/inversify.config";
import pool from "./config/db";
import path from "path";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", //permite requisições somente desse domínio
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//app.use("/uploads", express.static(path.resolve("uploads")));

const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/test-db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({
      message: "Conexão com o banco de dados bem-sucedida",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    res.status(500).json({ message: "Erro na conexão com o banco de dados" });
  }
});
