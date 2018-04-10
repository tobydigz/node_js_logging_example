const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const addRequestId = require('express-request-id')();
const morgan = require('morgan');
const logger = require('./logger')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/health", function (req, res) {
    res.status(200).send();
});

app.use(addRequestId);

morgan.token('id', function getId(req) {
    return req.id
});

var loggerFormat = ':id [:date[web]] ":method :url" :status :response-time';

app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: process.stderr
}));

app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode >= 400
    },
    stream: process.stdout
}));

app.use((req, res, next) => {
    var log = logger.loggerInstance.child({
      id: req.id,
      body: req.body
    }, true)
    log.info({
      req: req
    })
    next();
  });

  app.use(function (req, res, next) {
    function afterResponse() {
        res.removeListener('finish', afterResponse);
        res.removeListener('close', afterResponse);
        var log = logger.loggerInstance.info({res:res}, 'tobi')
    }

    res.on('finish', afterResponse);
    res.on('close', afterResponse);
    next();
});



app.post("/stuff", function (req, res) {

    var response = {
        fullname: `${req.body.firstname} ${req.body.lastname}`
    }
    logger.logResponse(req.id, response, 200);
    res.status(200).send(response);
});

app.set('port', process.env.PORT || 8081);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});