const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { stdin, stdout } = process;
const pathFile = path.join(__dirname, '02-write-file.txt');

stdout.write(
  'Enter your information below. To complete the entry, enter : exit or Ctrl-C.\n ',
);

const informEnter = readline.createInterface({
  input: stdin,
});

fs.writeFile(pathFile, '', (err) => {
  if (err) throw err;
});

// let lineN = 0;
informEnter.on('line', function (input) {
  // lineN++;
  if (input === 'exit') {
    informEnter.close();
    process.emit('SIGINT');
  } else {
    // console.log('Input line numbers ' + lineN);
    fs.appendFile(pathFile, input + '\n', 'utf8', (err) => {
      if (err) throw err;
    });
  }
});

process.on('SIGINT', () => {
  stdout.write(`Information saved in file ${pathFile}.\n`);
  process.exit();
});
