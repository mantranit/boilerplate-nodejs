---
inject: true
to: app/api/index.js
before: 'module.exports = router;'
skip_if: <%= h.inflection.pluralize(name) %>
---
router.use('/<%= h.inflection.pluralize(name) %>', require('./<%= h.inflection.pluralize(name) %>/<%= h.inflection.pluralize(name) %>.controller'));
