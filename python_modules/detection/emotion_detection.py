import json
import aiohttp
import asyncio

with open('key.json') as f:
    subscription_key = json.load(f)["key"]
assert subscription_key

face_api_url = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect'
_maxNumRetries = 10


async def process_request(data, headers, params):
    result = None
    error = None

    # Post face async to Azure api
    async with aiohttp.ClientSession() as session:
        async with session.post(face_api_url, data=data, headers=headers, params=params) as resp:

            # Handle response
            if resp.status == 200 or resp.status == 201:
                result = await resp.json()
            else:
                error = await resp.json()

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

    loop = asyncio.get_event_loop()
    error, result = loop.run_until_complete(process_request(data, headers, params))
    if error is None:
        return result[0]["faceAttributes"]["emotion"]

    return error['error']['message']

