const TelegramBot = require('node-telegram-bot-api');
const Wetter      = require('./wetter');
// replace the value below with the Telegram token you receive from @BotFather 
const token = '394034476:AAFWXnjHqBfIcOcA_1hntnymNFLJxGSh8YU';
 
// Create a bot that uses 'polling' to fetch new updates 
const bot = new TelegramBot(token, {polling: true});
 
// Matches "/echo [whatever]" 
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram 
  // 'match' is the result of executing the regexp above on the text content 
  // of the message 
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever" 
 
  // send back the matched "whatever" to the chat 
  bot.sendMessage(chatId, resp);
});
 
// Listen for any kind of message. There are different kinds of 
// messages. 
bot.on('message', (msg) => {
 console.log("Msg",msg);
  const text = msg.text;
  const chatId = msg.chat.id;

  if (isWelcomeQuery(text))
  {
     bot.sendMessage(chatId, 'Hi '+msg.from.first_name);
  }
  else if(isWeatherQuery(text))
  {
    const city = getCityForWeatherQuery(text);
    const currentDayNumber = parseInt(new Date().getDay());

    Wetter.getWeather(city).then((result) => {

        const forecast = result[0].forecast[currentDayNumber+1];

        const weatherToday = 'Das Wetter in ' + city + ' beträgt derzeit '
          + result[0].current.temperature + ' Grad mit ' 
          + result[0].current.skytext + '.';

        const weatherTomorrow = 'Morgen wird es zu ' + forecast.precip
          + '% ' + forecast.skytextday + ' geben.';

        const resultMsg = weatherToday + '\n' + weatherTomorrow;

        bot.sendMessage(chatId, resultMsg);
    })
    .catch((err) => {
      bot.sendMessage(chatId,"Leider konnte ich dich nicht verstehen, du Idiot! " + err);
    });
  }
  else
  {
    // send a message to the chat acknowledging receipt of their message 
    //bot.sendMessage(chatId, 'Received your message'+text);
  } 
});

function isWeatherQuery(text)
{
  if(text.includes('Wetter in'))
  {
    return true;
  }
  else
  {
    return false;
  }
}

function getCityForWeatherQuery(text)
{
  const index = text.indexOf('Wetter in');
  return text.substring(index + 10,text.length);
}

function isWelcomeQuery(text)
{
  const welcomes = ['hi','hey','hallo','guten tag','guten abend'];
  let isWeatherQuery = false;

  for(let i = 0; i < welcomes.length; i++)
  {
    console.log(text.toUpperCase(),welcomes[i].toUpperCase(),text.toUpperCase().includes(welcomes[i].toUpperCase()));
    if(text.toUpperCase().includes(welcomes[i].toUpperCase()))
    {
      isWeatherQuery = true;
      break;
    }
  }

  return isWeatherQuery;
}