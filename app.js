const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const addRequestId = require('express-request-id');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/health", function (req, res) {
    res.status(200).send();
});

app.use(addRequestId);

app.post("/stuff", function (req, res) {

    var response = {
        fullname: `${req.body.firstname} ${lastname}`
    }
    res.status(200).send(response);
});

app.set('port', process.env.PORT || 8081);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});