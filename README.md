## Streaming Website  

### Setup Instructions  

#### 1. Configure the API  
- Navigate to the `/api/rest` directory.  
- Create a `.env` file based on `.env.sample`.  

#### 2. Configure the Website  
- Navigate to the `/website` directory.  
- Create a `.env.local` file based on `.env.local.sample`.  

#### 3. Set Up Authentication  
To enable authentication via Facebook or Google:  
- Obtain the necessary API keys from:  
  - **Google:** [Google Cloud Console](https://console.cloud.google.com/)  
  - **Facebook:** [Facebook Developers](https://developers.facebook.com/)  
- Add these keys to the `.env` files.  

#### 4. Start the Application  
Run this command to build and start the application:  
```sh
docker compose up --build
```
### How It Works  

Streaming flow:  

**WebRTC → FFmpeg → RTMP → Media Server → HLS**  

1. Clients transmit video and audio data to the ingest container using the **WebRTC** protocol.  
2. Inside the ingest container, RTP packets are forwarded to **FFmpeg**.  
3. FFmpeg encodes the stream and sends it to the media server via the **RTMP** protocol.  
4. Other clients can access the stream through the media server using the **HLS** protocol.

Reason:

Media server doesn't support webrtc input only rtmp protocol. An ingest server is needed to handle webrtc input and output rtmp.

### How it looks
Stream creation:

![image](https://github.com/user-attachments/assets/11fc0595-8ecb-4e1a-8f12-e4bfbfeebf01)

Streaming site:

![image](https://github.com/user-attachments/assets/f80980d0-41c9-4be4-998e-89d207c889c8)

Browse site:

![image](https://github.com/user-attachments/assets/8eb439f2-e517-47b1-baff-fd948cdd69e8)

Chosen stream site:

![image](https://github.com/user-attachments/assets/829a1ad2-3011-41d2-b348-a93162dfde34)



