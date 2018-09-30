# Pots

Start creating a healthy working environment using Pots. Pots is an Electron Python combination application which tracks mood, posture en drowsiness. When something "bad" gets detected, it will alert the user by updating it's personal dashboard and by sending a custom notification.

**Note**: The application frontend is entirely in Dutch

## Requirements ##
* Python 3.6.5
* Dlib [Installation instructions](https://www.pyimagesearch.com/2018/01/22/install-dlib-easy-complete-guide/)
* Node >= 8
* [Microsoft Azure Face API key](https://azure.microsoft.com/en-us/try/cognitive-services/?api=face-api&unauthorized=1)

## Getting started ##
Put your Azure API key in a file called 'key.json' in the root of the project.
```json
{
    "key":"YOUR_KEY"
}
```


Install the libraries required by the Python process using pip (preferably in a virtual environment). This can be done by executing the following command.
```bash
pip install -r requirements.txt
```
*Note*: Installing the Dlib dependency requires quite some time

When all Python dependencies are installed, it's time to install Node dependencies required by the desktop application. This can be done by executing:
```bash
npm install
```

## Usage ##
When everything is set, the application is ready to start. The only step left is to execute the command:
```bash
npm start
```
Enjoy 🎉

## License ##
[The MIT License](https://opensource.org/licenses/mit-license.php).
Copyright (c) 2018 Red Shed Gathering

## Contributing ##
This is only v0.1 of this product, so it's very likely there will be undiscovered bugs in the software. Feel free to open a pull request to fix bugs or add new functionalities.