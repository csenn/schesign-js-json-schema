import { expect } from 'chai';
import { generateFromClass } from '../src';
const { describe, it } = global;

import simple from './fixtures/simple.json';
import simpleSchema from './fixtures/simpleSchema.json';
import propertyVariations from './fixtures/propertyVariations.json';
import propertyVariationsSchema from './fixtures/propertyVariationsSchema.json';
import inheritance from './fixtures/inheritance.json';
import inheritanceSchema from './fixtures/inheritanceSchema.json';
import inheritanceOverride from './fixtures/inheritanceOverride.json';
import inheritanceOverrideSchema from './fixtures/inheritanceOverrideSchema.json';
import excludeParent from './fixtures/excludeParent';
import excludeParentSchema from './fixtures/excludeParentSchema';
import recursive from './fixtures/recursive';
import recursiveSchema from './fixtures/recursiveSchema';
import schemaDotOrg from './fixtures/schemaDotOrg';

describe('generateJsonSchema', () => {
  it('should convert simple to a json schema', () => {
    const schema = generateFromClass(
      simple.graph,
      'https://www.schesign.com/u/my_user/my_design/0.0.1/class/class1'
    );
    expect(schema).to.deep.equal(simpleSchema);
  });

  it('should convert propertyVariations to a json schema', () => {
    const schema = generateFromClass(
      propertyVariations.graph,
      'https://www.schesign.com/o/tests/test_property_variations/master/class/class1'
    );
    expect(schema).to.deep.equal(propertyVariationsSchema);
  });

  it('should convert inheritance to a json schema', () => {
    const schema = generateFromClass(
      inheritance.graph,
      'https://www.schesign.com/u/csenn/test_inheritance_2/master/class/class5'
    );
    expect(schema).to.deep.equal(inheritanceSchema);
  });

  it('should convert excludeParent to a json schema', () => {
    const schema = generateFromClass(
      excludeParent.graph,
      'https://www.schesign.com/u/my_user/my_design/0.0.1/class/class2'
    );
    expect(schema).to.deep.equal(excludeParentSchema);
  });

  it('should convert inheritanceOverride to a json schema', () => {
    const schema = generateFromClass(
      inheritanceOverride.graph,
      'https://www.schesign.com/u/csenn/test_inheritance_override_1/master/class/class1'
    );
    expect(schema).to.deep.equal(inheritanceOverrideSchema);
  });

  it('should convert recursive to a json schema', () => {
    const schema = generateFromClass(
      recursive.graph,
      'https://www.schesign.com/o/tests/recursive/master/class/class1'
    );
    expect(schema).to.deep.equal(recursiveSchema);
    // expect(schema).to.deep.equal(inheritanceOverrideSchema);
  });

  it.skip('should convert schemaDotOrg to a json schema', () => {
    const schema = generateFromClass(
      schemaDotOrg.graph,
      'https://www.schesign.com/u/csenn/schemadotorg/master/class/person'
    );
    console.log(JSON.stringify(schema, null, 2));
    // expect(schema).to.deep.equal(inheritanceOverrideSchema);
  });
});
