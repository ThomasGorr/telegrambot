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

  if(text.startsWith('Wetter in'))
  {
      const city = text.substring(10,text.length);
      Wetter.getWeather(city).then((result) => {
          console.log("Result",result);

          const resultMsg = 'Das Wetter in ' + city + ' beträgt derzeit '
            +result[0].current.temperature + ' Grad.'

          bot.sendMessage(chatId, resultMsg);
      })
      .catch(() => {
        bot.sendMessage(chatId,"Leider konnte ich dich nicht verstehen, du Idiot!");
    });
  }
  else
  {
    // send a message to the chat acknowledging receipt of their message 
    bot.sendMessage(chatId, 'Received your message');
  } 
});