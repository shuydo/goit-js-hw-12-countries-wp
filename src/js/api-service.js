// const rootUrl = 'https://pokeapi.co/api/v2';
// function fetchPokemon(id) {
//   const url = `${rootUrl}/pokemon/${id}`;
//   return fetch(url).then(response => response.json());
// }
// export default { fetchPokemon };

// const rootUrl = 'https://restcountries.eu/rest/v2/alpha';

const rootUrl = 'https://restcountries.eu/rest/v2/name';

function fetchCountries(name) {
  const url = `${rootUrl}/${name}`;
  // console.log('API: ',url);
  // console.log(fetch(url).then(response => response.json()));
  return fetch(url).then(response => response.json());
}
export default { fetchCountries };
