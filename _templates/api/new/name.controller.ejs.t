---
to: app/api/<%= h.inflection.pluralize(name) %>/<%= h.inflection.pluralize(name) %>.controller.js
unless_exists: true
---
const express = require('express');
const router = express.Router();
const <%= name %>Service = require('./<%= name %>.service');
const authorize = require('../../_helpers/authorize');
const { getUserRole } = require('../../_helpers/utils');

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
*         description: It always return status code 200 and the end <%= name %> must be check status inside the response
*/
router.get('/', authorize(), (req, res, next) => {
  <%= name %>Service.getAll()
    .then(<%= h.inflection.pluralize(name) %> => res.json({
      status: 200,
      data: <%= h.inflection.pluralize(name) %>
    }))
    .catch(err => next(err));
});

/**
* @swagger
* /<%= h.inflection.pluralize(name) %>/:
*   post:
*     tags:
*       - <%= h.inflection.capitalize(h.inflection.pluralize(name)) %>
*     description: Returns status true|false
*     security:
*       - Bearer: []
*     parameters:
<%
var i = 0;
var tmpArray = attributes.split(',');
        while (i < tmpArray.length) {
  var tmp = tmpArray[i].trim().split(':');
%>
*       - in: formData
*         name: <%= tmp[0] && tmp[0].trim() ? h.changeCase.lcFirst(tmp[0].trim()) : 'sample' %>
<%
  i++;
}
%>
*     responses:
*       200:
*         description: It always return status code 200 and the end user must be check status inside the response
*/
router.post('/', (req, res, next) => {
  <%= name %>Service.create(req.body)
    .then(() => res.json({
      status: 200
    }))
    .catch(err => next(err));
});

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
*         description: It always return status code 200 and the end <%= name %> must be check status inside the response
*/
router.get('/:id', authorize(), (req, res, next) => {
  <%= name %>Service.getById(req.params.id)
    .then(<%= name %> => <%= name %> ? res.json({
      status: 200,
      data: <%= name %>
    }) : res.sendStatus(404))
    .catch(err => next(err));
});

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
*         required: true
<%
var i = 0;
var tmpArray = attributes.split(',');
        while (i < tmpArray.length) {
  var tmp = tmpArray[i].trim().split(':');
%>
*       - in: formData
*         name: <%= tmp[0] && tmp[0].trim() ? h.changeCase.lcFirst(tmp[0].trim()) : 'sample' %>
<%
  i++;
}
%>
*     responses:
*       200:
*         description: It always return status code 200 and the end <%= name %> must be check status inside the response
*/
router.put('/:id', authorize(), (req, res, next) => {
  <%= name %>Service.update(req.params.id, req.body)
    .then(<%= name %> => <%= name %> ? res.json({
      status: 200,
      data: <%= name %>
    }) : res.sendStatus(400))
    .catch(err => next(err));
});

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
*         description: It always return status code 200 and the end <%= name %> must be check status inside the response
*/
router.delete('/:id', authorize(), (req, res, next) => {
  <%= name %>Service.delete(req.params.id)
    .then(() => res.json({
      status: 200
    }))
    .catch(err => next(err));
});

module.exports = router;
