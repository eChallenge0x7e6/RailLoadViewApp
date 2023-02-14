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