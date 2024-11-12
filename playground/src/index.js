const http = require('http');


const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    console.log(url, method);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'POST','GET', 'OPTIONS');
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>My First Page</title></head>');
        res.write('<body><h1>Hello World</h1></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/users') {
        res.write('<html>');
        res.write('<head><title>Users</title></head>');
        res.write('<body><h1>Users</h1></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/createUser' && method === 'POST') {
        
        //q: req.body 是 undifined
        // a: 在 node 原生 http 模块中，并没有内置 req.body 的解析功能，所以需要手动解析请求体。
       console.log('reqqqq.body', req.body)
        const body = [];
        req.on('data', (chunk) => {
            console.log('chunk',chunk);
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log('parsedBody',parsedBody);
        });
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello World</h1></body>');
    res.write('</html>');
    return res.end();
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});