require('rootpath')();
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const socket = require('_helpers/socket');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: '*' }));

const swaggerJSDoc = require('swagger-jsdoc');

// initialize swagger-jsdoc
const swaggerDefinition = require('./swagger.json');
const swaggerSpec = swaggerJSDoc(swaggerDefinition);
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static('public'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'web/views'));

// web routes
app.use(session({ resave: true ,secret: process.env.JWT_SECRET , saveUninitialized: true}));
app.use('/', require('./web/routes'));

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
