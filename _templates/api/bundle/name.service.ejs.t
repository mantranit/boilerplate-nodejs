---
to: app/api/<%= h.inflection.pluralize(name) %>/<%= name %>.service.js
unless_exists: false
---
const { <%= h.inflection.capitalize(name) %> } = require('models');
const errors = require("_helpers/errors");

module.exports = {
  getAll,
  search,
  getById,
  create,
  update,
  delete: _delete
};

async function getAll(req, res, next) {
  try {
    res.locals.data = await <%= h.inflection.capitalize(name) %>.find();
    next();
  } catch (err) {
    next(err);
  }
}

async function search(req, res, next) {
  try {
    let filter = {
      text: '',
      skip: 0,
      limit: 10,
      sort: {
        createdDate: 'desc'
      }
    };
    if (req.body.filter) {
      filter = {
        ...filter,
        ...JSON.parse(req.body.filter)
      }
    }

    let fullText = {};
    if (filter.text) {
      fullText['$text'] = { $search: filter.text };
    }

    const list = await <%= h.inflection.capitalize(name) %>.find(fullText)
      .skip(filter.skip)
      .limit(filter.limit)
      .sort(filter.sort);
    const total = await <%= h.inflection.capitalize(name) %>.count(fullText);

    res.locals.data = {
      list,
      total
    }
    
    next();
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    res.locals.data = await <%= h.inflection.capitalize(name) %>.findById(req.params.id);
    next();
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  const { body: <%= name %>Param } = req;
  try {
    const <%= name %> = new <%= h.inflection.capitalize(name) %>({
      ...<%= name %>Param,
    });

    // save <%= name %>
    await <%= name %>.save();

    res.locals.data = <%= name %>;

    next();
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  const { id } = req.params;
  const { body: <%= name %>Param } = req;
  try {
    const <%= name %> = await <%= h.inflection.capitalize(name) %>.findById(id);
    // validate
    if (!<%= name %>) {
      return next(new errors.BadRequestError('<%= h.inflection.capitalize(name) %> not found.'));
    }

    const { ...<%= name %>ParamClean } = <%= name %>Param;
    // copy <%= name %>ParamClean properties to <%= name %>
    Object.assign(<%= name %>, <%= name %>ParamClean);

    await <%= name %>.save();

    res.locals.data = <%= name %>;

    next();
  } catch (err) {
    next(err);
  }
}

async function _delete(req, res, next) {
  try {
    await <%= h.inflection.capitalize(name) %>.findByIdAndRemove(req.params.id);
    next();
  } catch (err) {
    next(err);
  }
}

