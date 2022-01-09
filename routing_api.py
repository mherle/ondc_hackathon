import json
from datetime import datetime

from flask import Blueprint, jsonify, request
from utils import get_logger
#from redis import Redis
import routing_solver


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

@routingapi_blueprint("/api/solve", methods=["POST"])
def solve():
    response = {"status": 0, "data": {}, "message": "Operation successful"}
    request_json = request.json
    mandatory_fields = ["store", "visits", "vehicles"]
    for field in mandatory_fields:
        if not request_json.get(field):
            response["status"], response["message"] = -1, "{} field is required".format(field)
            return jsonify(response)
    store = request_json.get("store")
    visits = request_json.get("visits")
    vehicles = request_json.get("vehicles")
    routing_solution_path = routing_solver.do_solve(store, visits, vehicles)
    response["data"]["routingPaths"] = routing_solution_path
    return jsonify(response)