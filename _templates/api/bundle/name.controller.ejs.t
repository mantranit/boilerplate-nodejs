---
to: app/api/<%= h.inflection.pluralize(name) %>/<%= h.inflection.pluralize(name) %>.controller.js
unless_exists: false
---
const express = require('express');
const router = express.Router();
const <%= name %>Service = require('./<%= name %>.service');
const authorize = require('../../_helpers/authorize');
const respond = require("../respond");

//route
/**
* @swagger
* /<%= h.inflection.pluralize(name) %>/:
*   get:
*     tags:
*       - <%= h.inflection.capitalize(h.inflection.pluralize(name)) %>
*     description: Returns all <%= h.inflection.pluralize(name) %>
*     security:
*       - Bearer: []
*     responses:
*       200:
*         description: Successful
*/
router.get('/', authorize(), <%= name %>Service.getAll, respond);

/**
* @swagger
* /<%= h.inflection.pluralize(name) %>/search:
*   post:
*     tags:
*       - <%= h.inflection.capitalize(h.inflection.pluralize(name)) %>
*     description: Returns <%= h.inflection.pluralize(name) %> by filter
*     security:
*       - Bearer: []
*     parameters:
*       - in: formData
*         name: filter
*     responses:
*       200:
*         description: Successful
*/
router.post('/search', authorize(), <%= name %>Service.search, respond);

/**
* @swagger
* /<%= h.inflection.pluralize(name) %>/:
*   post:
*     tags:
*       - <%= h.inflection.capitalize(h.inflection.pluralize(name)) %>
*     description: Returns status true|false
*     security:
*       - Bearer: []
*     parameters: <% var tmpArray = model_attributes.split(','); for (i = 0; i < tmpArray.length; i++) { var tmp = tmpArray[i].trim().split(':'); %>
*       - in: formData
*         name: <%= tmp[0] && tmp[0].trim() ? h.changeCase.lcFirst(tmp[0].trim()) : 'sample' %> <% } %>
*     responses:
*       200:
*         description: Successful
*/
router.post('/', authorize(), <%= name %>Service.create, respond);

/**
* @swagger
* /<%= h.inflection.pluralize(name) %>/{id}:
*   get:
*     tags:
*       - <%= h.inflection.capitalize(h.inflection.pluralize(name)) %>
*     description: Returns a <%= name %>
*     security:
*       - Bearer: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*     responses:
*       200:
*         description: Successful
*/
router.get('/:id', authorize(), <%= name %>Service.getById, respond);

/**
* @swagger
* /<%= h.inflection.pluralize(name) %>/{id}:
*   put:
*     tags:
*       - <%= h.inflection.capitalize(h.inflection.pluralize(name)) %>
*     description: Update a <%= name %> and response that <%= name %>
*     security:
*       - Bearer: []
*     parameters:
*       - in: path
*         name: id
*         required: true <% var tmpArray = model_attributes.split(','); for (i = 0; i < tmpArray.length; i++) { var tmp = tmpArray[i].trim().split(':'); %>
*       - in: formData
*         name: <%= tmp[0] && tmp[0].trim() ? h.changeCase.lcFirst(tmp[0].trim()) : 'sample' %> <% } %>
*     responses:
*       200:
*         description: Successful
*/
router.put('/:id', authorize(), <%= name %>Service.update, respond);

/**
* @swagger
* /<%= h.inflection.pluralize(name) %>/{id}:
*   delete:
*     tags:
*       - <%= h.inflection.capitalize(h.inflection.pluralize(name)) %>
*     description: Delete a <%= name %> and then response a status true|false
*     security:
*       - Bearer: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*     responses:
*       200:
*         description: Successful
*/
router.delete('/:id', authorize(), <%= name %>Service.delete, respond);

module.exports = router;
