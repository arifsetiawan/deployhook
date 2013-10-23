Deploy Hook
=========

Receive [bitbucket](https://bitbucket.org) Git POST hook and automate code deployment.

### Git config
When execute with Node.js exec, git run on different environment than you usual command line bash. Make sure you set correct `gitPath` and `keyPath` in [`config.js`](https://github.com/arifsetiawan/deployhook/blob/master/lib/config.js). I tested this on my machine on Windows 7 32 bit and Windows Server 2012 64 bit. You might need to modify path accordingly. 

### POST hook url
Note that this app has basic auth in it. So your POST hook url should be like
`https://user:password@serverhost:serverport/helper/v1/deploy/hook`

### custom deployment
If you see function `deploy` in [`deploy.js`](https://github.com/arifsetiawan/deployhook/blob/master/lib/deploy.js) you will notice that I separate staging and production deployment using branch information from [bitbucket](https://bitbucket.org) POST hook body. Refer [here](https://confluence.atlassian.com/display/BITBUCKET/POST+hook+management) for detailed information on the body. I also include sample body in function `getHook` in [`deploy.js`](https://github.com/arifsetiawan/deployhook/blob/master/lib/deploy.js)

You can create your own custom deployment suitable for your needs and use POST body accordingly

### Public repository use
This code is intended for private repository as it's using SSH key. If you have public repo, uncomment line 79 in [`deploy.js`](https://github.com/arifsetiawan/deployhook/blob/master/lib/deploy.js) to use `git pull origin master` directly.

### Github
This could work for github too. You just need to modify handling POST body from github. You can check it [here](https://help.github.com/articles/post-receive-hooks)

### License
MIT
