const fs = require('fs');
const path = require('path');
const listDir = require('fs/promises');
const { stdout } = process;
let pathToDir = path.join(__dirname, 'secret-folder');
// async
(async function listOfDir(currentPath) {
  let pathToFile, filesPart;
  try {
    const files = await listDir.readdir(currentPath);
    for await (let readFile of files) {
      pathToFile = path.join(__dirname, 'secret-folder', readFile);
      // pathToFile = `${pathToDir}/${readFile}`;
      fs.stat(pathToFile, (err, stats) => {
        if (err) throw err;
        if (readFile.startsWith('.')) {
          filesPart = readFile.slice(1).split('.');
          filesPart[0] = '.' + filesPart[0];
          filesPart[1] = filesPart[1] === undefined ? '' : filesPart[1];
        } else {
          filesPart = readFile.split('.');
        }
        if (!stats.isDirectory()) {
          stdout.write(`${filesPart[0]} - ${filesPart[1]} - ${stats.size}b\n`);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
})(pathToDir);
