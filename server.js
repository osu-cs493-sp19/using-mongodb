const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./lib/logger');
const { connectToDB } = require('./lib/mongo');

const app = express();
const port = process.env.PORT || 8000;

const { validateAgainstSchema } = require('./lib/validation');
const { LodgingSchema, getLodgingsPage, insertNewLodging } = require('./models/lodging');
const lodgings = require('./lodgings');

app.use(bodyParser.json());

app.use(logger);

app.get('/lodgings', async (req, res) => {
  try {
    const lodgingsPage = await getLodgingsPage(parseInt(req.query.page) || 1);
    res.status(200).send(lodgingsPage);
  } catch (err) {
    res.status(500).send({
      error: "Error fetching lodgings.  Try again later."
    });
  }
});

app.post('/lodgings', async (req, res) => {
  if (validateAgainstSchema(req.body, LodgingSchema)) {
    try {
      const id = await insertNewLodging(req.body);
      res.status(201).send({
        id: id
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Failed to insert lodging.  Try again later."
      });
    }
  } else {
    res.status(400).send({
      err: "Request body does not contain a valid Lodging."
    });
  }
});

/*****************************************************************************
 ** Note that the API endpoints below have not been modified to use MongoDB.
 ** They only use in-memory/JSON data.  See the course notes for this topic
 ** for more about how to convert these endpoints to use MongoDB.
 *****************************************************************************/

app.get('/lodgings/:id', (req, res, next) => {
  const id = req.params.id;
  if (lodgings[id]) {
    res.status(200).send(lodgings[id]);
  } else {
    next();
  }
});

app.put('/lodgings/:id', (req, res, next) => {
  const id = req.params.id;
  if (lodgings[id]) {
    if (validateAgainstSchema(req.body, LodgingSchema)) {
      lodgings[id] = req.body;
      res.status(204).send();
    } else {
      res.status(400).send({
        err: "Request body does not contain a valid Lodging."
      });
    }
  } else {
    next();
  }
});

app.delete('/lodgings/:id', (req, res, next) => {
  const id = req.params.id;
  if (lodgings[id]) {
    lodgings[id] = null;
    res.status(204).send();
  } else {
    next();
  }
});

app.use('*', (req, res, next) => {
  res.status(404).send({
    err: "The path " + req.originalUrl + " doesn't exist"
  });
});

connectToDB(() => {
  app.listen(port, () => {
    console.log("== Server is listening on port:", port);
  });
});
