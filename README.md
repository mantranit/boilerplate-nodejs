
## Tech
* Express
* JWT
* MongoDB / mongoose
* Socket.io
* Mustache template for email
* RegEx for validation.

## Structure
* Connect to DB in __/models/index.js__
* Schema in each files __*.model.js__ -- e.g: user.model.js
* All API_URL will be define in __/api/index.js__
* An API always return http_status: __200__. We will custom the status inside response

## Setup
* Start MongoDB: mongod
* Install package: npm install
* Run dev: npm run dev
* http://localhost:4000

## Env
* example in server/env
