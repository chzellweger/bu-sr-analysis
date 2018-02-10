function regExpPoliticians(text, regExp) {
  const pattern = regExp;
  let result = [];
  let matched;

  while ((matched = regExp.exec(text))) {
    result.push(matched[1]);
  }
  return result
}

module.exports = regExpPoliticians;
