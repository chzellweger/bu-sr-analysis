var fs = require('fs-extra');
const argv = require('yargs').argv;

const readPdf = require('./convertToText');
const extractPoliticians = require('./extractPoliticians');
const writeToCsv = require('./writeToCsv');

// setup
const testMode = argv.test;
const input = argv.input;
const output = argv.output;

const testConfig = {
  input: './files/test-content/input/',
  output: './files/test-content/output/',
  endOutput: './files/test-content/end-output/'
};

const prodConfig = {
  input: input || './files/pdf/',
  output: './files/txt-output/',
  endOutput: output || './files/end-output/'
};

const config = testMode ? testConfig : prodConfig;
// end setup

// read our pdf-files
const pdfFiles = fs
  .readdirSync(config.input)
  .filter((file) => file.includes('pdf'));

// read our already parsed files
const textFiles = fs
  .readdirSync(config.output)
  .filter((file) => file.includes('txt'));

// gather new files to parse
const newPdfFiles = pdfFiles.filter((file) => {
  if (!textFiles.includes(`${file}.txt`)) {
    return file;
  }
});

console.log(`parsing files in ${testMode ? 'TEST' : 'PARSE'}-MODE`);
console.log('amount of files to parse: ', newPdfFiles.length);
// end setup

// parse pdfs async
const filesPromises = newPdfFiles.map((file) => {
  const pdfPromise = readPdf(
    config.input + file,
    config.output + file + '.txt'
  );
  // throw new Error('test error')
  return pdfPromise;
});
// end parsing

// when parsed, analyse txt-files
Promise.all(filesPromises)
  .then(() => console.log('...done parsing \n'))
  .then(() => {
    // peak into output folder...
    const files = fs
      .readdirSync(config.output)
      .filter((f) => f.includes('.txt'));
    console.log('files to analyse: ', files.length);
    console.log('\n');

    // analyse files with regex
    return files.map((file) => {
      return extractPoliticians(config.output + file);
    });
  })
  // when analysed write to disc
  .then((promises) => {
    return Promise.all(promises)
      .then((valArray) => {
        return writeToCsv(valArray, config.endOutput);
      })
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
