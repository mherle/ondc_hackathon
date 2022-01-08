import base64
import os
import logging

def get_logger(name, level=logging.INFO):
    """To setup as many loggers as you want"""
    formatter = logging.Formatter('%(asctime)s %(message)s', "%Y-%m-%d %H:%M:%S")
    handler = logging.FileHandler("logs/{}.txt".format(name))
    handler.setFormatter(formatter)
    logger = logging.getLogger(name)
    logger.handlers = []
    logger.setLevel(level)
    logger.addHandler(handler)
    return logger


def get_randomcode(n):
    return base64.b32encode(os.urandom(n))[:n].lower().decode("ascii")