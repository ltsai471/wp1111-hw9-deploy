import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from "path";
import { IpFilter } from "express-ipfilter";

app.use(IpFilter(["140.112.0.0/16"], {
  mode: "allow",
  detectIp: req => req.connection.remoteAddress?.replace("::ffff:", "") ?? ""
}));

const app = express();
if (process.env.NODE_ENV === "development") {
    app.use(cors());
}

app.use('/api', routes);


if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    });
}

const port = process.env.PORT || 4000;
app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
);