const TelegramBot = require('node-telegram-bot-api');
const Wetter      = require('./wetter');
const fs          = require('fs');
const Buffer      = require('buffer').Buffer;
const dir = 'C:/Users/tgorr/Pictures/Memes/';
// replace the value below with the Telegram token you receive from @BotFather 
const token = '394034476:AAFWXnjHqBfIcOcA_1hntnymNFLJxGSh8YU';

// Create a bot that uses 'polling' to fetch new updates 
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message. There are different kinds of 
// messages. 
bot.on('message', (msg) => {
  //console.log("Msg",msg);
  const text = msg.text;
  const chatId = msg.chat.id;

  if (isWelcomeQuery(text))
  {
     bot.sendMessage(chatId, 'Hi '+msg.from.first_name);
  }
  if(isWeatherQuery(text))
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

// Matches "/sendpic [whatever]" 

bot.onText(/\/sendpic/, (msg) => {

  const img = getImage();

  img.then((image) => {

    console.log("Image",image);
    bot.sendPhoto(
      msg.chat.id,
      image,
      {caption : "LOL & ROFLCOPTER"}
      );
  })
  .catch((err) => {
    console.log("Error in sendpic",err);
  })
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
    //console.log(text.toUpperCase(),welcomes[i].toUpperCase(),text.toUpperCase().includes(welcomes[i].toUpperCase()));
    if(text.toUpperCase().includes(welcomes[i].toUpperCase()))
    {
      isWeatherQuery = true;
      break;
    }
  }

  return isWeatherQuery;
}

function getImage()
{
  return new Promise((resolve, reject) =>
  {
    fs.readdir(dir, (err, files) => {
      const numberOfFiles = files.length;
      const fileName = Math.floor(Math.random(1,20) * numberOfFiles) +1+ '.jpg';
      console.log("Filename",fileName);
      fs.readFile('C:/Users/tgorr/Pictures/Memes/'+fileName, function(err, buffer)
      {

        if(err)
        {
          console.error(err);
          reject("Error in getImage", err);
        }

        //console.log("String",new Buffer(buffer));

        resolve(new Buffer(buffer));
      });
    });
  }); 
}