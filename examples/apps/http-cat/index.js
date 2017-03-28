'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('http-cat');

var CODES = {}

var fs = require("fs")

var lines = fs.readFileSync(__dirname + '/codes.txt', { encoding: 'utf8', flag: 'r' });

for (let line of lines.split('\n')) {
  var elements = line.split(/\s+/, 2);
  
  CODES[elements[0].trim()] = elements[1].trim();
}

app.launch(function(req, res) {
  var prompt = 'For HTTP Cat Information, please tell me its status Code.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('HttpCatCodeIntent', 
  {
    slots: {
      'CODE': 'AMAZON.NUMBER'
    },
    'utterances': [
      'whats\'s {CODE}',
      '{CODE}',
    ]
  },
  function(request, response) {
    try {
      //console.log('request: ', request);

      var code = request.slot('CODE');

      var meaning = CODES[code];
      
      console.log("CODE: ", code, " meaning: ", meaning);

      if (null == meaning) {
        return response.say("Unknown code " + code);
      } else {
        return response.card({
          type: "standard",
          title: "Code " + code + " (" + meaning + ")",
          text: meaning,
          //image: {
          //  largeImageUrl: "https://http.cat/" + code + ".jpg"
          //}
        });
      }
    } catch (e) {
      console.log('error:', e);
    }
  }
);

console.log("API Mount Point: https://" + process.env.PROJECT_NAME + ".glitch.me/http-cat"); 

module.exports = app;

/*
app.intent('airportinfo', {
  'slots': {
    'AIRPORTCODE': 'FAACODES'
  },
  'utterances': ['{|flight|airport} {|delay|status} {|info} {|for} {-|AIRPORTCODE}']
},
  function(req, res) {
    //get the slot
    var airportCode = req.slot('AIRPORTCODE');
    var reprompt = 'Tell me an airport code to get delay information.';
    if (_.isEmpty(airportCode)) {
      var prompt = 'I didn\'t hear an airport code. Tell me an airport code.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var faaHelper = new FAADataHelper();
      faaHelper.requestAirportStatus(airportCode).then(function(airportStatus) {
        console.log(airportStatus);
        res.say(faaHelper.formatAirportStatus(airportStatus)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I didn\'t have data for an airport code of ' + airportCode;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);

//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;
*/