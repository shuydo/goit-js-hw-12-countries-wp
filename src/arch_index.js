import './styles.css';

import API from './js/api-service';
import countrieTempl from './templ-countrie.hbs';
import countriesTempl from './to-ten.hbs';

import getRefs from './js/get-refs';

// const template = Handlebars.compile(countrieTempl.trim());
// const templateTen = Handlebars.compile(countriesTempl.trim());

const refs = getRefs();
// console.log(refs);

refs.searchForm.addEventListener('submit', onSearch);
// const outputRef = document.querySelector('.js-output');
// let inputCbInvocationCounter = 0;

refs.searchForm.addEventListener('input', _.debounce(onInputChange, 300));

function onInputChange(event) {
  inputCbInvocationCounter += 1;

  API.fetchCountries(event.target.value)
    .then(res => {
      console.table('curren number Count:', res.length);
      if (res.length > 10)
        return (refs.cardContainer.innerHTML =
          'Too many matches found. Please enter a more specific query!');

      if (res.length > 1) return renderCountrieTen(res);
      return renderCountrie(res[0]);
    })
    .catch(onFetchError);
}

function onSearch(evt) {
  evt.preventDefault();
  const form = evt.currentTarget;
  const searchQuery = form.elements.query.value;

  API.fetchCountries(searchQuery)
    .then(res => {
      console.table(res);
      return renderCountrie(res[0]);
    })
    .catch(onFetchError)
    .finally(() => form.reset());
}

function onFetchError(error) {
  console.log(error);
  alert('alarm!!!!!!!!!!');
}

function renderCountrie(countrie) {
  const arrayLang = countrie.languages;
  const pureLangs = arrayLang.map(arrayLang => {
    return arrayLang.name;
  });

  const { name, capital, population, langus = pureLangs, flag } = countrie;

//   refs.cardContainer.innerHTML = template({
//     name,
//     capital,
//     population,
//     langus,
//     flag,
//   });
// }

  refs.cardContainer.innerHTML = countrieTempl({
    name,
    capital,
    population,
    langus,
    flag,
  });
}

function renderCountrieTen(countries) {
  const arrayNames = countries.map(countries => {
    return countries.name;
  });
  refs.cardContainer.innerHTML = countriesTempl(arrayNames);
}

// function renderCountrieTen(countries) {
//   const arrayNames = countries.map(countries => {
//     return countries.name;
//   });
//   refs.cardContainer.innerHTML = templateTen(arrayNames);
// }
