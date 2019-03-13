const SerialPort = require('serialport');
// Timeout to test things
const timeout = ms => new Promise(res => setTimeout(res, ms));

const device = "/dev/ttyACM0";
const resetdevice = Buffer.from([0x4D,0x00,0x00,0x01,0xff]);
const pingdevice = Buffer.from([0x4D,0x00,0x00,0x01,0x80]);
const startSequence = Buffer.from([0x4D,0x00,0x00,0x01,0xfa]);
const stopSequence = Buffer.from([0x4D,0x00,0x00,0x01,0xfc]);
// https://github.com/SammyIAm/Moppy2/wiki/Design-Docs
// StartMsg,DeviceAdr,SubAdr,Length,Command, Payload
//    0x4D ,  0x01   , 0x01 , 0x03 ,  0x09 ,0x30 0x01
//const playnode = Buffer.from([0x4D,0x01,0x01,0x03,0x09,0x30,0x01]);
let maxsubdevice = 0;
let startsubdevice = 0;
 
const init = async () => {
	//let buf = Buffer.from([0x4D,0x00,0x00,0x03,0x81,0x01,0x05]);
	let buf = Buffer.from([0x4D,0x00,0x00,0x01,0x80]);
	console.log(buf);
	console.log()
	
	const port = new SerialPort(device, {baudRate: 57600});
	
	port.on('open', async () => {
		console.log("Open")
		await timeout(5000); // Time to start arduino device
		port.write(pingdevice);
	});

	port.on('data', async(data) => {
		let dataArr = Array.prototype.slice.call(data, 0);
		console.log("get data:")
		console.log(dataArr)
		if(dataArr[4] == 129) // got Pong with start and max subdevice
		{
			startsubdevice = dataArr[5];
			maxsubdevice = dataArr[6];
		}
		/*
		port.write(Buffer.from([0x4D,0x01,0x01,0x03,0x09,0x30,0x01]));
		await timeout(2000);
		port.write(Buffer.from([0x4D,0x01,0x01,0x02,0x08,0x30]));
		port.write(Buffer.from([0x4D,0x01,0x03,0x03,0x09,0x40,0x01]));
		await timeout(500);
		port.write(Buffer.from([0x4D,0x01,0x04,0x03,0x09,0x40,0x01]));
		await timeout(500);
		port.write(Buffer.from([0x4D,0x01,0x05,0x03,0x09,0x40,0x01]));
		*/
	});

	port.on('error', (er) => {
		//console.log(er)
	});

	port.on('close', () => {
		console.log("close")
	});

};

init();