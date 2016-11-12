'use strict';

var Client = require('node-rest-client').Client;
var http = new Client();
var rest = require('restler');
let Wit = null;
var txt = null;
var ap = "";
var cheerio = require('cheerio');
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
  return typeof val === 'object' ? val.value : val;
};
const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      txt = response.text;
      return resolve();
    });
  },


   doOperation({context, entities}) {

     return new Promise(function(resolve, reject) {
        if(Object.keys(entities).length === 1){
     http.get("https://transformation-prodv112.ush.a.intuit.com/v2/search/posts?q="+entities.operation[0].value+"&primary_ds=STSV2", function (data, response) {
                        http.get(data.items[0].url,function(content,response){
                        ap = content.content;
                      return  resolve(context); // this statement is required by node-wit to know operation is completed, it seems it required context as arg.
                })
      

    })} else {
      http.get("https://www.youtube.com/results?spf=navigate&"+"search_query=quickbooks+online+"+entities.operation[0].value.replace(" ","+"), function (data, response) {
        console.log("video fetched");
        var $ = cheerio.load(data[1].body.content);
        ap="id :" + $(".item-section>*:first-child>div").attr('data-context-item-id');
        console.log('ap ', ap);
      return  resolve(context);
      });
    } 
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
module.exports = (text, callback) => {
   interactive(client,text,null, null, function (ctx) {
    if(txt.includes("Here you go ")){
      if(ap.includes("id :")){
        txt = ap;
        ap = "";
      } else {
        txt = txt+" "+ap;

      }
      
    }
    callback(txt);
   });
   //return txt;
};

const client = new Wit({accessToken, actions});
 //interactive(client,"hello");
// let context = typeof initContext === 'object' ? initContext : {};
// client.runActions(sessionId, "create an invoice", context, 1000)
//     .then((ctx) => {
//       context = ctx;
//       prompt();
//     }).catch(err => console.error(err))
// interactive(client,text);
