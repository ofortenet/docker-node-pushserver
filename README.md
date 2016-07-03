# Docker Node Push Server

Push Server is a cross-plateform push server based on [node-apn](https://github.com/argon/node-apn) and [node-gcm](https://github.com/ToothlessGear/node-gcm). Push Server currently supports iOS (APN) and android (GCM) platforms.
Note that this server is not meant to be used as a front facing server as there's no particular security implemented.


**This fork has removed the user handling and accepts the device tokens directly. This is useful, if you use your own logic to register devices and store the tokens.**

**Thus, it is not possible to send APN and GCM requests at the same time.**

**TODO: APN feedback is disabled for now.**

## Getting started

### 0 - Install node-pushserver locally (optional)

```shell
$ git clone git://github.com/jgontrum/docker-node-pushserver.git
$ cd docker-node-pushserver
$ npm install -g
```

### 1 - Docker
Prepare the folder ```config``` which contains:
- The ```config.json``` that uses absolute paths for the certificates.
  The prefix is: ```/usr/pushserver/config/```.
- A ```cert.pem``` file.
- A ```key.pem``` file.

Build the docker image:
```shell
$ git clone git://github.com/jgontrum/docker-node-pushserver.git
$ cd docker-node-pushserver
$ cp -r /path/to/config config
$ docker build -t pushserver .
```

Start the docker container (with port forwarding, insecure!):
```shell
$ docker run --name="pushserver" -d -p 54545:54545 pushserver
```

Start the docker container with a local port (preferred):
```shell
$ docker run --name="pushserver" -d pushserver
```

#### Performance
The container is based on the latest Ubuntu and requires only about 38MB RAM.

### 2 - Configuration

If you checked out this project from github, you can find a configuration file example named 'example.config.json'.


```js
{
	"webPort": 8000,

    "gcm": {
        "apiKey": "YOUR_API_KEY_HERE"
    },

    "apn": {
        "connection": {
            "gateway": "gateway.sandbox.push.apple.com",
            "cert": "/path/to/cert.pem",
            "key": "/path/to/key.pem"
        },
        "feedback": {
            "address": "feedback.sandbox.push.apple.com",
            "cert": "/path/to/cert.pem",
            "key": "/path/to/key.pem",
            "interval": 43200,
            "batchFeedback": true
        }
    }
}

```

+ Checkout [GCM documentation](http://developer.android.com/guide/google/gcm/gs.html) to get your API key.

+  Read [Apple's Notification guide](https://developer.apple.com/library/ios/#documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Introduction.html) to know how to get your certificates for APN.

+ Please refer to node-apn's [documentation](https://github.com/argon/node-apn) to see all the available parameters and find how to convert your certificates into the expected format.

#### Dynamic configuration

You can use the "process.env.MY_ENV_VAR" syntax in the config.json file. It will automatically be replaced by the value of the corresponding environment variable.

### 3 - Start server

```shell
$ pushserver -c /path/to/config.json
```

#### Override configuration

You can override your configuration with the "-o" or "--override" option by providing a key=value option.
The key can be of the form key.subKey.
If the value begins with process.env, it is evaluated.
For example, if your mongodbUrl comes from an environment variable:

```shell
$ pushserver -c /path/to/config.json -o mongodbUrl=process.env.MY_ENV_VAR
```

If you want to set you GCM API key via the command line:

```shell
$ pushserver -c /path/to/config.json -o gcm.apiKey=YOUR_API_KEY
```

### 5 - Enjoy!



## Usage
### Web Interface
You can easily send push messages using the web interface available at `http://domain:port/`.

### Web API

#### Send a push
```
http://domain:port/send (POST)
```
+ The content-type must be 'application/json'.
+ Format :

```json
{
  "tokens": ["androidToken"],
  "android": {
    "collapseKey": "optional",
    "data": {
      "message": "Your message here"
    }
  }
}
```

or:
```json
{
  "tokens": ["iosToken"],
  "ios": {
    "badge": 0,
    "alert": "Your message here",
    "sound": "soundName"
  }
}

```

+ You can send push messages to Android or iOS devices, or both, by using the "android" and "ios" fields with appropriate options. See GCM and APN documentation to find the available options.

#### Send push notifications
```
http://domain:port/sendBatch (POST)
```
+ The content-type must be 'application/json'.
+ Format :

```json
{
  "notifications": [{
      "tokens": ["deviceToken1", "deviceToken2"],
      "ios": {
        "badge": 0,
        "alert": "Foo bar",
        "sound": "soundName"
      }
    },{
      "tokens": ["deviceToken3"],
      "android": {
        "collapseKey": "optional",
        "data": {
          "message": "Your other message here"
        }
      }
    }
  ]
}
```

## Dependencies

  * [node-apn](https://github.com/argon/node-apn)
  * [node-gcm](https://github.com/ToothlessGear/node-gcm)
  * [express](https://github.com/visionmedia/express)
  * [lodash](https://github.com/bestiejs/lodash.git )
  * [commander](https://github.com/visionmedia/commander.js)

## Tags
[node-pushserver tags](https://github.com/Smile-SA/node-pushserver/tags).

## History/Changelog

Take a look at the [history](https://github.com/Smile-SA/node-pushserver/blob/master/HISTORY.md#history).

## License

MIT :

Copyright (C) 2012 Smile Mobile Team

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
