# TwitchArchiver
Twitch channel archive automatic downloader
트위치 채널에 올라오는 아카이브 영상을 자동으로 다운받습니다

now developing and you can access beta version
현재 개발중이며 베타 버전을 사용할 수 있습니다

Usage
---



docker
---
[TwitchArchiver for docker](https://hub.docker.com/r/beatheat/twitch-archiver)
This project is written by python:3.8.10 of docker 
You can check version and install with link above

이 프로젝트는 도커의 python:3.8.10 버전을 이용해 작성했습니다.
위 링크를 통해 버전 확인 및 도커 설치가 가능합니다.

docker 서버는 8000번 포트를 이용하면 된다.
/download 폴더를 바인드 

Things still to be done
---
- 채널 incomplete 메타데이터가 트위치 서버의 정보보다 오래되었을때 해당 데이터 삭제
- OAuth 조사 및 expire될 가능성 고려
- OFF 클릭시 화면 리프레쉬

Reference
---
Downloads videos by TwitchDonwloaderCLI 1.40.7 of lay295 (https://github.com/lay295/TwitchDownloader)
lay295님의 TwitchDownloaderCLI 1.40.7을 이용하여 영상을 다운받습니다. (https://github.com/lay295/TwitchDownloader)