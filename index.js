const express = require('express');
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
    // this will open index.html in browser as response
    console.log('index file ', __dirname + '/index.html');
    res.sendFile(__dirname + '/index.html');
});

app.get('/video', (req, res) => {
    // this api is been called from the index.html which is been open in browser
    const range = req.headers.range;
    if (!range) {
        res.status(400).send({ message: 'Request Range in header' });
    }
    // getting the video and size
    const videosrc = '⁯samplevideo.mp4';
    const videosize = fs.statSync(videosrc).size;
    // parse range
    // create start and end
    const CHUNK = 10 ** 6;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK, videosize - 1);

    const contentSize = start - end + 1;
    console.log('videosize', videosize, contentSize, start, end);
    // create header
    const header = {
        'Content-Range': `bytes ${start}-${end}/${videosize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentSize,
        'Content-Type': 'video/mp4'
    };
    // this will return 206 header in browser as it partical content
    res.writeHead(206, header);
    // videostream create and videosrc and send with pipe
    const videoStream = fs.createReadStream(videosrc, { start, end });
    videoStream.pipe(res);
});

app.listen(3000, () => {
    console.log(`server was running`);
});
