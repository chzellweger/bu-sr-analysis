const fs = require('fs-extra');
const shortid = require('shortid');

const CsvWriter = require('csv-write-stream');
const writer = new CsvWriter({ headers: ['date', 'name', 'status'] });

function writeToCsv(data, filePath) {
  console.log(`
-------------------------
writing to file-system...
-------------------------
`);
  let parsingError = [];

  fs.emptyDirSync(filePath);

  writer.pipe(
    fs.createWriteStream(`${filePath}output${shortid.generate()}.csv`)
  );

  try {
    data.forEach((datum, index) => {
      if (index === 0) {
        console.log(`writing extracted data from document 0 to file system, formatted like:
"${datum[0]}"
"${datum[1]}"
"${datum[2]}"
...
...
...
"${datum[datum.length - 1]}"

`);
      } else {
        console.log(`writing extracted data from document ${index}...`);
      }

      datum.forEach((d) => {
        writer.write(d);
      });
    });
  } catch (error) {
    console.log(error);
    parsingError.push(error);
    throw new Error(error + ' writing to ' + filePath);
  }
  writer.end(() =>
    console.log(
      `\ndone! ${
        parsingError.length > 0 ? 'with error(s)' + parsingError : 'no errors.'
      }`
    )
  );
}

module.exports = writeToCsv;
