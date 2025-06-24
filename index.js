import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
const port = 3000;
dotenv.config();

const app = express();
app.use(
    cors({
        origin: process.env.NODE_ENV === "production" ?
            [
                "https://code-sharing-delta.vercel.app",
                "https://code-sharing-main.vercel.app/",
            ] :
            "http://localhost:5173",
    })
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    const clientKey = req.headers["x-api-key"];
    if (clientKey !== process.env.FRONTEND_API_KEY) {
        return res.status(403).json({ message: "Access Denied" });
    }
    next();
});

const url = `mongodb+srv://${process.env.MONGODB_CREDENTIALS}@cluster0.f85qa.mongodb.net/codesharing?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
    .connect(url)
    .then(() => console.log("Connected to MongoDB Successfully"))
    .catch((err) => console.log(`Error connecting to MongoDB ${err}`));

const codeSchema = new mongoose.Schema({
    _id: String,
    fullCode: String,
});

const Code = mongoose.model("Code", codeSchema);

app.post("/api/snippets", async function(req, res) {
    try {
        const id = uuidv4();
        const code = new Code({
            _id: id,
            fullCode: req.body.code,
        });
        await code.save();
        res.status(201).json({ id: id, message: "Successfully Saved" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to save code snippet" });
    }
});

app
    .get("/api/snippets/:id", async function(req, res) {
        try {
            const snippets = await Code.findById(req.params.id);
            if (!snippets) {
                res.send("Wrong ID");
            }
            res.send(snippets.fullCode);
            console.log(snippets.fullCode);
        } catch (err) {
            console.error(`Error Loading snippet: ${err}`);
        }
    })

.put("/api/snippets/:id", async function(req, res) {
    try {
        const result = await Code.updateOne({ _id: req.params.id }, { fullCode: req.body.code });

        if (result.matchedCount === 0) {
            res.status(404).send("Snippet Not Found");
        }

        res.status(200).send("Successfully Updated");
    } catch (err) {
        console.error(`Error Updating snippet ${err}`);
    }
});

app.listen(process.env.PORT || port, function() {
    console.log("Server Started on Port 3000");
});