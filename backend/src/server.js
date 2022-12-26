import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import path from "path";
import { IpFilter } from "express-ipfilter";

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// if (process.env.NODE_ENV === "development") {
//     app.use(cors());
// }
app.use('/api', routes);


if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    });

    app.use(IpFilter(["140.112.0.0/16"], {
        mode: "allow",
        detectIp: req => req.connection.remoteAddress?.replace("::ffff:", "") ?? ""
    }));
}

const port = process.env.PORT || 4000;
app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
);