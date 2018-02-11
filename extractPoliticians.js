// var inspect = require('eyes').inspector({ maxLength: 500 });
var util = require('util');
var fs = require('fs');
var getPoliticians = require('./regExpPoliticians');
var cleanUp = require('./cleanUpPoliticiansEntries');

var readFileAsync = util.promisify(fs.readFile);

const patterns = {
  date: new RegExp(/Stadtratssitzung([\S\s]*?)Grossratssaal/),
  present: new RegExp(/\bAnwesend\b([\S\s]*?)\bEntschuldigt\b/gm),
  vacant: new RegExp(/\bEntschuldigt\b([\S\s]*?)\bRatssekretariat\b/gm)
};

function extractPoliticians(filePath, outputPath) {
  return new Promise((resolve, reject) => {
    return readFileAsync(filePath, { encoding: 'utf8' })
      .then((text) => {
        console.log('extracting from: ', filePath);
        console.log('length: ', text.length);

        return text;
      })
      .then((text) => {
        const date =
          (text.match(patterns.date) && text.match(patterns.date)[1].trim()) ||
          'no date';

        const rawPresentPoliticians = getPoliticians(text, patterns.present);
        const rawVacantPoliticians = getPoliticians(text, patterns.vacant);

        const presentPoliticians = cleanUp(rawPresentPoliticians).map((el) => [
          date,
          ...el,
          'present'
        ]);
        const vacantPoliticians = cleanUp(rawVacantPoliticians).map((el) => [
          date,
          ...el,
          'vacant'
        ]);

        const session = [...presentPoliticians, ...vacantPoliticians];

        console.log('success!');
        console.log('\n');

        resolve(session);
      })
      .catch((error) => {
        console.log('failed!');
        reject(new Error(error));
      });
  });
}

module.exports = extractPoliticians;
