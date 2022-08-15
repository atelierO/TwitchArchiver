import os

FIFO_FILENAME = './twitch-download'

if not os.path.exists(FIFO_FILENAME):
    os.mkfifo(FIFO_FILENAME)
if os.path.exists(FIFO_FILENAME):
    fp_fifo = open(FIFO_FILENAME, "r")


while True:
