import * as signalR from "@microsoft/signalr";

// Connection map: userId -> connection
const connections = new Map<string, signalR.HubConnection>();
// Connection promises: userId -> promise
const connectionPromises = new Map<string, Promise<signalR.HubConnection>>();

const getSignalRUrl = (): string | null => {
  // Get SignalR URL from environment variable
  // For production, use HTTPS URL: https://softwareinterview.tryasp.net/chatHub
  // For development, HTTP is fine: http://localhost:5000/chatHub
  let url = process.env.NEXT_PUBLIC_SIGNALR_URL || "http://softwareinterview.tryasp.net/chatHub";
  
  if (!url) {
    return null;
  }
  
  // If we're in the browser and the page is HTTPS, but SignalR URL is HTTP,
  // we need to handle mixed content. Try to use HTTPS if available.
  if (typeof window !== "undefined") {
    const isHttps = window.location.protocol === "https:";
    const isHttpUrl = url.startsWith("http://");
    
    if (isHttps && isHttpUrl) {
      // Only convert if it's not localhost
      if (!url.includes("localhost") && !url.includes("127.0.0.1")) {
        // Try HTTPS version - if the server supports it
        const httpsUrl = url.replace("http://", "https://");
        console.warn("[SignalR] Mixed content detected. Attempting HTTPS:", httpsUrl);
        console.warn("[SignalR] For production, set NEXT_PUBLIC_SIGNALR_URL to HTTPS URL to avoid this warning");
        url = httpsUrl;
      } else {
        // For localhost, keep HTTP as it's usually fine
        console.log("[SignalR] Using HTTP for localhost (development mode)");
      }
    }
  }
  
  // Ensure URL doesn't end with /
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

/**
 * SignalR HubConnection oluşturur veya mevcut bağlantıyı döndürür
 * @param userId User ID to include in query string for backend authentication (required)
 */
export function getSignalRConnection(userId: string): signalR.HubConnection | null {
  if (!userId) {
    console.warn("[SignalR] userId is required");
    return null;
  }

  let url = getSignalRUrl();
  
  if (!url) {
    console.warn("[SignalR] SignalR URL is not configured");
    return null;
  }

  // Add userId to query string (for backend to identify user)
  const separator = url.includes("?") ? "&" : "?";
  url = `${url}${separator}userId=${encodeURIComponent(userId)}`;

  // Check if we already have a connection for this userId
  const existingConnection = connections.get(userId);
  
  if (existingConnection) {
    const state = existingConnection.state;
    // If connected or connecting, return it
    if (state === signalR.HubConnectionState.Connected || 
        state === signalR.HubConnectionState.Connecting) {
      return existingConnection;
    }
    
    // If disconnected or disconnecting, clean it up
    if (state === signalR.HubConnectionState.Disconnected || 
        state === signalR.HubConnectionState.Disconnecting) {
      try {
        existingConnection.stop().catch(() => {
          // Ignore stop errors
        });
      } catch (e) {
        // Ignore stop errors
      }
      connections.delete(userId);
    }
  }

  // Create new connection for this userId
  // Try to use Long Polling first for better compatibility (works better with mixed content)
  const transportOptions = signalR.HttpTransportType.LongPolling | signalR.HttpTransportType.ServerSentEvents;
  
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(url, {
      skipNegotiation: false,
      transport: transportOptions,
      withCredentials: true,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        // Daha az agresif retry - maksimum 5 deneme
        if (retryContext.previousRetryCount < 2) {
          return 10000; // 10 seconds
        } else if (retryContext.previousRetryCount < 4) {
          return 30000; // 30 seconds
        } else {
          // 5 denemeden sonra çok uzun bekle (5 dakika) - efektif olarak durdur
          return 300000; // 5 minutes - kullanıcı sayfayı yenilerse tekrar deneyecek
        }
      },
    })
    .configureLogging(signalR.LogLevel.Warning) // Reduce logging noise
    .build();

    connection.onreconnecting((error) => {
      console.warn(`[SignalR] 🔄 Reconnecting for user ${userId}...`, error);
    });

    connection.onreconnected((connectionId) => {
      console.log(`[SignalR] ✅ Reconnected for user ${userId}. Connection ID:`, connectionId);
    });

    connection.onclose((error) => {
      if (error) {
        console.error(`[SignalR] ❌ Connection closed with error for user ${userId}:`, error);
      } else {
        console.log(`[SignalR] Connection closed normally for user ${userId}`);
      }
      connections.delete(userId);
      connectionPromises.delete(userId);
    });

  // Store connection in map
  connections.set(userId, connection);

  return connection;
}

/**
 * SignalR bağlantısını başlatır
 * @param userId User ID to include in query string for backend authentication (required)
 */
