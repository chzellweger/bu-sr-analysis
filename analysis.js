const fs = require('fs-extra');
const argv = require('yargs').argv;

const convertToText = require('./convertToText');
const extractPoliticians = require('./extractPoliticians');
const writeToCsv = require('./writeToCsv');

// setup
const isTestRun = argv.test;
const inputFolder = argv.input;
const outputFolder = argv.output;

const testConfig = {
  inputFolder: './files/test-content/input/',
  outputFolder: './files/test-content/output/',
  endOutputFolder: './files/test-content/end-output/'
};

const prodConfig = {
  inputFolder: inputFolder || './files/pdf/',
  outputFolder: './files/txt-output/',
  endOutputFolder: outputFolder || './files/end-output/'
};

const config = isTestRun ? testConfig : prodConfig;
// end setup

// read our pdf-files
const pdfFiles = fs
  .readdirSync(config.inputFolder)
  .filter((file) => file.includes('pdf'));

// read our already parsed files
const textFiles = fs
  .readdirSync(config.outputFolder)
  .filter((file) => file.includes('txt'));

// gather new files to parse
const newPdfFiles = pdfFiles.filter((file) => {
  if (!textFiles.includes(`${file}.txt`)) {
    return file;
  }
});
console.log(`
-------------------------------------------------------
parsing files in ${isTestRun ? 'TEST' : 'PARSE'}-MODE
amount of files to parse: ${newPdfFiles.length}
-------------------------------------------------------
`);
// end setup

// parse pdfs async
const filesPromises = newPdfFiles.map((file) => {
  const pdfsAsTextPromises = convertToText(
    config.inputFolder + file,
    config.outputFolder + file + '.txt'
  );
  return pdfsAsTextPromises;
});
// end parsing

// when parsed, analyse txt-files
Promise.all(filesPromises)
  .then(() => console.log('...done parsing \n'))
  .then(() => {
    // peak into output folder...
    const files = fs
      .readdirSync(config.outputFolder)
      .filter((f) => f.includes('.txt'));
    console.log(`
----------------------------------
analyzing files in ${isTestRun ? 'TEST' : 'PARSE'}-MODE
files to analyze: ${files.length}
----------------------------------`);
    console.log('\n');

    // analyse files with regex
    return files.map((file) => {
      return extractPoliticians(config.outputFolder + file);
    });
  })
  // when analysed write to disc
  .then((promises) => {
    return Promise.all(promises).then((valArray) => {
      return writeToCsv(valArray, config.endOutputFolder);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
