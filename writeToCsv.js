var fs = require('fs-extra');
var shortid = require('shortid');

var csvWriter = require('csv-write-stream');
var writer = new csvWriter({ headers: ['date', 'name', 'status'] });

function writeToCsv(data, filePath) {
  console.log('writing to file-system...');
  let parsingError = []

  fs.emptyDirSync(filePath)
  
  writer.pipe(fs.createWriteStream(`${filePath}output${shortid.generate()}.csv`));

  try {
    data.forEach((datum, index) => {
      console.log(`writing files from item ${index}...`)
      datum.forEach((d) => {
        writer.write(d);
      });
    });
  } catch (error) {
    console.log(error)
    parsingError.push(error)
    throw new Error(error + ' writing to ' + filePath)
  }
    writer.end(() => console.log(`...\ndone! ${parsingError.length > 0 ? 'with error(s)' + parsingError : 'no errors.'}`));
  }

module.exports = writeToCsv;
