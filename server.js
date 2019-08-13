const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const logger = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// built in middleware
server.use(express.json());

// third party middleware
server.use(helmet());
server.use(logger('dev'));
// server.use(methodLogger);
server.use(addName);
// server.use(blockThirdSecond);

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

function methodLogger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
}

function addName(req, res, next) {
  req.name = "Cassandra";
  next();
}

function lockout(req, res, next) {
  res.status(403).json({ message: 'API lockout' });
}

function blockThirdSecond(req, res, next) {
  const sec = new Date().getSeconds();
  if(sec % 3 === 0) {
    res.status(403).json({ message: 'You shall not pass' });
  } else {
    next();
  }
}

server.use((error, req, res, next) => {
  res.status(error.code).json({ message: 'Bad Panda!', error: error.message });
});

module.exports = server;
