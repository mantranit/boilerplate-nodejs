---
to: app/models/<%= name %>.model.js
unless_exists: true
---
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const <%= name %>Schema = new Schema({
  <%
  var i = 0;
  var tmpArray = attributes.split(',');
  while (i < tmpArray.length) {
      var tmp = tmpArray[i].trim().split(':');
  %>
  <%= tmp[0] && tmp[0].trim() ? h.changeCase.lcFirst(tmp[0].trim()) : 'sample' %>: {type: <%= tmp[1] && tmp[1].trim() ? h.inflection.capitalize(tmp[1].trim()) : 'String' %>},
  <%
      i++;
  }
  %>
  createdDate: {type: Date, default: Date.now}

});

<%= name %>Schema.index({ '$**': 'text' });

<%= name %>Schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('<%= h.inflection.capitalize(name) %>', <%= name %>Schema);