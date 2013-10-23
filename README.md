Deploy Hook
=========

Node.js [express](http://expressjs.com/) app to receive [github](https://github.com) and [bitbucket](https://bitbucket.org) Git POST hook and automate code deployment.  

### What Deploy Hook is
Deploy Hook is is just simple Node.js git pull application triggered by git hosting hook notifications. 

### How to use
 - Set git repository for your apps in both your development machine and deployment server
 - Set SSH keys in both machines
 - Clone deploy hook app 
 - Adjust config.js
 - Run deploy hook app in your server
 - Set Hook url on your git hosting (github or bitbucket)
 - See notes below
 - Commit and enjoy

### Config file
When execute with Node.js exec, git run on different environment than you usual command line bash. Make sure you set correct `gitPath` and `keyPath` in [`config.js`](https://github.com/arifsetiawan/deployhook/blob/master/lib/config.js). I tested this on my machine on Windows 7 32 bit and Windows Server 2012 64 bit. You might need to modify config file and path accordingly.

### Update (how to setup Git key path)
My applications are running on IIS with iisnode. It turns out that even with setting keyPath directly git pull just won't work. One solution is to copy `.ssh` folder from `HOME` directory (Usually something like : `C:\Users\Administrator\.ssh`) into your Git installation path `C:\Program Files (x86)\Git\.ssh`. 

With above approach you can use `git pull origin master` directly. Apparently when executed with Node.js `exec()`, git looks for SSH keys in `C:\Program Files (x86)\Git\.ssh` folder.

### POST hook url
Note that this app has basic auth in it. So your POST hook url should be like
`https://user:password@serverhost:serverport/helper/v1/deploy/hook`

### Customize deployment
If you see function `deploy` in [`deploy.js`](https://github.com/arifsetiawan/deployhook/blob/master/lib/deploy.js) you will notice that I separate staging and production deployment using branch information from [github](https://github.com) [Webhook body](https://help.github.com/articles/post-receive-hooks) or [bitbucket](https://bitbucket.org) [POST hook body](https://confluence.atlassian.com/display/BITBUCKET/POST+hook+management). 

I also include sample payload in function `getHook` in [`deploy.js`](https://github.com/arifsetiawan/deployhook/blob/master/lib/deploy.js). You can create your own custom deployment suitable for your needs and use POST body accordingly

### Public repository use
This code is intended for private repository as it's using SSH key. If you have public repo, uncomment line 79 in [`deploy.js`](https://github.com/arifsetiawan/deployhook/blob/master/lib/deploy.js) to use `git pull origin master` directly.

### License
MIT
