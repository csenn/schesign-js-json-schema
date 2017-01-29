import { expect } from 'chai';
import { generateFromClass } from '../src';
const { describe, it } = global;

import propertyVariations from './fixtures/propertyVariations.json';
import propertyVariationsSchema from './fixtures/propertyVariationsSchema.json';

describe('generateJsonSchema', () => {
  it('should convert a schesign graph to a json schema', () => {
    const schema = generateFromClass(
      propertyVariations.graph,
      'https://www.schesign.com/o/tests/test_property_variations/master/class/class1'
    );
    expect(schema).to.deep.equal(propertyVariationsSchema);
  });
});
