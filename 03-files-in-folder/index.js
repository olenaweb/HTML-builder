const fs = require('fs');
const path = require('path');
const fm = require('fs/promises');
const { stdout } = process;
let pathToDir = path.join(__dirname, 'secret-folder');
// async
(async function listOfDir(currentPath) {
  let pathToFile, filesPart;
  try {
    const files = await fm.readdir(currentPath);
    for await (let readFile of files) {
      pathToFile = path.join(__dirname, 'secret-folder', readFile);
      // pathToFile = `${pathToDir}/${readFile}`;
      fs.stat(pathToFile, (err, stats) => {
        if (err) throw err;
        if (readFile.startsWith('.')) {
          filesPart = readFile.slice(1).split('.');
        } else {
          filesPart = readFile.split('.');
        }
        const k = filesPart.length - 1;
        const partName = k > 0 ? path.basename(readFile, '.' + filesPart[k]) : path.basename(readFile);
        const partEnd = k > 0 ? filesPart[k] : '';
        if (!stats.isDirectory()) {
          stdout.write(`${partName} - ${partEnd} - ${stats.size}b\n`);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
})(pathToDir);
