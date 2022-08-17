from django.apps import AppConfig

import threading, os, time, json, subprocess

from datetime import datetime

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import re, requests, atexit, sys

from queue import Queue, Empty

class ConfigConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'config'




class DownloadManager(threading.Thread):
    def __init__(self,driver):
        threading.Thread.__init__(self) 
        self.driver = driver
        self.load()
        self.download_threads = {}

    def __del__(self):
        self.driver.close()

    def run(self):
        while True:
            time.sleep(3600*3) # 3 hours sleep
            print('Regular Routine Download Start...')
            for channel in self.channels.values():
                if channel['regular-download'] == True and channel['running'] == False:
                    self.check(channel)
                    self.download(channel.cname)
                    channel['running'] = False

    def load(self):
        with open("./channels.json", "r") as file:
            self.channels = json.load(file)

    def save(self):
        with open("./channels.json", "w") as file:
            json.dump(self.channels,file,indent=4)

    def reconfig(self, channel):
        p = re.compile('(?<=\()[0-9]*(?=\).mp4)')
        if os.path.isdir('./download') == False:
            os.mkdir('./download')
        download_path = './download/' + channel['cname']
        if os.path.isdir(download_path) == False:   
            os.mkdir(download_path)
        for path in os.listdir(download_path):
            vcode = p.search(path)
            if vcode == None:
                continue
            vcode = vcode.group()
            if vcode in channel['metadata'].keys() and vcode not in channel['complete']:
                channel['complete'].append(vcode)
            if vcode in channel['incomplete']:
                channel['incomplete'].remove(vcode)

    def reload(self):
        for channel in self.channels.values():
            self.reconfig(channel)
        self.save()

    def add(self, cname, oauth):
        if cname in self.channels:
            return False
        channel = {}
        channel['cname'] = cname
        channel['oauth'] = oauth
        channel['running'] = False
        channel['last-download'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        channel['regular-download'] = False
        channel['working'] = {}
        channel['complete'] = []
        channel['incomplete'] = []
        channel['metadata'] = {}
        self.channels[cname] = channel
        self.check(channel)
        self.reconfig(channel)
        self.save()
        return True
    
    def delete(self, cname):
        del self.channels[cname]
        self.save()

    def setoauth(self, cname, oauth):
        if cname in self.channels:
            self.channels[cname]['oauth'] = oauth
            self.save()

    def getinfo_all(self):
        return self.channels

    def getinfo(self, cname):
        return self.channels[cname]

    def check(self, channel):
        self.driver.get('https://www.twitch.tv/'+channel['cname']+'/videos?filter=archives&sort=time')
        WebDriverWait(self.driver, 3).until(EC.presence_of_element_located((By.XPATH,'//a[@data-a-target="preview-card-image-link"]')))
        video_link_elements = self.driver.find_elements(By.XPATH,'//a[@data-a-target="preview-card-image-link"]')
        p = re.compile("(?<=videos/)[0-9]+")

        for ele in video_link_elements:
            link = ele.get_attribute('href')
            vcode = p.search(link).group()

            duplicate = False
            for ccode in channel['complete']:
                if ccode == vcode:
                    duplicate = True
                    break
            if duplicate == True:
                continue

            headers = {"Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",}
            params = {"query":'query{video(id:"'+vcode+'"){title,thumbnailURLs(height:180,width:320),createdAt,lengthSeconds,owner{displayName}}}'}
            response = requests.post("https://gql.twitch.tv/gql", data=json.dumps([params]), headers = headers) 
            metadata = response.json()[0]["data"]["video"]
            metadata['createdAt'] = datetime.strptime(metadata['createdAt'],"%Y-%m-%dT%H:%M:%SZ").strftime('%Y-%m-%d %H:%M:%S')
            channel['metadata'][vcode] = metadata
            channel['incomplete'].append(vcode)

    def download(self, cname):
        channel = self.channels[cname]
        thread = threading.Thread(target=self.download_thread, args=(channel,))

        self.download_threads[cname] = {}
        self.download_threads[cname]['thread'] = thread
        self.download_threads[cname]['is_running'] = True
        self.download_threads[cname]['lock'] = threading.Lock()
        self.download_threads[cname]['queue'] = Queue()

        thread.start()
    
    def download_state_thread(self,channel,out):
        p = re.compile("[0-9]+%")
        while channel['running'] and channel['working']['progress'] != '100%':
            time.sleep(10)
            content = p.search(out.readline().decode('utf-8'))
            if content != None:
                channel['working']['progress'] = content.group()
                if content.group() == "100%":
                    return

    def get_download_state(self, cname):
        return self.channels[cname]['working']

    def download_thread(self,channel):
        channel['running'] = True

        while len(channel["incomplete"]) != 0:
            cname = channel['cname']
            #lock acquire
            self.download_threads[cname]['lock'].acquire()
            #make directory name
            vcode = channel["incomplete"][0]
            download_path = './download/' + cname
            if os.path.isdir('./download') == False:
                os.mkdir('./download')
            if os.path.isdir(download_path) == False:
                os.mkdir(download_path)
            vdate = datetime.strptime(channel['metadata'][vcode]['createdAt'],"%Y-%m-%d %H:%M:%S").strftime('%Y-%m-%d')
            download_path = download_path + '/[' + vdate + '] ' + channel['metadata'][vcode]['owner']['displayName'] + ' - ' + channel['metadata'][vcode]['title'] + ' (' + vcode +').mp4'
            runner = ['./TwitchDownloaderCLI', '-m','VideoDownload','-q','1080p60','-o',download_path,'--ffmpeg-path','./ffmpeg','-u',vcode]
            print(' '.join(runner))
            if channel['oauth'] != '':
                runner.append('--oauth')
                runner.append(channel['oauth'])
            #run download subprocess
            print(cname + ' - ' + vcode + ': start to download')
            p = subprocess.Popen(runner, stdout=subprocess.PIPE)
            #run progress get thread
            os.set_blocking(p.stdout.fileno(), False)
            thread = threading.Thread(target=self.download_state_thread, args=(channel,p.stdout))
            channel['working']['vcode'] = vcode
            channel['working']['progress'] = '-%'
            thread.start()
            #set configs and release lock
            self.download_threads[cname]['process'] = p
            self.download_threads[cname]['lock'].release()
            p.wait()
            if self.download_threads[cname]['is_running'] == False:
                break
            channel['working']['progress'] = '100%'
            channel['last-download'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            channel['incomplete'].remove(0)
            channel['complete'].append(vcode)
        channel['running'] = False
        self.save()

    def stop_download(self, cname):
        channel = self.channels[cname]
        channel['running'] = False
        channel['working'] = {}

        if cname in self.download_threads:
            self.download_threads[cname]['lock'].acquire()
            self.download_threads[cname]['is_running'] = False
            if 'process' in self.download_threads[cname]:
                self.download_threads[cname]['process'].kill()
            self.download_threads[cname]['lock'].release()
        self.save()
