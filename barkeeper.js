const apiai       = require('apiai');

const apiKeys     = require('./apikeys');

const app = apiai(apiKeys.apiai);

var request = app.textRequest('Gib mir ein Bier', {
    sessionId: 'CocktailSession'
});

request.on('response', function(response) {
    console.log("response",response);
    const intentName = response.result.metadata.intentName;
    const params     = response.result.parameters;

    if(intentName.toUpperCase() === 'BARKEEPER')
    {
        const cocktail = params.Cocktail;
        const number   = params.number[0];
        console.log(cocktail,number);

        //Database: new Cocktailorder: 1 Bier
        //.then() => Response an User: Alles Klar <Name>, ich habe dir 1 Bier auf die Liste geschrieben
        //.then() => Reload QLik App
    }
});
 
request.on('error', function(error) {
    console.log(error);
});
 
request.end();