import { expect } from 'chai'
import { generateFromClass } from '../src'

import basicSchema from './fixtures/basic_schema.json'
import propertyVariationsSchema from './fixtures/property_variations_schema.json'
import inheritanceSchema from './fixtures/inheritance_chain_2_schema.json'
import linkedNodesSchema from './fixtures/linked_nodes_2_schema.json'
import recursionSchema from './fixtures/recursive_schema'

import basic from 'schesign-graph-examples/graphs/export/basic'
import propertyVariations from 'schesign-graph-examples/graphs/export/property_variations'
import inheritanceChain2 from 'schesign-graph-examples/graphs/export/inheritance_chain_2'
import linkedNodes2 from 'schesign-graph-examples/graphs/export/linked_nodes_2'
import recursion from 'schesign-graph-examples/graphs/export/recursion'

const { describe, it } = global

describe('generateFromClass()', () => {
  it('should throw an error when class does not exist', () => {
    let error
    try {
      generateFromClass(
        basic.graph,
        'o/tests/basic/master/class/non_existenet_aaa'
      )
    } catch (err) {
      error = err
    }
    expect(error.message).to.eql('Could not find class o/tests/basic/master/class/non_existenet_aaa in graph')
  })

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
})
