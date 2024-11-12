const path = require('path');
const { spawn } = require('child_process');
const chokidar = require('chokidar');

// 运行的文件
const expressBinPath = path.resolve(__dirname, './express.js');
// 监听的文件
const expressDistPath = path.resolve(__dirname, '../../express/lib');
const routerPath = path.resolve(__dirname, '../../router');

let workProcess = null;

// 添加延迟函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 修改为异步函数
async function start() {
  if (workProcess) {
    workProcess.kill();
    // 添加 1 秒延迟，确保端口被释放
    await delay(1000);
  }
  console.log('启动 express...');
  workProcess = spawn('node', [expressBinPath], { stdio: 'inherit' });
}

const targets = [expressDistPath, routerPath];
function watchDist() {
  const watcher = chokidar.watch(targets, {
    ignored: /(^|[\/\\])\../, // 忽略隐藏文件
    persistent: true,
    filter: (path) => path.endsWith('.js') // 只监听 .js 结尾的文件
  });

  watcher.on('change', async (path) => {
    console.log(`检测到文件变化: ${path}`);
    await start();  // 使用 await 等待启动完成
  });

  console.log(`正在监听 ${targets.join(', ')} 的变化...`);
}

// 修改为异步调用
(async () => {
  await start();
  watchDist();
})();

process.on('SIGINT', () => {
  if (workProcess) {
    workProcess.kill();
  }
  process.exit();
})