export async function startSignalRConnection(userId: string): Promise<signalR.HubConnection | null> {
  if (!userId) {
    console.warn("[SignalR] userId is required to start connection");
    return null;
  }

  const hubConnection = getSignalRConnection(userId);
  
  if (!hubConnection) {
    console.error(`[SignalR] Failed to create connection for user ${userId}`);
    return null;
  }

  // Eğer zaten bağlıysa, direkt döndür
  if (hubConnection.state === signalR.HubConnectionState.Connected) {
    console.log(`[SignalR] Connection already established for user ${userId}`);
    return hubConnection;
  }

  // Eğer bağlanıyorsa, mevcut promise'ı bekle
  if (hubConnection.state === signalR.HubConnectionState.Connecting) {
    const existingPromise = connectionPromises.get(userId);
    if (existingPromise) {
      console.log(`[SignalR] Connection already in progress for user ${userId}, waiting...`);
      return existingPromise;
    }
  }

  // Yeni bağlantı başlat
  const existingPromise = connectionPromises.get(userId);
  if (existingPromise) {
    return existingPromise;
  }

  const connectionPromise = hubConnection.start()
    .then(() => {
      connectionPromises.delete(userId);
      console.log(`[SignalR] ✅ Connection established successfully for user ${userId}`);
      return hubConnection;
    })
    .catch((error) => {
      connectionPromises.delete(userId);
      
      // Detailed error logging
      console.error(`[SignalR] ❌ Connection failed for user ${userId}`);
      
      if (error instanceof Error) {
        console.error(`[SignalR] Error type: ${error.constructor.name}`);
        console.error(`[SignalR] Error message: ${error.message}`);
        
        // Check for specific error types
        if (error.message.includes("Failed to fetch") || error.message.includes("Failed to complete negotiation")) {
          console.error(`[SignalR] 🔍 This usually indicates:`);
          console.error(`[SignalR]   1. CORS issue - check backend CORS configuration`);
          console.error(`[SignalR]   2. Network connectivity issue`);
          console.error(`[SignalR]   3. Mixed content (HTTP/HTTPS mismatch)`);
          console.error(`[SignalR]   4. SignalR server is not accessible`);
          console.error(`[SignalR] 💡 Solution: Ensure NEXT_PUBLIC_SIGNALR_URL is correct and backend CORS allows your origin`);
        }
        
        if (error.stack) {
          console.error(`[SignalR] Error stack:`, error.stack);
        }
      } else {
        console.error(`[SignalR] Unknown error type:`, error);
      }
      
      // Remove connection from map on failure so it can be retried
      connections.delete(userId);
      throw error;
    });

  connectionPromises.set(userId, connectionPromise);
  return connectionPromise;
}

/**
 * SignalR bağlantısını durdurur
 * @param userId User ID whose connection should be stopped (optional, stops all if not provided)
 */
export async function stopSignalRConnection(userId?: string): Promise<void> {
  if (userId) {
    // Stop specific user's connection
    const connection = connections.get(userId);
    if (connection) {
      try {
        await connection.stop();
        connections.delete(userId);
        connectionPromises.delete(userId);
        console.log(`[SignalR] Connection stopped for user ${userId}`);
      } catch (error) {
        console.error(`[SignalR] Error stopping connection for user ${userId}:`, error);
        connections.delete(userId);
        connectionPromises.delete(userId);
      }
    }
  } else {
    // Stop all connections
    const stopPromises = Array.from(connections.entries()).map(async ([uid, conn]) => {
      try {
        await conn.stop();
        console.log(`[SignalR] Connection stopped for user ${uid}`);
      } catch (error) {
        console.error(`[SignalR] Error stopping connection for user ${uid}:`, error);
      }
    });
    
    await Promise.all(stopPromises);
    connections.clear();
    connectionPromises.clear();
  }
}

/**
 * SignalR bağlantısının durumunu kontrol eder
 * @param userId User ID to check connection status for (optional, checks any connection if not provided)
 */
export function isSignalRConnected(userId?: string): boolean {
  if (userId) {
    const connection = connections.get(userId);
    return connection?.state === signalR.HubConnectionState.Connected;
  }
  
  // Check if any connection is connected
  return Array.from(connections.values()).some(
    conn => conn.state === signalR.HubConnectionState.Connected
  );
}

/**
 * Bağlantının Connected durumuna geçmesini bekler
 * @param connection SignalR HubConnection
 * @param timeout Maximum wait time in milliseconds (default: 5000ms)
 * @returns Promise that resolves when connected or rejects on timeout
 */
export async function waitForConnection(
  connection: signalR.HubConnection,
  timeout: number = 5000
): Promise<void> {
  if (connection.state === signalR.HubConnectionState.Connected) {
    return;
  }

  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      if (connection.state === signalR.HubConnectionState.Connected) {
        clearInterval(checkInterval);
        resolve();
        return;
      }
      
      if (elapsed >= timeout) {
        clearInterval(checkInterval);
        reject(new Error(`Connection timeout: state is ${connection.state} after ${timeout}ms`));
        return;
      }
      
      // If connection is disconnecting or disconnected, reject immediately
      if (
        connection.state === signalR.HubConnectionState.Disconnected ||
        connection.state === signalR.HubConnectionState.Disconnecting
      ) {
        clearInterval(checkInterval);
        reject(new Error(`Connection failed: state is ${connection.state}`));
        return;
      }
    }, 100); // Check every 100ms
  });
}

/**
 * Bağlantının Connected durumunda olduğunu garantiler
 * @param connection SignalR HubConnection
 * @returns Promise that resolves when connected
 */
export async function ensureConnected(connection: signalR.HubConnection): Promise<void> {
  if (connection.state === signalR.HubConnectionState.Connected) {
    return;
  }

  // If connecting, wait for it
  if (connection.state === signalR.HubConnectionState.Connecting) {
    await waitForConnection(connection, 5000);
    return;
  }

  // If disconnected, try to start
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await connection.start();
      await waitForConnection(connection, 5000);
      return;
    } catch (error) {
      throw new Error(`Failed to start connection: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  throw new Error(`Cannot ensure connection: invalid state ${connection.state}`);
}

