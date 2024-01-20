const fm = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { stdout } = process;

async function copyDir(currentFiles, copyFiles) {
  await fm.mkdir(copyFiles, { recursive: true });
  fs.readdir(copyFiles, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.unlink(path.join(copyFiles, file), (err) => {
        if (err) throw err;
      });
    });
  });
  fs.readdir(currentFiles, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    // console.log(' files= ', files);
    files.forEach((file) => {
      if (file.isFile()) {
        // console.log('Dirent.isFile() = ', Dirent.isFile(), 'Dirent.name', Dirent.name);
        fm.copyFile(
          path.join(currentFiles, file.name),
          path.join(copyFiles, file.name),
        );
      }
    });
  });
}

async function checkCopiedFiles(target, dest) {
  const listFilesDest = await fm.readdir(target);
  stdout.write(`\nThe files have been copied to ${dest}.\n`);
  let nn = 0;
  for await (const copiedFile of listFilesDest) {
    nn++;
    stdout.write(`${nn}. ${copiedFile};\n`);
  }
}

(async function () {
  await copyDir(
    path.join(__dirname, 'files'),
    path.join(__dirname, 'files-copy'),
  );
  await checkCopiedFiles(
    path.join(__dirname, 'files'),
    path.join(__dirname, 'files-copy'),
  );
})();
