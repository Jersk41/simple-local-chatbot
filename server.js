const express = require('express');
const cors = require('cors');
const ollama = require('ollama').default;
const app = express();
const port = 3000;

const chatLog = require('./history');

app.use(cors())
app.use(express.json());
app.use(express.static('./public'))

// app.get('/', (req, res) => {
//     console.log(model);
//     res.status(200).json('Api is working');
// });

app.post('/status', (req, res) => {
    console.log(model);
    res.status(200).json('Model is running')
});

app.post('/chat', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-open');
    
    const message = {
        role: 'user',
        content: req.body.prompt
    }

    chatLog.add(message);

    const response = await ollama.chat({
        model: 'llama2',
        messages: chatLog.get(),
        stream: true,
    });
    let responseContent = '';

    try {
        for await(const part of response){
            let content = part.message.content;
            responseContent += content;

            res.write(JSON.stringify({
                done: false,
                response: content
            }));
        }
        res.end();
    } catch (error) {
        console.error('Chat error: ',error);
        res.status(500).json({
            error: 'Internal Server Error',
            trace: error.toString()
        })
        
    }
});

app.listen(port, () => {
    console.log(`Express server listening on port: ${port}...`);
});