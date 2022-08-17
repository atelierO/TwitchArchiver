
apt update && apt upgrade -y
apt-get update

#python dependencies 설치
apt-get install python3-pip -y
pip install --upgrade pip
pip install django
pip install selenium
pip install requests

# 크롬설치
apt-get install wget -y
apt-get install curl -y
apt-get install -y unzip openjdk-8-jre-headless xvfb libxi6 libgconf-2-4
curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add
echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
# apt-get update
apt-get -y install google-chrome-stable


# if [ ! -f "chromedriver" ]
# then
chrome_driver=$(curl "https://chromedriver.storage.googleapis.com/LATEST_RELEASE")
curl -Lo /usr/src/app/chromedriver_linux64.zip "https://chromedriver.storage.googleapis.com/${chrome_driver}/chromedriver_linux64.zip"
unzip /usr/src/app/chromedriver_linux64.zip
# fi
