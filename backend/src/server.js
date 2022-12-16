import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import path from "path";

const app = express();
// const port = process.env.PORT || 4000;

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.use('/', routes);

// app.listen(port, () =>
//     console.log(`Example app listening on port ${port}!`),
// );
if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    });
}

if (process.env.NODE_ENV === "development") {
    app.use(cors());
}