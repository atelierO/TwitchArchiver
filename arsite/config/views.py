from django.shortcuts import render, redirect, HttpResponse
from django.http import HttpResponseBadRequest

# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.chrome.options import Options

from config.apps import DownloadManager

import re, os, json, threading



global manager
# chrome_options = Options()
# chrome_options.add_argument("--headless") 
# chrome_options.add_argument("--no-sandbox")
# webdriver_service = Service("./chromedriver")
# driver = webdriver.Chrome(service=webdriver_service, options=chrome_options)

manager = DownloadManager()
manager.start()

def index(request):
    global manager
    manager.reload()
    return render(request, 'index.html',{'info':manager.getinfo_all()})

def change_oauth(request):
    global manager
    if request.method == "POST":
        manager.setoauth(request.POST['channel_name'],request.POST['oauth'])
        return HttpResponse(json.dumps({'valid':True, 'cname':request.POST['channel_name'],'oauth':request.POST['oauth'],'i':request.POST['i']}),content_type='application/json')
    return HttpResponseBadRequest('Not permitted access')

def register(request):
    global manager
    if request.method == "POST":
        data = request.POST
        print(data)
        state = manager.add(data['channel_name'], data['oauth'])
        return HttpResponse(json.dumps({'state':state, 'i': request.POST["i"],'channel':manager.getinfo(data['channel_name']) if state=='ok' else ''}),content_type='application/json')
    return HttpResponseBadRequest('Not permitted access')

def download_channel(request):
    global manager
    if request.method == "POST":
        if request.POST['toggle'] == 'true':
            manager.download(request.POST['channel_name'])
            manager.getinfo(request.POST['channel_name'])['regular-download'] = True
        else:
            manager.stop_download(request.POST['channel_name'])
            manager.getinfo(request.POST['channel_name'])['regular-download'] = False
        return HttpResponse('OK')
    return HttpResponseBadRequest('Not permitted access')

def delete_channel(request):
    global manager
    if request.method == "POST":
        manager.delete(request.POST['channel_name'])
        return HttpResponse('OK')
    return HttpResponseBadRequest('Not permitted access')

def download_state(request):
    global manager
    if request.method == "POST":
        states = []
        for cname in request.POST.getlist('channel_names[]'):
            states.append(manager.get_download_state(cname))
        return HttpResponse(json.dumps({'states': states}), content_type='application/json')
    return HttpResponseBadRequest('Not permitted access')