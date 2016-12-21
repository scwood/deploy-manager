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
  const { imageName, flags } = config[appName];
  exec(`docker pull ${imageName}`, () => {
    exec(`docker rm -f ${appName} || true`, () => {
      exec(`docker run -d --name ${appName} ${flags} ${imageName}`);
    });
  });
});

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
