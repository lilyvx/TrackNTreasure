//centralized ws service connection for the app

let wsClient: WebSocket | null = null; //union websocket/null init to null when first bootup 

export const connectWebSocket = ( 
    userId: number, onMessageReceived: (data:any) => void
): WebSocket => { //rt websocket 
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        return wsClient;
    } //check status 


    if (wsClient) {
        try { wsClient.close(); } catch (e) {}
    }

    const SERVER_URL = 'ws://10.0.2.2:8080';
    console.log(`Trying to connect to WebSocket server at ${SERVER_URL}`);
    wsClient = new WebSocket(`${SERVER_URL}`);

    wsClient.onmessage = (event) => {
    try {
        const parsedData = JSON.parse(event.data);
        onMessageReceived(parsedData);
        } catch (error) {
        console.error('[FAILED] Error parsing incoming package:', error);
        }
    };

    wsClient.onclose = () => {
    console.log('[DISCONNECTED] Disconnected from server. Reconnecting...');
    wsClient = null; //resetting instance variable to prevent stacking loops
    //reconnect logic loop
    setTimeout(() => connectWebSocket(userId, onMessageReceived), 5000);
  };

  return wsClient; };



export const sendTransactionEvent = (type: 'TRANSACTION_ADDED' | 'TRANSACTION_DELETED', payload: any) => { //type variable
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    const dataPackage = {
      type,
      timestamp: new Date().toISOString(),
      payload
    };

    wsClient.send(JSON.stringify(dataPackage));
  } 
  else {
    console.warn('WebSocket connection is offline.');
  }
};