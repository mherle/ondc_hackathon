import logging
import logging.handlers
import sys

from flask import Flask, jsonify, render_template

from routing_api import routingapi_blueprint


def createApp():
    theapp = Flask(__name__)
    theapp.logger.addHandler(logging.handlers.SysLogHandler(address='/dev/log'))
    theapp.logger.addHandler(logging.StreamHandler(sys.stdout))
    theapp.register_blueprint(routingapi_blueprint, url_prefix="/challenge7")

    return theapp


app = createApp()


@app.route('/challenge8')
def index():
    """Root"""
    return render_template('challenge8/index.html')


@app.errorhandler(500)
def server_error(e):
    logging.exception('An error occurred during a request.')
    return """
    An internal error occurred: <pre>{}</pre>
    See logs for full stacktrace.
    """.format(e), 500


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
