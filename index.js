const app = require('express')();
const exec = require('child_process').exec;
const config = require('./config');

app.post('/:appName', (req, res) => {
  const appName = req.params.appName;
  if (!(appName in config)) {
    res.send('app does not exist');
    return;
  }
  res.send('deployment triggered');
  const { imageName, containerName, flags } = config[appName];
  const pull = `docker pull ${imageName}`;
  exec(pull, (err, stdout, stderr) => {
    console.log(pull);
    if (err) {
      console.log(err);
      return;
    }
    console.log(stdout);
    console.log(stderr);
    const rm = `docker rm -f ${containerName} || true`;
    exec(rm, (err, stdout, stderr) => {
      console.log(rm);
      if (err) {
        console.log(err);
        return;
      }
      console.log(stdout);
      console.log(stderr);
      const run = `docker run -d --name ${containerName} ${flags} ${imageName}`;
      exec(run, (err, stdout, stderr) => {
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
