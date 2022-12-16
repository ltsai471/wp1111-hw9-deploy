// Router-level middleware
import { Router } from "express";
import ScoreCard from "../models/ScoreCard";
import db from '../db';

db.connect();

const deleteDB = async () => {
    try {
        await ScoreCard.deleteMany({});
        return "Database cleared";
    } catch (e) {
        return e;
    }
};

const saveScoreCard = async (name, subject, score) => {
    const oldScoreCard = await ScoreCard.findOne({ name, subject });
    try {
        if (oldScoreCard) {
            oldScoreCard.score = score;
            oldScoreCard.save();
            return { message: `Updating (${name}, ${subject}, ${score})`, card: oldScoreCard };
        } else {
            const newScoreCard = new ScoreCard({ name, subject, score });
            newScoreCard.save();
            return { message: `Adding (${name}, ${subject}, ${score})`, card: newScoreCard };
        }
    } catch (e) { throw new Error("Save scoreCard error: " + e); }
};

const findScoreCard = async (queryType, queryString, returnFormat) => {
    if (queryType == "") {
        const scoreCard = await ScoreCard.find();
        return scoreCard;
    }

    let queryParam = {};
    queryParam[queryType] = queryString;
    const scoreCard = await ScoreCard.find(queryParam);

    let messages;
    let message = "";
    try {
        if (scoreCard.length > 0) {
            messages = [];
            scoreCard.forEach(card => {
                if (returnFormat == 'str')
                    messages.push(`Found card with ${queryType}: (${card.name}, ${card.subject}, ${card.score})`)
                else
                    messages.push({'name':card.name, 'subject':card.subject, 'score':card.score})

            });
        } else {
            let firstUpperCaseQueryType = queryType.substring(0, 1).toUpperCase() + queryType.substring(1);
            message = `${firstUpperCaseQueryType} (${queryString}) not found!`;
        }
    } catch (e) { message = "Save scoreCard error: " + e; }
    return { messages, message };
};

const router = Router();
router.delete("/cards", async (_, res) => {
    res.json({ message: await deleteDB() })
});

router.post("/card", async (req, res) => {
    let name = req.body.name;
    let subject = req.body.subject;
    let score = req.body.score;

    let result = await saveScoreCard(name, subject, score);
    res.status(200).send(result);
});

router.get("/cards", async (req, res) => {
    const queryType = req.query.type;
    const queryString = req.query.queryString;
    console.log(queryType, queryString);

    let result = await findScoreCard(queryType, queryString, 'str');
    res.status(200).send(result);
});

router.get("/cardTable", async (req, res) => {
    const queryType = req.query.type;
    const queryString = req.query.queryString;
    console.log(queryType, queryString);

    let result = await findScoreCard(queryType, queryString, 'col');
    res.status(200).send(result);
});

export default router;