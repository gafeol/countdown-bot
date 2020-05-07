const TelegramBot = require('node-telegram-bot-api');

const token = require('./token.js');

const bot = new TelegramBot(token, {polling: true});

const sendWarning = (chatId, timeLeft, period=60000) => {
    if(timeLeft === 0)
        bot.sendMessage(chatId, "Agora tem!");
    else{
        const hours =   Math.floor(timeLeft/3600000);
        const minutes = Math.floor((timeLeft%3600000)/60000);
        const seconds = Math.floor((timeLeft%60000)/1000);
        bot.sendMessage(chatId, "Daqui " + hours + ":" +  minutes + ":" + seconds + " tem...")
        setTimeout(sendWarning, period, chatId, timeLeft-period, period);
    }
};

const setTitle = (chatId, timeLeft, period=60000) => {
    if(timeLeft < 0){
        bot.setChatTitle(chatId, "Já teve!");
    }
    else if(timeLeft === 0){
        bot.setChatTitle(chatId, "Agora ta tendo!");
        setTimeout(setTitle, period, chatId, timeLeft-period, period);
    }
    else{
        const hours =   Math.floor(timeLeft/3600000);
        const minutes = Math.floor((timeLeft%3600000)/60000);
        const seconds = Math.floor((timeLeft%60000)/1000);
        bot.setChatTitle(chatId, "Daqui " + hours + ":" +  minutes + ":" + seconds + " tem...")
        setTimeout(setTitle, period, chatId, timeLeft-period, period);
    }
};

// Every minute a new message warning
bot.onText(/\/countdown msg ([0-9]+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    try{
        const minutes = parseInt(resp);
        console.log(minutes);
        sendWarning(chatId, minutes*60000);
    } catch (e){
        console.log("Error " + e);
    }
});


bot.onText(/\/countdown msg seconds ([0-9]+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    try{
        const minutes = parseInt(resp);
        sendWarning(chatId, minutes*60000, 1000);
    } catch (e){
        console.log("Error " + e);
    }
});

bot.onText(/\/countdown ([0-9]+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    try{
        const minutes = parseInt(resp);
        setTitle(chatId, minutes*60000, 1000);
    } catch (e){
        console.log("Error " + e);
    }
});

bot.onText(/\/countdown s ([0-9]+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    try{
        const seconds = parseInt(resp);
        setTitle(chatId, seconds*1000, 1000);
    } catch (e){
        console.log("Error " + e);
    }
});