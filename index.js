const app = require('express')();
const exec = require('child-process-promise').exec;
const apps = require(process.argv[2]).apps;

function logOutput(process) {
  const { stdout, stderr } = process;
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
}

app.post('/:appName', (req, res) => {
  const appName = req.params.appName;
  if (!(appName in apps)) {
    res.send('app does not exist');
    return;
  }
  const { imageName, flags } = apps[appName];
  res.send('deployment triggered');
  exec(`docker pull ${imageName}`)
    .then(logOutput)
    .then(() => exec(`docker rm -f ${appName} || true`))
    .then(logOutput)
    .then(() => exec(`docker run -d --name ${appName} ${flags} ${imageName}`))
    .catch(error => console.log(error));
});

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
