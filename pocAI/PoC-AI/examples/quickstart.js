'use strict';

var Client = require('node-rest-client').Client;
var http = new Client();
let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  // if (process.argv.length !== 3) {
  //   console.log('usage: node examples/quickstart.js <wit-access-token>');
  //   process.exit(1);
  // }
  return '6RWVZRNBFXTE7CBKQ6O4STJ27XRBNHI7';
})();

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  console.log(val.value);
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log(response.text);
      return resolve();
    });
  },

  doOperation({context, entities}) {
      http.get("https://transformation-prodv112.ush.a.intuit.com/v2/search/posts?q="+entities.operation[0].value+"&primary_ds=STSV2", function (data, response) {
                http.get(data.items[0].url,function(content,res){
                        console.log(content.content);
                })
      });
      return new Promise(function(resolve, reject) {
                        return resolve(context);
                  });
  },

  getClarity({context, entities}) {
    return new Promise(function(resolve, reject) {
      return resolve(context);
    });
  },

  goPersonal({context, entities}) {
    return new Promise(function(resolve, reject) {
      return resolve(context);
    });
  },
  
};
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//  const prompt = () => {
//     rl.prompt();
//     rl.write(null, {ctrl: true, name: 'e'});
//   };
function makeCallback(text) {
   interactive(client,text);
}

const client = new Wit({accessToken, actions});
 //interactive(client,"hello");
// let context = typeof initContext === 'object' ? initContext : {};
// client.runActions(sessionId, "create an invoice", context, 1000)
//     .then((ctx) => {
//       context = ctx;
//       prompt();
//     }).catch(err => console.error(err))
// interactive(client,text);
