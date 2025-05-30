---
title: Base Media Library
---

# Media Library

Base includes a robust Media Library for application-wide storage of media files. This documentation covers how to use the Media Library in your Base applications.

## Media Library

The Media Library provides a centralized system for managing media files (images, videos, documents, etc.) across your entire application. It offers a complete RESTful API for uploading, retrieving, and managing media assets.

### Media API Endpoints

| Method | Endpoint            | Description              | Request Body/Params                | Response                           |
|--------|--------------------|--------------------------|-----------------------------------|------------------------------------|
| GET    | `/media`           | List media items (paginated) | Query params for pagination     | Paginated list of media items     |
| POST   | `/media`           | Upload a new media item  | File upload                       | Created media item                |
| GET    | `/media/all`       | List all media items     | -                                 | List of all media items           |
| GET    | `/media/{id}`      | Get a media item         | Media ID in URL                   | Media item details                |
| PUT    | `/media/{id}`      | Update a media item      | Media metadata                    | Updated media item                |
| DELETE | `/media/{id}`      | Delete a media item      | Media ID in URL                   | Success message                   |
| PUT    | `/media/{id}/file` | Update media file        | New file                          | Updated media item                |
| DELETE | `/media/{id}/file` | Remove media file        | Media ID in URL                   | Media item with file removed      |

### Media Library Features

- **File Uploads**: Support for various file types with validation
- **Metadata Storage**: Store and search by metadata like title, description, and tags
- **Image Transformations**: Resize, crop, and optimize images
- **Access Control**: Control who can view or modify media items
- **Integration**: Easily embed media in other parts of your application

### Basic Usage Example

#### Uploading a Media File

```html
<form id="upload-form">
  <input type="file" id="media-file" name="file">
  <input type="text" id="title" name="title" placeholder="Title">
  <input type="text" id="description" name="description" placeholder="Description">
  <button type="submit">Upload</button>
</form>

<script>
document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('file', document.getElementById('media-file').files[0]);
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  
  try {
    const response = await fetch('/api/media', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    
    const result = await response.json();
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
});
</script>
```

#### Listing Media Items

```javascript
async function getMediaItems() {
  try {
    const response = await fetch('/api/media?page=1&limit=10', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    
    const data = await response.json();
    
    // Display media items
    const mediaContainer = document.getElementById('media-container');
    data.items.forEach(item => {
      const mediaElement = document.createElement('div');
      mediaElement.className = 'media-item';
      mediaElement.innerHTML = `
        <img src="${item.url}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>${item.description || ''}</p>
      `;
      mediaContainer.appendChild(mediaElement);
    });
  } catch (error) {
    console.error('Error fetching media items:', error);
  }
}
```

## WebSocket Support

Base provides powerful WebSocket support for building real-time applications. The `/ws` endpoint enables bidirectional communication between clients and the server.

### WebSocket Features

- **Channel-based Communication**: Organize connections into logical channels
- **User Authentication**: Secure WebSocket connections with JWT tokens
- **Pub/Sub Pattern**: Publish and subscribe to events
- **Broadcast Messages**: Send messages to all connected clients
- **Direct Messaging**: Send messages to specific clients
- **Room Management**: Create and manage rooms for group communication
- **Connection Handling**: Manage connections, reconnections, and disconnections

## Conclusion

The Media Library and WebSocket support in Base provide powerful tools for building modern, interactive applications. By combining these features, you can create real-time collaborative experiences that enhance user engagement and functionality.
