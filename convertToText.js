var fs = require('fs');
var Reader = require('pdfreader').PdfReader;

function readPdf(filePath, outputPath) {
  console.log('reading file: ', filePath)

  return new Promise((resolve, reject) => {
    var reader = new Reader();
    var output = fs.createWriteStream(outputPath, { encoding: 'utf8' });

    reader.parseFileItems(filePath, function(error, item) {
      if (error) {
        console.log('error parsing file to txt', error)
        reject(error);
      }

      if (!item) {
        output.end()
        output.on('finish', () => {
          console.log('successfully parsed: ', filePath)
          resolve();
        })
      }

      if (item.page) { console.log(`parsing page ${item.page}...`) }

      if (item.text) {
        output.write(item.text + '\n');
      }
    });
  })
}

module.exports = readPdf;
