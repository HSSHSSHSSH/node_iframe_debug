const express = require('../../express');
const app = express();

// 中间件设置
app.use(express.json()); // 用于解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 用于解析 URL-encoded 请求体

// CORS 中间件
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    next();
});

app.use((req, res, next) => {
    console.log('中间件2');
    next();
    console.log('中间件2结束');
});

app.use((req, res, next) => {
    console.log('中间件3');
    next();
    console.log('中间件3结束');
});

// 路由处理
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>My First Page</title></head>
            <body><h1>Hello World</h1></body>
        </html>
    `);
});

app.get('/users', (req, res) => {
    res.send(`
        <html>
            <head><title>Users</title></head>
            <body><h1>Users</h1></body>
        </html>
    `);
});

app.post('/createUser', (req, res) => {
    // 在 express 中，req.body 可通过 express.json() 获取，不需要手动解析
    console.log('请求体:', req.body);
    // const body = []
    // req.on('data', (chunk) => {
    //     body.push(chunk)
    //     console.log('接收到的数据:', chunk.toString());
    // });
    // req.on('end', () => {
    //     const parsedBody = Buffer.concat(body).toString();
    //     console.log('解析后的数据:', parsedBody);
    //     res.send({ message: '用户创建成功' });
    // });
});
// 一个链式调用的示例
app.get('/chain', (req, res) => {
    console.log('get 链式调用成功');
    res.send({ message: 'get 链式调用成功' });
}).post('/chain', (req, res) => {
    console.log('post 链式调用成功');
    res.send({ message: 'post 链式调用成功' });
}).put('/chain', (req, res) => {
    console.log('put 链式调用成功');
    res.send({ message: 'put 链式调用成功' });
}).delete('/chain', (req, res) => {
    console.log('delete 链式调用成功');
    res.send({ message: 'delete 链式调用成功' });
});

// 处理其他路由
app.use((req, res) => {
    res.send(`
        <html>
            <head><title>My First Page</title></head>
            <body><h1>无对应路由</h1></body>
        </html>
    `);
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});
