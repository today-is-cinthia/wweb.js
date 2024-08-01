const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

client.on('qr', qr => {
    console.log('QR received, scan please!');
    qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
    console.log('Client is ready!');
    
    const info = await client.info;
    console.log(`Bot is running on number: ${info.wid.user}`);
});

client.on('message', message => {
    console.log(`Received message: ${message.body}`);
    if (message.body.toLowerCase() == 'ping') {
        message.reply('pong').then(() => {
            console.log('Replied with pong');
        }).catch(err => {
            console.error('Error replying with pong:', err);
        });
    }
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', reason => {
    console.log('Client was logged out', reason);
});

client.initialize();
