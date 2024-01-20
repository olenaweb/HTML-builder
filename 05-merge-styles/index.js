const fs = require('fs');
const path = require('path');
const fm = require('fs/promises');

(async function () {
  const { stdout } = process;
  let filesPart;
  const output = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
  );
  const listFiles = await fm.readdir(path.join(__dirname, 'styles'));
  stdout.write('Added file css: \n');
  let nn = 0;

  for await (const file of listFiles) {
    if (file.startsWith('.')) {
      filesPart = file.slice(1).split('.');
      filesPart[0] = '.' + filesPart[0];
      filesPart[1] = filesPart[1] === undefined ? '' : filesPart[1];
    } else {
      filesPart = file.split('.');
    }

    if (filesPart[1] === 'css') {
      nn++;
      const input = fs.createReadStream(path.join(__dirname, 'styles', file));
      input.pipe(output);
      stdout.write(`${nn}. ${file};\n`);
    }
  }
})();
