const rootUrl = 'https://restcountries.eu/rest/v2/name';

function fetchFullName(name) {
  const url = `${rootUrl}/${name}?fullText=true`;
  return fetch(url).then(response => response.json());
}
export default { fetchFullName };