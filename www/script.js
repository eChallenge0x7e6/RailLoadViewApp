async function onConnectButtonClick()
{
	try {
		port = await navigator.serial.requestPort();
		await port.open({ baudRate: 115200 });

		while (port.readable) {
			addSerial("Opened\n");
			document.getElementById('btnSend').disabled = null;
			const reader = port.readable.getReader();
			try {
				while (true) {
					const { value, done } = await reader.read();
					if (done) {
						addSerial("Canceled\n");
						break;
						}
					const inputValue = new TextDecoder().decode(value);
					addSerial(inputValue);
					}
			} catch (error) {
				addSerial("Error: Read" + error + "\n");
			} finally {
				reader.releaseLock();
				document.getElementById('btnSend').disabled = "disabled";
			}
		}
	} catch (error) {
		addSerial("Error: Open" + error + "\n");
	}
}

function addSerial(msg)
{
	var textarea = document.getElementById('receivedTxt');
	textarea.value += msg;
	textarea.scrollTop = textarea.scrollHeight;
}

async function sendSerial()
{
	var text = document.getElementById('sendTxt').value;
	document.getElementById('sendTxt').value = "";

	const encoder = new TextEncoder();
	const writer = port.writable.getWriter();
	await writer.write(encoder.encode(text + "\n"));
	writer.releaseLock();
}

let elImg = new Image();
elImg.src = "./img/panel.png";

function dragstart_handler(ev) {
	// 対象となる要素の id を DataTransfer オブジェクトに追加する
	ev.dataTransfer.effectAllowed = "move";
	ev.dataTransfer.setData("application/my-app", ev.target);
	console.log(ev.target);
	ev.dataTransfer.setDragImage(elImg,0,0);
	console.log("Drag!!!!!!!!!!!!");
}
function dragover_handler(ev) {
	ev.preventDefault();
	//ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev) {
	ev.preventDefault();
	// 移動された要素の id を取得して、その要素を target の DOM に追加する
	const data = ev.dataTransfer.getData("application/my-app");
	ev.target.appendChild(data);
	console.log("Drop##########");
}

window.addEventListener("DOMContentLoaded", () => {
	// Get the element by id
	const elements = document.getElementsByClassName("parts");
	// Add the ondragstart event listener
	for(let i=0; i<elements.length; i++){
		elements[i].setAttribute("draggable","true");
		elements[i].ondragstart = dragstart_handler;
		//elements[i].addEventListener("dragstart", function ( event ) { event.dataTransfer.setData( "text", "SYNCER" ) ; });
		//console.log(elements[i]);
	}
	const field = document.getElementById("fieldArea");
	field.addEventListener("dragover", dragover_handler);
	field.addEventListener("drop", drop_handler);
});