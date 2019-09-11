// to read the settings file
var PropertiesReader = require('properties-reader');

// to interact with Discord
const Discord = require('discord.js');

// to write in files
var fs = require("fs");

var properties;
try {
    properties = PropertiesReader('settings.properties')
} catch (err) {
    console.log("You need to create a settings.properties file in the application folder. See README for more informations.");
    process.exit(1);
};

// initialize the bot
const bot = new Discord.Client();

const token = properties.get('token');
if (!token) {
    console.log("settings.properties file is missing a 'token = <your token>' line. Check README if you don't know how to get your token.");
    process.exit(1);
};

var counters;
try {
    counters = require('./counters.json');
} catch (err) {
    console.log(err);
    counters = {};
}

bot.on('ready', () => {
    console.log(' -- LOADED -- ');
});

bot.on('message', message => {
    let content = message.content.toLowerCase();
    let regex = RegExp('.*fu.*proxy.*','i')
    if (regex.test(content)) {
        if (counters["proxy"]) {
            counters["proxy"] += 1;
        }
        else{
            counters["proxy"] = 1;
        }
        message.channel.send(getTextView("proxy"));
        saveToDisk();
    }
});

bot.login(token);
console.log("Done");

function getTextView(title) {
    let number = counters[title];
    return '卌'.repeat(Math.floor((number/5))) + '|'.repeat(number%5);
}

function saveToDisk() {
    fs.writeFile('counters.json', JSON.stringify(counters), "utf8", err => {
        if (err) throw err;
        console.log('Counters successfully saved !');
    });
}
