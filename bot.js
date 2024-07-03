const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const fs = require('node:fs')
const getUSD = require('./currency')

const token = 'XXX'
const token = process.env.TG_API_KEY
const bot = new TelegramBot(token, {polling: true})

log('System running and waiting for incoming requests...')

bot.on('message', (msg) => {
  const { id } = msg.chat
  const { username } = msg.chat
  let { text } = msg
  let fullname = ''

  text = text.trim().toLowerCase()
  
  if(msg.chat.first_name != undefined && msg.chat.last_name != undefined) {
    fullname = msg.chat.first_name + msg.chat.last_name
  }
  
  log(`[I] incoming request from ${fullname} (${username}) | command: ${text}`)

  if(text === '/start'){
    bot.sendMessage(id, getResponse('bot_init'))
  } else if (text === '/cat'){
    bot.sendMessage(id, getResponse('bot_searching_image'))

    axios.get('https://api.thecatapi.com/v1/images/search')
      .then((res) => {
				bot.sendPhoto(id, res.data[0].url, { caption: getResponse('bot_image_sent') })
        log(`[O] delivering image to ${username}`)
      })
      .catch((err) => {
        console.log(err)
      })
  } else if (text === '/usd') {
    bot.sendMessage(id, getResponse('bot_wait'))

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

function log (message) {  
  console.log(message)
  
  fs.writeFile('./requests.log', `${message} \n`, { flag: 'a' }, (err) => {
    if(err) console.log(err)
  })
}