import json
import aiohttp
import asyncio

with open('key.json') as f:
    subscription_key = json.load(f)["key"]
assert subscription_key

face_api_url = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect'
_maxNumRetries = 10


async def process_request(data, headers, params):
    result = None
    error = None

    async with aiohttp.ClientSession() as session:
        async with session.post(face_api_url, data=data, headers=headers, params=params) as resp:

            if resp.status == 200 or resp.status == 201:
                result = await resp.json()
            else:
                error = await resp.json()

    return error, result


def predict_emotions():
    headers = dict()
    headers['Ocp-Apim-Subscription-Key'] = subscription_key
    headers['Content-Type'] = 'application/octet-stream'

    with open("live.png", 'rb' ) as f:
        data = f.read()

    params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'emotion'
    }

    loop = asyncio.get_event_loop()
    error, result = loop.run_until_complete(process_request(data, headers, params))
    if error is None:
        return result[0]["faceAttributes"]["emotion"]

    return error['error']['message']

