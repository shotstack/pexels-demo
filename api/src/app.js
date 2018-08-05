require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const shotstack = require('./handler/shotstack/lib/shotstack');
const responseHandler = require('./shared/response');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '../../../web')));

app.post('/demo/shotstack', async (req, res) => {
    try {
        let render = await shotstack.submit(req.body);

        res.header("Access-Control-Allow-Origin", "*");
        res.status(201);
        res.send(responseHandler.getBody('success', 'OK', render));
    } catch (err) {
        res.header("Access-Control-Allow-Origin", "*");
        res.status(400);
        res.send(responseHandler.getBody('fail', 'Bad Request', err));
    }
});

app.get('/demo/shotstack/:renderId', async (req, res) => {
    try {
        let render = await shotstack.status(req.params.renderId);

        res.header("Access-Control-Allow-Origin", "*");
        res.status(200);
        res.send(responseHandler.getBody('success', 'OK', render));
    } catch (err) {
        res.header("Access-Control-Allow-Origin", "*");
        res.status(400);
        res.send(responseHandler.getBody('fail', 'Bad Request', err));
    }
});

app.listen(3000, () => console.log("Server running...\n\nOpen http://localhost:3000 in your browser\n"));
