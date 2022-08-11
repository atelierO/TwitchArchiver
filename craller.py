from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

import time



download_list = []

options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('window-size=1920x108')
options.add_argument('user-agent=Chrome/80.0.3987.106')
driver = webdriver.Chrome('chromedriver' , options=options)

driver.get('https://www.twitch.tv/oh__dawn/videos?filter=archives&sort=time')

WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH,'//a[@data-a-target="preview-card-image-link"]')))
cards = driver.find_elements(By.XPATH,'//a[@data-a-target="preview-card-image-link"]')

for card in cards:
    download_list.append(card.get_attribute('href'))

driver.close()

