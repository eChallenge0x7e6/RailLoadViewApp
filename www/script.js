let port;
let elImg = new Image();
elImg.src = "./img/panel.png";

function getRailInfo(){
	sendSerial("@I");
}
function getSensInfo(){
	sendSerial("@S");
}
function setReset(){
	sendSerial("@R");
}
function setParam(){
	var data = "@P";
	data += 0x40;	//address
	data += [0x00, 0x00, 0x00, 0x00, 0x00, 0x00];	//parameter 
	sendSerial(data);
}

async function onConnectButtonClick()
{
	try {
		port = await navigator.serial.requestPort();
		await port.open({ baudRate: 115200 });

		while (port.readable) {
			readSerial("Opened\n");
			document.getElementsByClassName('btnFunc').disabled = null;
			const reader = port.readable.getReader();
			try {
				while (true) {
					const { value, done } = await reader.read();
					if (done) {
						readSerial("Canceled\n");
						break;
					} else {
						const inputValue = new TextDecoder().decode(value);
						readSerial(inputValue);
					}
				}
			} catch (error) {
				readSerial("Error: Read" + error + "\n");
			} finally {
				reader.releaseLock();
				document.getElementsByClassName('btnFunc').disabled = "disabled";
			}
		}
	} catch (error) {
		readSerial("Error: Open" + error + "\n");
	}
}
function readSerial(msg)
{
	var textarea = document.getElementById('receivedTxt');
	textarea.value += msg;
	textarea.scrollTop = textarea.scrollHeight;
}
async function onSendButtonClick()
{
	var text = document.getElementById('sendTxt').value;
	document.getElementById('sendTxt').value = "";
	sendSerial(text);
}
async function sendSerial(data)
{
	const encoder = new TextEncoder();
	const writer = port.writable.getWriter();
	await writer.write(encoder.encode(data));
	writer.releaseLock();
}
function dragstart_handler(ev) {
	// 対象となる要素の id を DataTransfer オブジェクトに追加する
	ev.dataTransfer.effectAllowed = "move";
	ev.dataTransfer.setData("application/my-app", ev.target);
	console.log(ev);
	ev.dataTransfer.setDragImage(elImg,0,0);
	console.log("Drag!!!!!!!!!!!!");
}
function dragover_handler(ev) {
	ev.preventDefault();
	ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev) {
	ev.preventDefault();
	// 移動された要素の id を取得して、その要素を target の DOM に追加する
	const data = ev.dataTransfer.getData("application/my-app");
	//ev.target.appendChild('<div>Drop</div>');
	console.log("Drop##########");
}

window.addEventListener("DOMContentLoaded", () => {
	const elements = document.getElementsByClassName("parts");
	for(let i=0; i<elements.length; i++){
		elements[i].setAttribute("draggable","true");
		elements[i].ondragstart = dragstart_handler;
	}
	const field = document.getElementById("fieldArea");
	field.ondragover = dragover_handler;
	field.ondrop = drop_handler;

	setInterval(getRailInfo, 1000);
});