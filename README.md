Deploy Hook
=========

Receive Git POST hook and automate code deployment.

When execute with Node.js exec, git run on different environment than you usual command line bash. Make sure you set correct gitPath and keyPath in [config.js](https://github.com/arifsetiawan/deployhook/blob/master/lib/config.js). 

Note that this app has basic auth in it. So your POST hook url should be like
https://user:password@serverhost:serverport/helper/v1/deploy/hook

This code is intended for private repository as it's using SSH key. If you have public repo, uncomment line 79 in [deploy.js](https://github.com/arifsetiawan/deployhook/blob/master/lib/deploy.js)

Tested on Windows 7 and Windows Server 2012