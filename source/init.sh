 #!/bin/sh
wget -N https://github.com/lay295/TwitchDownloader/releases/download/1.40.7/TwitchDownloaderCLI-Linux-x64.zip
unzip -o TwitchDownloaderCLI-Linux-x64.zip
rm TwitchDownloaderCLI-Linux-x64.zip
chmod +x TwitchDownloaderCLI
(./TwitchDownloaderCLI  --download-ffmpeg || true)

tc qdisc add dev eth0 handle 1: ingress
tc filter add dev eth0 parent 1: protocol ip prio 50 u32 match ip src 0.0.0.0/0 police rate 1mbit burst 10k drop flowid :1
tc qdisc add dev eth0 root tbf rate 1mbit latency 25ms burst 10k
