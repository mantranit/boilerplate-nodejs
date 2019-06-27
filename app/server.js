require('rootpath')();
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const socket = require('_helpers/socket');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

const swaggerJSDoc = require('swagger-jsdoc');

// initialize swagger-jsdoc
const swaggerDefinition = (process.env.NODE_ENV === 'production') ? require('./swagger.heroku.json') : require('./swagger.json');
const swaggerSpec = swaggerJSDoc(swaggerDefinition);
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/api', require('./api'));

// global error handler
app.use(errorHandler);

// start server
const port = (process.env.NODE_ENV === 'production') ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

// call socket.io
app.io = socket(server, { origins: '*:*' });
