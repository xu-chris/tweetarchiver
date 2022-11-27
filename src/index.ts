import { Context, Markup, Telegraf, Telegram } from 'telegraf';
import { Update } from 'typegram';
import * as dotenv from 'dotenv'
import { TweetArchiver } from './service/twitter';
dotenv.config()

const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string);
const tweetArchiver: TweetArchiver = new TweetArchiver();

bot.start((ctx) => {
  ctx.reply('Hello ' + ctx.from.first_name + '!');
});
bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /keyboard to receive a message with a keyboard');
  ctx.reply('Send /quit to stop the bot');
});
bot.command('quit', (ctx) => {
  // Explicit usage
  ctx.telegram.leaveChat(ctx.message.chat.id);
// Context shortcut
  ctx.leaveChat();
});
bot.command('keyboard', (ctx) => {
  ctx.reply(
    'Keyboard',
    Markup.inlineKeyboard([
      Markup.button.callback('First option', 'first'),
      Markup.button.callback('Second option', 'second'),
    ])
  );
});
// bot.on('text', (ctx) => {
//   ctx.reply(
//     'You choose the ' +
//       (ctx.message.text === 'first' ? 'First' : 'Second') +
//       ' Option!'
//   );
// });


// Command: Add pasted link to archive
bot.command('archive', (ctx) => {
  ctx.reply(
    'Send the twitter link which should be archived'
  );
});
bot.on('text', async (ctx) => {
  try {
    const link = decideOnTwitterLink(ctx.message.text);
    ctx.reply(
      'tweet stored in archives 👍' 
    )
  } catch {
    ctx.reply(
      'This message is not a twitter link.'
    );
  }
});

// Addition: Check if 1 single tweet, 2 twitter user, or 3 search query.
function decideOnTwitterLink (link: string) {
  // Fallback for no twitter link
  if (!link.includes('twitter.com') ) {
    console.error('Not a twitter link: ' + link)
    throw "No twitter link!"
  }
  
  if (link.includes('status')) {
    tweetArchiver.archiveTweet(link)
  } else if (link.includes('search?q=')) {
    // Option 3
  } else {
    tweetArchiver.archiveTweet(link)
  } 
}

// If option 2, 3: Ask for start date and end date
// function getStartAndEndDate () : [Date, Date] {
  
// }

// Handler 1: Add single tweet to archive

// Handler 2: Add and watch entered user

// Handler 3: Add and watch entered search query

// Handler afterwards: confirm addition

// Command: List all current watched twitter stuff
// Addition: Delete on click

// Handler afterwards: confirm deletion

// Command: Enable sending info about archived tweet

// Command: Disable sending info about archived tweet

// Handler afterwards: confirm chosen option

// Handler: Send info about archived tweet (for each single)
// Based on given setting for user X
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
