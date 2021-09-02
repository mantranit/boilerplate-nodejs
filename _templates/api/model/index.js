
// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: 'input',
    name: 'name',
    message: "What's the model's name?"
  },
  {
    type: 'input',
    name: 'model_attributes',
    message: "What's the model's attributes? (separate by comma)"
  }
];