console.clear();
import './styles.css';

import { error } from '@pnotify/core';
// import { defaults } from '@pnotify/core';
// defaults.width = 'px'; // def 360 // defaults.minHeight = 'px'; // def 16
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import API from './js/api-service';
import countrieTempl from './templ-countrie.hbs';
import countriesTempl from './to-ten.hbs';
import getRefs from './js/get-refs';
const refs = getRefs();
const _ = require('lodash');
let query = '';

refs.searchForm.addEventListener('input', _.debounce(onInputChange, 500));
refs.searchForm.addEventListener('submit', evt => {
  evt.preventDefault();
  API.fetchFullName(query).then(res => renderCountrie(res[0]));
});

function onInputChange(evt) {
  query = evt.target.value;

  if (evt.target.value)
    API.fetchCountries(evt.target.value)
      .then(res => {
        console.log('from API', res.length);
        if (res.length > 10) return notify();
        if (res.length > 1 || res.length < 11) return renderCountries(res);
        return renderCountrie(res[0]);
      })
      .catch(onFetchError);
}

function renderCountrie(countrie) {
  refs.cardContainer.innerHTML = countrieTempl(countrie);
}

function renderCountries(countries) {
  const arrayNames = countries.map(countries => {
    return countries.name;
  });

  const filterCountries = arrayNames.filter(countrie =>
    checkInclude(countrie, query),
  );

  if (filterCountries.length === 1) {
    return API.fetchFullName(filterCountries[0]).then(res =>
      renderCountrie(res[0]),
    );
  }

  refs.cardContainer.innerHTML = countriesTempl(filterCountries);
}

function notify() {
  refs.cardContainer.innerHTML = '';
  error({
    text: 'Too many matches found. Please enter a more specific query!',
  });
}

function onFetchError(error) {
  console.log(error);
  alert('There is no such sequence of characters');
}

function checkInclude(countrie, query) {
  return countrie
    .toLowerCase()
    .split(' ')
    .map(el => {
      return el.substring(0, query.length);
    })
    .includes(query);
}

// console.log(countries.filter(countrie => checkInclude(countrie, query)));
// API.fetchFullName('ireland').then(res=>console.log(res));
