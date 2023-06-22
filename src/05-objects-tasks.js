/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  string: '',
  name: '',
  order: 0,

  element(value) {
    const element = Object.create(cssSelectorBuilder);
    element.name = 'element';
    element.order = 1;
    element.string = this.string + value;
    this.exception('element');
    this.followingOrder(1);
    return element;
  },

  id(value) {
    const id = Object.create(cssSelectorBuilder);
    id.name = 'id';
    id.order = 2;
    id.string = `${this.string}#${value}`;
    this.exception('id');
    this.followingOrder(2);
    return id;
  },

  class(value) {
    const classS = Object.create(cssSelectorBuilder);
    classS.order = 3;
    classS.string = `${this.string}.${value}`;
    this.followingOrder(3);
    return classS;
  },

  attr(value) {
    const attr = Object.create(cssSelectorBuilder);
    attr.order = 4;
    attr.string = `${this.string}[${value}]`;
    this.followingOrder(4);
    return attr;
  },

  pseudoClass(value) {
    const pseudoClass = Object.create(cssSelectorBuilder);
    pseudoClass.order = 5;
    pseudoClass.string = `${this.string}:${value}`;
    this.followingOrder(5);
    return pseudoClass;
  },

  pseudoElement(value) {
    const pseudoElement = Object.create(cssSelectorBuilder);
    pseudoElement.name = 'pseudoElement';
    pseudoElement.order = 6;
    pseudoElement.string = `${this.string}::${value}`;
    this.exception('pseudoElement');
    this.followingOrder(6);
    return pseudoElement;
  },

  combine(selector1, combinator, selector2) {
    const combine = Object.create(cssSelectorBuilder);
    combine.string = `${selector1.string} ${combinator} ${selector2.string}`;
    return combine;
  },
  stringify() {
    const stringify = this.string;
    this.string = '';
    return stringify;
  },

  exception(name) {
    if (name === this.name && ['element', 'id', 'pseudoElement'].includes(name)) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  },

  followingOrder(order) {
    if (this.order > order) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  },

};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
