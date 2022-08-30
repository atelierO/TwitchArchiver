# TwitchArchiver[BETA] ![apm](https://img.shields.io/apm/l/vim-mode.svg)
- Twitch channel archive automatic downloader. Project is now developing and you can access beta version   

- 트위치 채널에 올라오는 아카이브 영상을 자동으로 다운받습니다. 현재 개발중이며 베타 버전을 사용할 수 있습니다   

Usage
---
<img src="https://cdn.discordapp.com/attachments/987651683687481394/1014166255349026916/ex2.png" width="800"/><br>
1. Write channel name in blank "Channel Name" and click Apply button
2. Turn on the "OFF" button to "ON" then it checks archive videos whether newly updated and download archive videos
3. You can check videos to download and downloaded
4. Subscriber only videos archive downloading is now developing...   

<br>

1. Channel Name칸에 다운받을 채널의 이름을 입력 후 apply 버튼 클릭
2. OFF상태의 버튼을 ON으로 바꾸면 서버가 켜져있는 한 24시간에 한번씩 해당 채널의 새로운 아카이브를 확인해 다운받는다
3. 리스트에는 현재 다운받고 있는 영상과 앞으로 다운받을 영상 확인 가능
4. 구독자 전용 아카이브는 아직 개발중...


Preview
---
![](https://cdn.discordapp.com/attachments/987651683687481394/1014167564378718350/ex1.gif)   

Docker
---
[[TwitchArchiver for docker](https://hub.docker.com/r/beatheat/twitch-archiver)]   
This project is written by python:3.8.10 debian linux version of docker. You can check version and install with link above.   

이 프로젝트는 도커의 python:3.8.10 debian linux 버전을 이용해 작성했습니다. 위 링크를 통해 버전 확인 및 도커 설치가 가능합니다.   

### Docker Run
```
sudo docker run -d  -p 8000:8000 -v /my_video:/download --restart=unless-stopped  beatheat/twitch-archiver
```

### Docker Compose
```
version: '3'
name : twitch-archiver
services:
  app:
    image: beatheat/twitch-archiver
    ports:
      - (your port here):8000
    volumes:
      - (your volume here):/download
    restart: unless-stopped
```
### Port
inner server port : 8000      
내부 서버 포트 : 8000
### Volume
/download : directory for videos downloaded    
/download : 비디오가 다운로드 될 경로


Things still to be done
---
- 채널 incomplete 메타데이터가 트위치 서버의 정보보다 오래되었을때 해당 데이터 삭제
- OAuth 조사 및 expire될 가능성 고려
- OFF 클릭시 화면 리프레쉬
- NAS말고 일반 PC 클라용 개발

Reference
---
- Downloads videos by TwitchDonwloaderCLI 1.40.7 of lay295 (https://github.com/lay295/TwitchDownloader)   
- lay295님의 TwitchDownloaderCLI 1.40.7을 이용하여 영상을 다운받습니다. (https://github.com/lay295/TwitchDownloader)   


