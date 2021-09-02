
## Tech
* Express
* JWT
* MongoDB / mongoose
* Socket.io
* Mustache template for email
* RegEx for validation.

## Flow
![Simple_API_Flow](https://github.com/mantranit/boilerplate-nodejs/blob/master/Simple_API.jpg)

## Structure
* Connect to DB in __/models/index.js__
* Schema in each files __*.model.js__ -- e.g: user.model.js
* All API_URL will be define in __/api/index.js__

## Setup
* Start MongoDB: mongod
* Install package: yarn
* Run dev: yarn dev
* http://localhost:4000

## Swagger
* Only available for NODE_ENV=dev
* http://localhost:4000/api-docs/

## Env
* example in ./env

## Generate
* Using __hygen__ library, you have to install hygen global -- e.g: npm i -g hygen
#### Generate Model only
* Generate __model__: hygen api model
* Declare an attribute: __name:type__ (default of type is __String__)
#### Generate API
* Generate __api__: hygen api bundle
* All options will be like model