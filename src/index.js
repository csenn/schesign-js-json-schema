/* eslint no-use-before-define: ["error", { "functions": false }]*/

import * as utils from './utils';

function _fromStringRange(range) {
  const constraint = { type: 'string' };
  if (range.format) {
    switch (range.format) {
      case utils.TEXT_FORMAT_URL:
        constraint.format = 'uri';
        break;
      case utils.TEXT_FORMAT_EMAIL:
        constraint.format = 'email';
        break;
      case utils.TEXT_FORMAT_HOSTNAME:
        constraint.format = 'hostname';
        break;
      default:
    }
  } else if (range.regex) {
    constraint.pattern = range.regex;
  }

  if (utils.isNumber(range.minLength)) {
    constraint.minLength = range.minLength;
  }
  if (utils.isNumber(range.maxLength)) {
    constraint.maxLength = range.maxLength;
  }

  return constraint;
}

function _fromNumberRange(range) {
  const constraint = {};

  switch (range.format) {
    case utils.NUMBER_INT:
    case utils.NUMBER_INT_8:
    case utils.NUMBER_INT_16:
    case utils.NUMBER_INT_32:
    case utils.NUMBER_INT_64:
      constraint.type = 'integer';
      break;
    default:
      constraint.type = 'number';
  }

  if (utils.isNumber(range.min)) {
    constraint.minimum = range.min;
  }
  if (utils.isNumber(range.max)) {
    constraint.maximum = range.max;
  }

  return constraint;
}

function _fromDateRange(range) {
  const constraint = { type: 'string' };
  if (range.format === utils.DATE_DATETIME) {
    constraint.format = 'date-time';
  }
  return constraint;
}

function _fromLinkedClassRange(context, range) {
  const rangeClass = context.classCache[range.ref];
  const keyName = rangeClass.uid.replace('https://', '');

  if (!context.definitions[keyName]) {
    context.definitions[keyName] = _fromObjectSchema(context, rangeClass.propertyRefs);
  }

  return { $ref: `#/definitions/${keyName}` };
}

export function _fromObjectSchema(context, propertyRefs) {
  const constraint = {
    type: 'object',
    required: [],
  };

  constraint.properties = propertyRefs.reduce((prev, propertyRef) => {
    const property = context.propertyCache[propertyRef.ref];
    const { label, range } = property;
    const childConstraint = _createSchemaFromRange(context, range);

    if (utils.isRequiredCardinality(propertyRef.cardinality)) {
      constraint.required.push(label);
    }

    const isArray = utils.isMultipleCardinality(propertyRef.cardinality);
    return Object.assign({}, prev, {
      [label]: isArray ? { type: 'array', items: childConstraint } : childConstraint,
    });
  }, {});

  if (constraint.required.length === 0) {
    delete constraint.required;
  }

  return constraint;
}

export function _createSchemaFromRange(context, range) {
  switch (range.type) {
    case utils.BOOLEAN:
      return { type: 'boolean' };
    case utils.ENUM:
      return { enum: range.values };
    case utils.DATE:
      return _fromDateRange(range);
    case utils.TEXT:
      return _fromStringRange(range);
    case utils.NUMBER:
      return _fromNumberRange(range);
    case utils.NESTED_OBJECT:
      return _fromObjectSchema(context, range.propertyRefs);
    case utils.LINKED_CLASS:
      return _fromLinkedClassRange(context, range);
    default:
      throw new Error(`Not expecting type: ${range.type}`);
  }
}

/*
  Entry point. Provide the graph, the classId, and options
*/
export function generateFromClass(graph, classId, options = {}) {
  /* Create a simple context obj to thread through */
  const context = {
    classCache: {},
    propertyCache: {},
    definitions: {},
  };

  /* Create a dict lookup for classes and properties for speed and convenience */
  graph.forEach(node => {
    if (node.type === 'Class') {
      context.classCache[node.uid] = node;
    } else if (node.type === 'Property') {
      context.propertyCache[node.uid] = node;
    }
  });

  const currentClass = context.classCache[classId];

  /* Create top level object schema */
  const schema = _fromObjectSchema(context, currentClass.propertyRefs, context.schema);

  /* Add meta and definitions (if there are any) */
  schema.$schema = 'http://json-schema.org/draft-04/schema#';
  if (Object.keys(context.definitions).length) {
    schema.definitions = context.definitions;
  }

  return schema;
}
