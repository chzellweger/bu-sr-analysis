module.exports = function cleanUpPoliticiansEntries(rawPoliticiansArray) {
  const cleanedArray = rawPoliticiansArray
    .reduce(function combineSessions(session, partSession) {
      return [...session, ...partSession.split('\n')];
    }, [])
    .map(function cleanName(politician) {
      let politicianNameArray = politician.split(' ');
      let cleanName = politicianNameArray.reverse().join(' ');
      return cleanName;
    })
    .map(function joinData(politician) {
      return [politician.trim()];
    })
    .filter(function deleteEmptyElements(element) {
      return element[0].length > 0
    });
  return cleanedArray
};
