const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const fs = require('node:fs')
const getUSD = require('./currency')

const token = '6859392847:AAFV2J6dLEhDB_HkLSle6U4YVLetc7IGwiU-'
const bot = new TelegramBot(token, {polling: true})

console.log('Waiting for incoming requests...')

bot.on('message', (msg) => {
  const { id } = msg.chat
  const { username } = msg.chat
  let { text } = msg
  let fullname = ''

  text = text.trim().toLowerCase()
  
  if(msg.chat.first_name != undefined && msg.chat.last_name != undefined) {
    fullname = msg.chat.first_name + msg.chat.last_name
  }
  
  console.log(`[➡] incoming request from ${fullname} (${username}) | command: ${text}`)

  if(text === '/start'){
    bot.sendMessage(id, getResponse('bot_init'))
  } else if (text === '/cat'){
    bot.sendMessage(id, getResponse('bot_searching_image'))

    axios.get('https://api.thecatapi.com/v1/images/search')
      .then((res) => {
				bot.sendPhoto(id, res.data[0].url, { caption: getResponse('bot_image_sent') })
        console.log(`[➡] delivering image to ${username}`)
      })
      .catch((err) => {
        console.log(err)
      })
  } else if (text === '/usd') {
    bot.sendMessage(id, `🔎🐈 Voy pa' ti, dame un chance.`)

    getUSD()
      .then((usd) => {
        bot.sendMessage(id, `💸🐈 El dólar está a ${usd} 💀.`)
      })

  } else {
    bot.sendMessage(id, getResponse('bot_unknown_command'))
  }
})

bot.on("polling_error", console.log);

function getResponse(key) {
  const obj = JSON.parse(fs.readFileSync('responses.json', 'utf-8'))

  return obj.find((e) => e.key === key).value
}