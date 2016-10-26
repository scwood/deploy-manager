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
  const props = config[appName];
  const imageName = props.imageName;
  exec(`docker pull ${imageName}`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(stdout);
    console.log(stderr);
    const containerName = props.containerName;
    exec(`docker rm -f ${props.containerName} || true`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stdout);
      console.log(stderr);
      const flags = props.runFlags;
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
