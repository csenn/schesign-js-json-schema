import { expect } from 'chai'
import { generateFromClass } from '../src'
// import simple from './fixtures/simple.json'
import basicSchema from './fixtures/basic_schema.json'
import propertyVariationsSchema from './fixtures/property_variations_schema.json'
import inheritanceSchema from './fixtures/inheritance_chain_2_schema.json'
import linkedNodesSchema from './fixtures/linked_nodes_2_schema.json'
// import inheritanceOverride from './fixtures/inheritanceOverride.json'
// import inheritanceOverrideSchema from './fixtures/inheritanceOverrideSchema.json'
// import excludeParent from './fixtures/excludeParent'
// import excludeParentSchema from './fixtures/excludeParentSchema'
// import recursive from './fixtures/recursive'
import recursionSchema from './fixtures/recursive_schema'
// import schemaDotOrg from './fixtures/schemaDotOrg'

import basic from 'schesign-graph-examples/graphs/export/basic'
import propertyVariations from 'schesign-graph-examples/graphs/export/property_variations'
import inheritanceChain2 from 'schesign-graph-examples/graphs/export/inheritance_chain_2'
import linkedNodes2 from 'schesign-graph-examples/graphs/export/linked_nodes_2'
import recursion from 'schesign-graph-examples/graphs/export/recursion'

const { describe, it } = global

describe('generateJsonSchema', () => {
  it('should convert basic to a json schema', () => {
    const schema = generateFromClass(
      basic.graph,
      'o/tests/basic/master/class/class_a'
    )
    expect(schema).to.deep.equal(basicSchema)
  })

  it('should convert propertyVariations to a json schema', () => {
    const schema = generateFromClass(
      propertyVariations.graph,
      'o/tests/property_variations/master/class/class1'
    )
    expect(schema).to.deep.equal(propertyVariationsSchema)
  })

  it('should convert inheritance to a json schema', () => {
    const schema = generateFromClass(
      inheritanceChain2.graph,
      'o/tests/inheritance_chain_2/master/class/class5'
    )
    expect(schema).to.deep.equal(inheritanceSchema)
  })

  it('should convert linkedNodes to a json schema', () => {
    const schema = generateFromClass(
      linkedNodes2.graph,
      'o/tests/linked_nodes_2/master/class/class3'
    )
    expect(schema).to.deep.equal(linkedNodesSchema)
  })

  it('should convert recursion to a json schema', () => {
    const schema = generateFromClass(
      recursion.graph,
      'o/tests/recursion/master/class/class1'
    )
    expect(schema).to.deep.equal(recursionSchema)
  })
  // describe('internal graphs', () => {
  //   it('should convert excludeParent to a json schema', () => {
  //     const schema = generateFromClass(
  //       excludeParent.graph,
  //       'https://www.schesign.com/u/my_user/my_design/0.0.1/class/class2'
  //     )
  //     expect(schema).to.deep.equal(excludeParentSchema)
  //   })

  //   it.skip('should convert inheritanceOverride to a json schema', () => {
  //     const schema = generateFromClass(
  //       inheritanceOverride.graph,
  //       'https://www.schesign.com/u/csenn/test_inheritance_override_1/master/class/class1'
  //     )
  //     expect(schema).to.deep.equal(inheritanceOverrideSchema)
  //   })

  //   it.skip('should convert recursive to a json schema', () => {
  //     const schema = generateFromClass(
  //       recursive.graph,
  //       'https://www.schesign.com/o/tests/recursive/master/class/class1'
  //     )
  //     expect(schema).to.deep.equal(recursiveSchema)
  //     // expect(schema).to.deep.equal(inheritanceOverrideSchema);
  //   })

  //   it.skip('should convert schemaDotOrg to a json schema', () => {
  //     const schema = generateFromClass(
  //       schemaDotOrg.graph,
  //       'https://www.schesign.com/u/csenn/schemadotorg/master/class/person'
  //     )
  //     console.log(JSON.stringify(schema, null, 2))
  //     // expect(schema).to.deep.equal(inheritanceOverrideSchema);
  //   })
  // })
})
