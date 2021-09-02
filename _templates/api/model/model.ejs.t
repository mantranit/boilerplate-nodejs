---
inject: true
to: app/models/index.js
before: '};'
skip_if: <%= h.inflection.capitalize(name) %>
---
  <%= h.inflection.capitalize(name) %>: require('./<%= name %>.model'),