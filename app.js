
const Discord = require("discord.js");
const client = new Discord.Client();
const express = require('express');
const app = express();
const { NlpManager } = require('node-nlp');
const { prefix, token } = require('./config.json');
const dotenv = require('dotenv');
dotenv.config();
const { TOKEN } = process.env;

const deepbot = require("./NLP");

client.on("ready", async () => {
  //dialog.Init();
  deepbot.Init();
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === "member-log"
  );
  if (!channel) return;
  new_log(member);
  channel.send(
    `${member}님 안녕하세요? 저는 24시간 이 곳을 감지하는 cctv겸용 봇이에요`
  );
});

client.on("messageDelete", (msg) => {
  let storing_msg = `${msg.author.username} : ${msg.content}`;
  del_log(storing_msg);
});

client.on("guildMemberRemove", (member) => {
  ban_log(member);
});

client.on("guildBanAdd", (guild, user) => {
  block_log(user.author.username);
});

client.on("message", async (msg) => {
  try {
    if (msg.content.startsWith("!help")) {
      await msg.channel.send(explain);
    }

    if (msg.content.startsWith("!join")) {
      if (msg.member.voice.channel) {
        const connection = await msg.member.voice.channel.join();
        if (!connection) console.log("join error");
      } else {
        await msg.reply("먼저 채널에 들어가놓고 부르세요. 짜증나게");
      }
    }

    if (msg.content.startsWith("!link")) {
      await msg.member.voice.channel.join().then((connection) => {
        let url = msg.content.replace("!link", "");
        connection.play(ytdl(url, { filter: "audioonly" }));
      });
    }

    if (msg.content.startsWith("!log")) {
      let log_info = read_log();
      await msg.channel.send(log_info);
    }

    if (msg.content.startsWith("!stop")) {
      msg.member.voice.channel.leave();
    }

    if (msg.content.startsWith("!exit")) {
      let outbot = await msg.channel.send("ByeBye~~");
      if (outbot) client.destroy();
    }

    if (msg.content.startsWith("!restart")) {
      let outbot = await msg.channel.send("restarting...");
      if (outbot) client.destroy();
      client.login(TOKEN);
    }

    if (msg.content.startsWith("?")) {
      let user_msg = msg.content.replace("?", "");
      let reply = await deepbot.Response(user_msg);
      console.log(reply);
      if (reply.answers.length === 0) return msg.reply("아직 모르는 말이야");
      return msg.reply(reply.answers[0].answer);
    }
  } catch (error) {
    console.log(error);
  }
});

client.login(TOKEN);



// const manager = new NlpManager({ languages: ['en', 'ko'], forceNER: true });
// // Adds the utterances and intents for the NLP
// manager.addDocument('en', 'goodbye for now', 'greetings.bye');
// manager.addDocument('en', 'bye bye take care', 'greetings.bye');
// manager.addDocument('en', 'okay see you later', 'greetings.bye');
// manager.addDocument('en', 'bye for now', 'greetings.bye');
// manager.addDocument('en', 'i must go', 'greetings.bye');
// manager.addDocument('en', 'hello', 'greetings.hello');
// manager.addDocument('en', 'hi', 'greetings.hello');
// manager.addDocument('en', 'howdy', 'greetings.hello');
// manager.addDocument('ko', '메롱', '메롱이.메롱');
// manager.addDocument('ko', '똥개', '똥개.똥');
// manager.addDocument('ko', '서재용', '재용.서');
// manager.addDocument('ko', '재용', '재용.서');
// 
// // Train also the NLG
// manager.addAnswer('en', 'greetings.bye', 'Till next time');
// manager.addAnswer('en', 'greetings.bye', 'see you soon!');
// manager.addAnswer('en', 'greetings.hello', 'Hey there!');
// manager.addAnswer('en', 'greetings.hello', 'Greetings!');
// manager.addAnswer('ko', '메롱이.메롱', '바보해삼멍개말미장');
// manager.addAnswer('ko', '똥개.똥', '개똥아똥쌋니아니요');
// manager.addAnswer('ko', '재용.서', '안졸려요');
// manager.addAnswer('ko', '재용.서', '안잘거에요');
// manager.addAnswer('ko', '재용.서', '멀쩡해요');
// manager.addAnswer('ko', '재용.서', '깨어있어요');
// manager.addAnswer('ko', '재용.서', 'zZ');
// 
// 
// 
// // Train and save the model.
// (async() => {
//     await manager.train();
//     manager.save();
//     const response = await manager.process('ko', '재용');
//     console.log(response);
// })();


app.listen(8081, () => {
  console.log('띠용');
})