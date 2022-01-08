import json
from datetime import datetime

from flask import Blueprint, jsonify, request
from routing_api import get_logger
#from redis import Redis


routingapi_blueprint = Blueprint('', __name__, static_folder='logs')

ROUTING_LOG_NAME = "routing"
request_logger = get_logger(ROUTING_LOG_NAME)

#redis_server = Redis.from_url("redis://localhost:6379/1")


@routingapi_blueprint.before_request
@routingapi_blueprint.before_request
def log_request_info():
    try:
        request_logger.info("|REQUEST|%s|%s|%s", request.path, request.headers.items(), request.get_data())
    except:
        pass


@routingapi_blueprint.after_request
def post_request_logging(response):
    try:
        request_logger.info("|RESPONSE|%s|%s|%s", request.path, response.status_code, response.get_data())
    except:
        pass
    return response
