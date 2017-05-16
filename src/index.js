import * as constants from 'schesign-js-graph-utils/dist/constants'

function isNumber (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

function _fromStringRange (range) {
  const constraint = { type: 'string' }
  if (range.format) {
    switch (range.format) {
      case constants.TEXT_URL:
        constraint.format = 'uri'
        break
      case constants.TEXT_EMAIL:
        constraint.format = 'email'
        break
      case constants.TEXT_HOSTNAME:
        constraint.format = 'hostname'
        break
      default:
    }
  } else if (range.regex) {
    constraint.pattern = range.regex
  }

  if (isNumber(range.minLength)) {
    constraint.minLength = range.minLength
  }
  if (isNumber(range.maxLength)) {
    constraint.maxLength = range.maxLength
  }

  return constraint
}

function _fromNumberRange (range) {
  const constraint = {}

  switch (range.format) {
    case constants.NUMBER_INT:
    case constants.NUMBER_INT_8:
    case constants.NUMBER_INT_16:
    case constants.NUMBER_INT_32:
    case constants.NUMBER_INT_64:
      constraint.type = 'integer'
      break
    default:
      constraint.type = 'number'
  }

  if (isNumber(range.min)) {
    constraint.minimum = range.min
  }
  if (isNumber(range.max)) {
    constraint.maximum = range.max
  }

  return constraint
}

function _fromDateRange (range) {
  const constraint = { type: 'string' }
  if (range.format === constants.DATE_DATETIME) {
    constraint.format = 'date-time'
  }
  return constraint
}

function _buildObjectSchema (context, propertySpecs) {
  const constraint = { type: 'object' }
  const required = []

  constraint.properties = propertySpecs.reduce((prev, propertySpec) => {
    const property = context.propertyCache[propertySpec.ref]
    const { label } = property
    const childConstraint = _createSchemaFromRange(context, property)

    if (propertySpec.required) {
      required.push(label)
    }

    let result
    if (propertySpec.array) {
      result = { type: 'array', items: childConstraint }
      if (isNumber(propertySpec.minItems)) {
        result.minItems = propertySpec.minItems
      }
      if (isNumber(propertySpec.maxItems)) {
        result.maxItems = propertySpec.maxItems
      }
    } else {
      result = childConstraint
    }

    return Object.assign({}, prev, { [label]: result })
  }, {})

  if (required.length > 0) {
    constraint.required = required
  }

  return constraint
}

function _fromObjectSchema (context, uid, propertySpecs) {
  const keyName = uid.replace('https://', '')

  if (!context.definitions[keyName]) {
    /* First set to true to prevent recursion */
    context.definitions[keyName] = true
    context.definitions[keyName] = _buildObjectSchema(context, propertySpecs)
  }

  return { $ref: `#/definitions/${keyName}` }
}

function _fromLinkedClassRange (context, range) {
  const rangeClass = context.classCache[range.ref]
  return _fromObjectSchema(context, rangeClass.uid, rangeClass.propertySpecs)
}

export function _createSchemaFromRange (context, property) {
  const { uid, range } = property
  switch (range.type) {
    case constants.BOOLEAN:
      return { type: 'boolean' }
    case constants.ENUM:
      return { enum: range.values }
    case constants.DATE:
      return _fromDateRange(range)
    case constants.TEXT:
      return _fromStringRange(range)
    case constants.NUMBER:
      return _fromNumberRange(range)
    case constants.NESTED_OBJECT:
      // console.log(range.propertySpecs);
      // return;
      return _fromObjectSchema(context, uid, range.propertySpecs)
    case constants.LINKED_CLASS:
      return _fromLinkedClassRange(context, range)
    default:
      throw new Error(`Not expecting type: ${range.type}`)
  }
}

/* If there is a property label lower in the hierarchy,
do not overwrite it from parent with same name */
function existsInRefs (context, propertySpecs, parentRef) {
  return propertySpecs.some(ref => {
    const node = context.propertyCache[ref.ref]
    const parentNode = context.propertyCache[parentRef.ref]
    return node.label === parentNode.label
  })
}

export function _flattenHierarchies (context) {
  Object.keys(context.classCache).forEach(key => {
    const classNode = context.classCache[key]
    const excluded = []

    // classNode.excludeParentProperties || []
    const recurseNode = node => {
      if (node.subClassOf) {
        const parent = context.classCache[node.subClassOf]
        parent.propertySpecs.forEach(parentRef => {
          if (node.excludeParentProperties) {
            excluded.push(...node.excludeParentProperties)
          }
          const exists = existsInRefs(context, classNode.propertySpecs, parentRef)
          if (!exists) {
            classNode.propertySpecs.push(parentRef)
          }
        })
        recurseNode(parent)
      }
    }
    recurseNode(classNode)
    classNode.propertySpecs = classNode.propertySpecs.filter(spec => excluded.indexOf(spec.ref) === -1)
  })
}

/*
  Entry point. Provide the graph, the classId, and options
*/
export function generateFromClass (graph, classId, options = {}) {
  /* Create a simple context obj to thread through */
  const context = {
    classCache: {},
    propertyCache: {},
    definitions: {}
  }

  /* Create a dict lookup for classes and properties for speed and convenience */
  graph.forEach(node => {
    if (node.type === 'Class') {
      context.classCache[node.uid] = node
    } else if (node.type === 'Property') {
      context.propertyCache[node.uid] = node
    }
  })

  _flattenHierarchies(context)

  const currentClass = context.classCache[classId]
  if (!currentClass) {
    throw new Error(`Could not find class ${classId} in graph`)
  }

  /* Merge defaults with top level object contraint */
  const schema = Object.assign({
    id: `https://wwww.schesign.com/${classId}.jsonschema`,
    $schema: 'http://json-schema.org/draft-04/schema#'
  }, _buildObjectSchema(context, currentClass.propertySpecs, context.schema))

  /* Add meta and definitions (if there are any) */
  if (Object.keys(context.definitions).length) {
    schema.definitions = context.definitions
  }

  return schema
}
