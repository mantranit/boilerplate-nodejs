require('rootpath')();
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const socket = require('_helpers/socket');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));
app.use(session({secret: process.env.JWT_SECRET, saveUninitialized: false, resave: false}));

const swaggerJSDoc = require('swagger-jsdoc');

// initialize swagger-jsdoc
const swaggerDefinition = (process.env.NODE_ENV === 'dev') ? require('./swagger.json') : require('./swagger.heroku.json');
const swaggerSpec = swaggerJSDoc(swaggerDefinition);
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static('public'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'web/views'));

// web routes
app.use('/', require('./web/routes'));

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/api', require('./api'));

// global error handler
app.use(errorHandler);

// start server
const port = (process.env.NODE_ENV === 'dev') ? 4000 : (process.env.PORT || 80);
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

// call socket.io
app.io = socket(server, { origins: '*:*' });
