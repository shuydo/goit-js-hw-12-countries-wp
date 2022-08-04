// const rootUrl = 'https://restcountries.eu/rest/v2/name';
// https://restcountries.com/v2/alpha/col
const rootUrl = 'https://restcountries.com/v2/name';

function fetchCountries(name) {
  const url = `${rootUrl}/${name}`;

  return fetch(url).then(response => response.json());
}

export default { fetchCountries };
