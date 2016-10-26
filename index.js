const app = require('express')();
const exec = require('child_process').exec;
const config = require('./config');

app.post('/:appName', (req, res) => {
  const appName = req.params.appName;
  if (!(req.params.appName in config)) {
    res.send('app does not exist');
    return;
  }
  res.send('deployment triggered');
  const props = config[appName];
  exec(`docker pull ${props.imageName}`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(stdout);
    console.log(stderr);
    if (!stdout.includes('Downloaded newer image')) {
      return;
    }
    // docker run -d --name $(name) -p $(hostPort):$(containerPort) $(tag)
    exec(`docker rm -f ${props.containerName}`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stdout);
      console.log(stderr);
      const runCommand = 'docker run -d' +
        `--name ${props.containerName}` +
        `-p ${props.hostPort}:${props.containerPort}` +
        props.imageName;
      exec(runCommand, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(stdout);
        console.log(stderr);
      });
    });
  });
});

app.listen(process.env.PORT || 3000);
