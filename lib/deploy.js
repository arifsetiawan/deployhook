
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var async = require('async');

var config = require('./config.js');

exports.postHook = function(req, res) {

  console.log('Post hook');
  console.log(req.body);

  if (req.body) {
    var payload = req.body.payload;
    deploy(payload, function(err, data) {
      res.send('OK');
    })
  }
  else {
    res.send(500, 'Error');
  }
}

exports.getHook = function(req, res) {

  var bitbucketPayload = '{"repository": {"website": "", "fork": false, "name": "JepretDummy", "scm": "git", "owner": "arifsetiawan", "absolute_url": "/arifsetiawan/jepretdummy/", "slug": "jepretdummy", "is_private": true}, "truncated": false, "commits": [{"node": "2785bd518005", "files": [{"type": "modified", "file": "README.md"}], "branch": "master", "utctimestamp": "2013-10-22 13:22:03+00:00", "timestamp": "2013-10-22 15:22:03", "raw_node": "2785bd518005be99fca594683d0b75a56c0e62f7", "message": "some thing\\n", "size": -1, "author": "arifsetiawan", "parents": ["b5c80b61b888"], "raw_author": "Arif Setiawan <arif@aegis.co.id>", "revision": null}], "canon_url": "https://bitbucket.org", "user": "arifsetiawan"}';

  var githubPayload = '{"ref":"refs/heads/newbranch","after":"d4ca7d0ea565204a310c3ce01943e4a594d4a0b7","before":"6e5f237ae061e27bede850fd495257b0f18d70bd","created":false,"deleted":false,"forced":false,"compare":"https://github.com/arifsetiawan/sample_app/compare/6e5f237ae061...d4ca7d0ea565","commits":[{"id":"d4ca7d0ea565204a310c3ce01943e4a594d4a0b7","distinct":true,"message":"Update README.markdown","timestamp":"2013-10-22T23:42:00-07:00","url":"https://github.com/arifsetiawan/sample_app/commit/d4ca7d0ea565204a310c3ce01943e4a594d4a0b7","author":{"name":"arif setiawan","email":"n.arif.setiawan@gmail.com","username":"arifsetiawan"},"committer":{"name":"arif setiawan","email":"n.arif.setiawan@gmail.com","username":"arifsetiawan"},"added":[],"removed":[],"modified":["README.markdown"]}],"head_commit":{"id":"d4ca7d0ea565204a310c3ce01943e4a594d4a0b7","distinct":true,"message":"Update README.markdown","timestamp":"2013-10-22T23:42:00-07:00","url":"https://github.com/arifsetiawan/sample_app/commit/d4ca7d0ea565204a310c3ce01943e4a594d4a0b7","author":{"name":"arif setiawan","email":"n.arif.setiawan@gmail.com","username":"arifsetiawan"},"committer":{"name":"arif setiawan","email":"n.arif.setiawan@gmail.com","username":"arifsetiawan"},"added":[],"removed":[],"modified":["README.markdown"]},"repository":{"id":1397718,"name":"sample_app","url":"https://github.com/arifsetiawan/sample_app","description":"from Ruby on Rails tutorials","homepage":"","watchers":1,"stargazers":1,"forks":0,"fork":false,"size":656,"owner":{"name":"arifsetiawan","email":"n.arif.setiawan@gmail.com"},"private":false,"open_issues":0,"has_issues":true,"has_downloads":true,"has_wiki":true,"language":"Ruby","created_at":1298383572,"pushed_at":1382510520,"master_branch":"master"},"pusher":{"name":"arifsetiawan","email":"n.arif.setiawan@gmail.com"}}';

  deploy(githubPayload, function(err, data) {
    if (err) {
      res.send('Error');
    }
    else {
      res.send('OK');
    }
  })
}

function deploy(payload, callback) {
  var parsed = JSON.parse(payload);

  if (parsed.commits.length > 0) {
    if (parsed.canon_url) {
      if (parsed.canon_url.indexOf('bitbucket') > -1) {
        // this is bitbucket
        var branch = parsed.commits[0].branch;
        var targetDir = branch === 'master' ? config.prodDir : config.stagingDir;
        console.log('Deploy to: ' + targetDir + ' on branch: ' + branch);
        execute(targetDir, branch, callback);
      }
      else {
        callback(new Error('Unknown host ' + parsed.canon_url));
      }
    }
    else {
      if (parsed.repository.url.indexOf('github') > -1) {
        // this is github
        var branch = parsed.ref.split('/')[2];
        var targetBranch = branch ? branch : 'master' // default to master
        var targetDir = branch === 'master' ? config.prodDir : config.stagingDir;
        console.log('Deploy to: ' + targetDir + ' on branch: ' + branch);
        execute(targetDir, branch, callback);
      }
      else {
        callback(new Error('Unknown host ' + parsed.repository.url));
      }
    }
  }
  else {
    callback(new Error('No commits'));
  }
}

function execute(dir, branch, callback) {

  var env = {
    'PATH' : config.gitPath
  }

  async.waterfall([
    function (cb){
      // discard changes
      var command1 = "git reset --hard HEAD";
      console.log(command1);
      var child1 = exec( command1, {cwd: dir, env: env}, function(err, stdout, stderr) {
        if (err) {
          console.log('err');
          console.log(err);
          console.log(stdout);
          cb(err);
        }
        else {
          console.log('done');
          console.log(stdout);
          cb(null, 'OK');
        }
      });
    },
    function(data, cb){
      // pull latest
      var command2 = "git pull origin " + branch;
      //var command2 = "ssh-agent bash -c 'ssh-add " + config.keyPath + "; git pull origin " + branch + "'";
      console.log(command2);
      var child2 = exec(command2, {cwd: dir, env: env}, function(err, stdout, stderr) {
        if (err) {
          console.log('err');
          console.log(err);
          console.log(stdout);
          cb(err);
        }
        else {
          console.log('done');
          console.log(stdout);
          cb(null, 'OK');
        }
      });
    },
  ], function (err, result) {
    if (err) {
      callback(err);
    }  
    else {
      callback(null, 'OK');
    }
  });
}
