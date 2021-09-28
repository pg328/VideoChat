
let headersList = {
	"Accept": "*/*",
	"User-Agent": "Thunder Client (https://www.thunderclient.io)",
	"Content-Type": "application/json"
}
   

export const sendMessageAPI = (callId, messageContent) => {
	fetch("https://forgechat-server-production.up.railway.app/newMessage",{
		method: "POST",
		body: JSON.stringify({content:messageContent, hash:callId,  }),
		headers: headersList
	}).then((response) => {
		console.warn(callId)
		return response.text();
	})
}


export const getMessagesAPI = () => 
	fetch("https://forgechat-server-production.up.railway.app").then((response) => {
		return response.json();
	})
