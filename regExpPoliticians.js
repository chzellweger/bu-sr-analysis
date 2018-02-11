function regExpPoliticians(text, regExp) {
  let result = [];
  let matched;

  while ((matched = regExp.exec(text))) {
    result.push(matched[1]);
  }
  return result
}

module.exports = regExpPoliticians;
