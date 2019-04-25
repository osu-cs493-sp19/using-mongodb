/*
 * Lodgings schema and data accessor methods.
 */

const { extractValidFields } = require('../lib/validation');

/*
 * Schema for a lodging.
 */
exports.LodgingSchema = {
  name: { required: true },
  description: { required: false },
  street: { required: true },
  city: { required: true },
  state: { required: true },
  zip: { required: true },
  price: { required: true },
  ownerid: { required: true }
};
