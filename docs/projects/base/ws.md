---
title: Base WebSocket System
---

# WebSocket System

Base provides powerful WebSocket support for building real-time applications. The `/ws` endpoint enables bidirectional communication between clients and the server.

## WebSocket Features

- **Channel-based Communication**: Organize connections into logical channels
- **User Authentication**: Secure WebSocket connections with JWT tokens
- **Pub/Sub Pattern**: Publish and subscribe to events
- **Broadcast Messages**: Send messages to all connected clients
- **Direct Messaging**: Send messages to specific clients
- **Room Management**: Create and manage rooms for group communication
- **Connection Handling**: Manage connections, reconnections, and disconnections

## WebSocket Endpoint

| Method | Endpoint | Description          | Query Parameters                         | 
|--------|----------|----------------------|------------------------------------------|
| GET    | `/ws`    | WebSocket connection | `channel`: Channel name (optional)<br>`token`: JWT token for authentication |

### WebSocket Example Applications

Base includes several example applications demonstrating WebSocket functionality in the `/static` directory:

#### Chat Application

A multi-room chat application that demonstrates:
- User authentication
- Room creation and management
- Real-time messaging
- User presence

```html
<!-- HTML Structure (from chat.html) -->
<div class="container">
    <div class="sidebar">
        <h3>Rooms</h3>
        <ul id="room-list"></ul>
        <input type="text" id="new-room" placeholder="New room name">
        <button id="create-room">Create Room</button>
    </div>
    <div class="main-content">
        <div id="chat-box"></div>
        <div class="input-container">
            <input type="text" id="message-input" placeholder="Type a message...">
            <button id="send-button">Send</button>
        </div>
    </div>
</div>

<!-- JavaScript for WebSocket Connection -->
<script>
let socket;
let currentRoom = 'general';
const nickname = localStorage.getItem('nickname') || 'Guest' + Math.floor(Math.random() * 1000);

function connect() {
    // Close any existing connections
    if (socket) {
        socket.close();
    }

    // Create a new WebSocket connection with the current room
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/api/ws?channel=${currentRoom}&nickname=${encodeURIComponent(nickname)}`;
    
    socket = new WebSocket(wsUrl);
    
    socket.onopen = function() {
        updateStatus('Connected');
        document.getElementById('connection-status').classList.add('connected');
    };
    
    socket.onclose = function() {
        updateStatus('Disconnected');
        document.getElementById('connection-status').classList.remove('connected');
        
        // Attempt to reconnect after a delay
        setTimeout(connect, 3000);
    };
    
    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
        updateStatus('Error connecting');
    };
    
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
            appendMessage(data.content, data.nickname);
        } else if (data.type === 'system') {
            appendMessage(data.content, 'System', true);
        } else if (data.type === 'rooms') {
            // Update room list
            const rooms = data.rooms;
            const roomListEl = document.getElementById('room-list');
            roomListEl.innerHTML = '';
            
            rooms.forEach(room => {
                addRoom(room);
            });
        }
    };
}

function sendMessage(message) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const data = {
            type: 'message',
            content: message,
            room: currentRoom,
            nickname: nickname
        };
        socket.send(JSON.stringify(data));
        return true;
    }
    return false;
}
</script>
```

#### Collaborative Drawing Board

The drawing board demonstrates:
- Real-time collaboration
- Event broadcasting
- Canvas synchronization

#### Real-time Editor

The collaborative editor shows:
- Document synchronization
- Conflict resolution
- Cursor positioning

#### Kanban Board

The Kanban board example demonstrates:
- Drag and drop synchronization
- State management
- Real-time updates

#### System Monitor

The system monitor shows:
- Server metrics in real-time
- Time-series data visualization
- Alerts and notifications

### Implementing WebSocket Server-side

On the server side, Base provides a simple API for managing WebSocket connections:

```go
// In your module's initialization
import "base/core/ws"

// Create a WebSocket handler
func (m *MyModule) SetupWebSocket() {
    // Create a channel manager
    channelManager := ws.NewChannelManager()
    
    // Register a channel
    chatChannel := channelManager.RegisterChannel("chat")
    
    // Handle new connections
    chatChannel.OnConnect(func(client *ws.Client) {
        // Send welcome message
        client.Send(map[string]interface{}{
            "type": "system",
            "content": "Welcome to the chat!",
        })
        
        // Broadcast join notification
        chatChannel.Broadcast(map[string]interface{}{
            "type": "system",
            "content": client.GetAttr("nickname") + " has joined the chat",
        }, client.ID) // Exclude the joining client
    })
    
    // Handle messages
    chatChannel.OnMessage(func(client *ws.Client, message []byte) {
        // Parse message
        var data map[string]interface{}
        if err := json.Unmarshal(message, &data); err != nil {
            return
        }
        
        // Handle different message types
        switch data["type"].(string) {
        case "message":
            // Add the sender's nickname
            data["nickname"] = client.GetAttr("nickname")
            
            // Broadcast to all clients in the channel
            chatChannel.Broadcast(data, "")
        
        case "private":
            // Send to specific client
            targetClientID := data["target"].(string)
            chatChannel.SendTo(targetClientID, data)
        }
    })
    
    // Handle disconnections
    chatChannel.OnDisconnect(func(client *ws.Client) {
        chatChannel.Broadcast(map[string]interface{}{
            "type": "system",
            "content": client.GetAttr("nickname") + " has left the chat",
        }, "")
    })
}
```

## Combining Media Library and WebSockets

These features can be combined to create powerful interactive applications:

### Real-time Media Gallery

```javascript
// Listen for new media uploads via WebSocket
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'new_media') {
        // Add new media item to the gallery without page refresh
        addMediaToGallery(data.media);
    }
};

// Function to add media to gallery
function addMediaToGallery(media) {
    const galleryEl = document.getElementById('media-gallery');
    const mediaEl = document.createElement('div');
    mediaEl.className = 'media-item';
    mediaEl.innerHTML = `
        <img src="${media.url}" alt="${media.title}">
        <h3>${media.title}</h3>
        <p>${media.description || ''}</p>
    `;
    galleryEl.prepend(mediaEl);
}
```

### Collaborative Media Editor

```javascript
// When a user edits media metadata
function updateMediaMetadata(mediaId, metadata) {
    // Update via API
    fetch(`/api/media/${mediaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(metadata)
    }).then(response => response.json())
      .then(updatedMedia => {
          // Notify other users via WebSocket
          socket.send(JSON.stringify({
              type: 'media_updated',
              mediaId: mediaId,
              metadata: metadata
          }));
      });
}
```
