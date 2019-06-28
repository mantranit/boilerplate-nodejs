---
to: app/api/<%= h.inflection.pluralize(name) %>/<%= name %>.service.js
unless_exists: true
---
const { <%= h.inflection.capitalize(name) %> } = require('models');

module.exports = {
  getAll,
  search,
  getById,
  create,
  update,
  delete: _delete
};

async function getAll() {
  return await <%= h.inflection.capitalize(name) %>.find();
}

async function search(filter) {
  let fullText = {};
  if (filter.text) {
    fullText['$text'] = { $search: filter.text };
  }

  const data = await <%= h.inflection.capitalize(name) %>.find(fullText)
    .skip(filter.skip)
    .limit(filter.limit)
    .sort(filter.sort);
  const total = await <%= h.inflection.capitalize(name) %>.count(fullText);
  return {
    data,
    total
  }
}

async function getById(id) {
  return await <%= h.inflection.capitalize(name) %>.findById(id);
}

async function create(<%= name %>Param) {
  const <%= name %> = new <%= h.inflection.capitalize(name) %>({
    ...<%= name %>Param,
  });

  // save <%= name %>
  await <%= name %>.save();

}

async function update(id, <%= name %>Param) {
  const <%= name %> = await <%= h.inflection.capitalize(name) %>.findById(id);
  // validate
  if (!<%= name %>) throw '<%= h.inflection.capitalize(name) %> not found';

  const { ...<%= name %>ParamClean } = <%= name %>Param;
  // copy <%= name %>ParamClean properties to <%= name %>
  Object.assign(<%= name %>, <%= name %>ParamClean);

  return await <%= name %>.save();
}

async function _delete(id) {
  await <%= h.inflection.capitalize(name) %>.findByIdAndRemove(id);
}

