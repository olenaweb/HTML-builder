const fs = require('fs');
const path = require('path');
const fm = require('fs/promises');

const { stdout } = process;
let filesPart;
let tempHTML = '';

async function projectDir() {
  await fm.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
}

async function copyFiles(source, dest) {
  const listFiles = await fm.readdir(source);

  for await (const copiedFile of listFiles) {
    fs.stat(path.join(source, copiedFile), (err, stats) => {
      if (err) throw err;
      if (stats.isDirectory()) {
        copyDir(path.join(source, copiedFile), path.join(dest, copiedFile));
      } else {
        try {
          fm.copyFile(path.join(source, copiedFile), path.join(dest, copiedFile));
        } catch {
          console.log(`The file ${copiedFile} could not be copied`);
        }
      }
    })
  }
}

async function mkDir(source, dest) {
  try {
    fs.stat(source, (err, stats) => {
      if (err) throw err;
      if (stats.isDirectory()) {
        fs.mkdir(dest, { recursive: true }, (err) => {
          if (err) throw err;
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}

async function copyDir(currDir, copiedDir) {
  try {
    await mkDir(currDir, copiedDir);
    await copyFiles(currDir, copiedDir);
  } catch (err) {
    console.error(err);
  }
}


async function createStyle() {
  try {
    const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    const listFiles = await fm.readdir(path.join(__dirname, 'styles'));
    // console.log(' listFiles= ', listFiles);
    for await (const file of listFiles) {
      filesPart = file.split('.');
      if (filesPart[1] === 'css') {
        const input = fs.createReadStream(path.join(__dirname, 'styles', file));
        input.pipe(output);
      }
    }
  } catch (err) {
    console.error(err);
  }
};


async function readTemp() {
  const readTemp = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  readTemp.on('data', data => {
    tempHTML = data;
    return tempHTML;
  })
}

async function createHtml(temp) {
  try {
    const listFiles = await fm.readdir(path.join(__dirname, 'components'));
    for await (const file of listFiles) {
      const readFile = fs.createReadStream(path.join(__dirname, 'components', file), 'utf-8');
      readFile.on('data', fileContentHeader => {
        let repl = path.basename(path.join(__dirname, 'components', file), '.html');
        let replString = `{{${repl}}}`;
        temp = temp.replace(replString, fileContentHeader);
        const writeResult = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
        writeResult.write(temp);
      });
    };

    return temp;
  } catch (err) {
    console.error(err);
  }
}

(async function createSite() {
  try {
    tempHTML = await readTemp();
    await projectDir();
    await copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    await createStyle();
    await createHtml(tempHTML);
    stdout.write(`Site created\n`);
  } catch (err) {
    console.error(err);
  }
})()
