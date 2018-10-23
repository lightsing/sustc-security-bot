const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

var timeout = 60000;

const regex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\d+]*)$/i;
const cmdSetTimeOut = async (ctx) => {
  let message = ctx.message
  const member = await ctx.telegram.getChatMember(message.chat.id, message.from.id)
  if (member && (member.status === 'creator' || member.status === 'administrator')) {
    let parts = regex.exec(ctx.message.text);
    if (!parts) {
      burnAfterReading(ctx)
    } else if (parts[3] == "") {
      ctx.reply(`Timeout is ${timeout}`).then((res) => {
        burnAfterReading(ctx, res)
      })
    } else {
      const new_timeout = parseInt(parts[3])
      timeout = new_timeout
      ctx.reply(`Set timeout to ${timeout}`).then((res) => {
        burnAfterReading(ctx, res)
      })
    }
    burnAfterReading(ctx)
  } else {
    ctx.reply('You are not admin. This incident will be report.').then((res) => {
      burnAfterReading(ctx, res)
    })
  }
}

const burnAfterReading = async (ctx, message) => {
  message = message || ctx.message
  console.log(`Will delete ${message.from.id} in ${message.chat.id} after ${timeout}`)
  setTimeout(() => {
    try {
      ctx.telegram.deleteMessage(message.chat.id, message.message_id)
    } catch (err) {
      console.log(err.description)
      // ignore
      return;
    }
  }, timeout)
}

const autoBurnSimple = async ({ telegram, message }) => {
  console.log(message)
  setTimeout(() => {
    try {
      telegram.deleteMessage(message.chat.id, message.message_id)
    } catch (err) {
      console.log(err.description)
      // ignore
      return;
    }
  }, timeout)
}

bot.start((ctx) => ctx.reply('Welcome'))

bot.command('/setTimeout', cmdSetTimeOut)

bot.on('message', autoBurnSimple)

bot.command('/help', async ({ telegram, message, reply }) => {
  reply(`I'm a Burn after read bot.`).then((res) => {
    burnAfterReading(ctx, res)
  })
  setTimeout(() => {
    try {
      telegram.deleteMessage(message.chat.id, message.message_id)
    } catch (err) {
      console.log(err.description)
      // ignore
      return;
    }
  }, timeout)
})


bot.startPolling()