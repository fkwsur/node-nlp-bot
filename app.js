const express = require('express');
const app = express();
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en', 'ko'], forceNER: true });
// Adds the utterances and intents for the NLP
manager.addDocument('en', 'goodbye for now', 'greetings.bye');
manager.addDocument('en', 'bye bye take care', 'greetings.bye');
manager.addDocument('en', 'okay see you later', 'greetings.bye');
manager.addDocument('en', 'bye for now', 'greetings.bye');
manager.addDocument('en', 'i must go', 'greetings.bye');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'howdy', 'greetings.hello');
manager.addDocument('ko', '메롱', '메롱이.메롱');
manager.addDocument('ko', '똥개', '똥개.똥');
manager.addDocument('ko', '서재용', '재용.서');
manager.addDocument('ko', '재용', '재용.서');

// Train also the NLG
manager.addAnswer('en', 'greetings.bye', 'Till next time');
manager.addAnswer('en', 'greetings.bye', 'see you soon!');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Greetings!');
manager.addAnswer('ko', '메롱이.메롱', '바보해삼멍개말미장');
manager.addAnswer('ko', '똥개.똥', '개똥아똥쌋니아니요');
manager.addAnswer('ko', '재용.서', '안졸려요');
manager.addAnswer('ko', '재용.서', '안잘거에요');
manager.addAnswer('ko', '재용.서', '멀쩡해요');
manager.addAnswer('ko', '재용.서', '깨어있어요');
manager.addAnswer('ko', '재용.서', 'zZ');

// Train and save the model.
(async() => {
    await manager.train();
    manager.save();
    const response = await manager.process('ko', '재용');
    console.log(response);
})();


app.listen(8081, () => {
  console.log('띠용');
})