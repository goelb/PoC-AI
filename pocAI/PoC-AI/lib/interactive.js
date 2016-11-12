'use strict';

const {DEFAULT_MAX_STEPS} = require('./config');
const logger = require('./log.js');
const readline = require('readline');
const uuid = require('node-uuid');

module.exports = (wit, text, initContext, maxSteps, callback) => {
  let context = typeof initContext === 'object' ? initContext : {};
  const sessionId = uuid.v1();

  const steps = maxSteps ? maxSteps : DEFAULT_MAX_STEPS;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const prompt = () => {
    rl.write(null, {ctrl: true, name: 'e'});
  };
 
    wit.runActions(sessionId, text, context, steps)
    .then((ctx) => {
      context = ctx;
      prompt();
      callback(ctx);
    })
    .catch(err => console.error(err))
 
};
