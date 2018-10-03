import json
import time
import os
import sys
import requests


def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.environ.get("_MEIPASS2", os.path.abspath("."))

    return os.path.join(base_path, relative_path)


with open('key.json') as f:
    subscription_key = json.load(f)["key"]
assert subscription_key

face_api_url = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect'
_maxNumRetries = 10


def process_request(data, headers, params):
    retries = 0
    result = None
    error = None

    while True:

        response = requests.request('post', face_api_url, json=json, data=data, headers=headers, params=params)

        if response.status_code == 429:
            if retries <= _maxNumRetries:
                time.sleep(1)
                retries += 1
                continue
            else:
                error = "Error on connection to emotion service"
                break

        elif response.status_code == 200 or response.status_code == 201:

            if 'content-length' in response.headers and int(response.headers['content-length']) == 0:
                result = None
                error = "No content returned from emotion service"
            elif 'content-type' in response.headers and isinstance(response.headers['content-type'], str):
                if 'application/json' in response.headers['content-type'].lower():
                    result = response.json() if response.content else None
                elif 'image' in response.headers['content-type'].lower():
                    result = response.content
        else:
            error = response.json()['error']['message']
        break

    return error, result


def predict_emotions():
    headers = dict()
    headers['Ocp-Apim-Subscription-Key'] = subscription_key
    headers['Content-Type'] = 'application/octet-stream'

    # Load latest live image
    with open("live.png", 'rb' ) as f:
        data = f.read()

    # Set request parameters
    params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'emotion'
    }

    error, result = process_request(data, headers, params)
    if error is None:
        return result[0]["faceAttributes"]["emotion"]

    return error

