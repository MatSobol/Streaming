export GO111MODULE=on


ffmpeg -protocol_whitelist file,udp,rtp -i rtp-forwarder.sdp -c:v libx264 -preset veryfast -b:v 3000k -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv output.mp4

ffmpeg -protocol_whitelist file,udp,rtp -i rtp-forwarder.sdp -c:v libx264 -preset veryfast -b:v 3000k -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost:1935/live/hello

ffmpeg -protocol_whitelist file,udp,rtp -i rtp-forwarder.sdp -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" -c:v libx264 -preset veryfast -b:v 3000k -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv output.mkv
