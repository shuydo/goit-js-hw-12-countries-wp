import './styles.css';

import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import API from './js/api-service';
import countrieTempl from './templ-countrie.hbs';
import countriesTempl from './to-ten.hbs';
import getRefs from './js/get-refs';
const refs = getRefs();
const _ = require('lodash');

let query = '';
let filterCountries = [];
let filterCountriesNamesLC = [];

refs.searchForm.addEventListener('input', _.debounce(onInputChange, 500));
refs.searchForm.addEventListener('submit', evt => {
  evt.preventDefault();
  if (filterCountriesNamesLC.includes(query))
    renderCountrie(filterCountries[filterCountriesNamesLC.indexOf(query)]);
});

function onInputChange(evt) {
  if (evt.target.value.toLowerCase().trim().includes(query) && query) {
    query = evt.target.value.toLowerCase().trim();
    return analyse(filterCountries);
  }
  console.clear();
  query = evt.target.value.toLowerCase().trim();
  API.fetchCountries(query).then(analyse).catch(onFetchError);
}

function analyse(resp) {
  console.table(`${resp.length} - matches`);

  if (resp.length === 1 && query.includes(' ')) return renderCountrie(resp[0]);

  filterCountries = resp.filter(arr =>
    checkInclude(arr.name.toLowerCase(), query),
  );

  console.log(`${filterCountries.length} - filtered`);

  if (filterCountries.length === 1) {
    return renderCountrie(filterCountries[0]);
  }
  if (!_.isArray(resp) || !filterCountries.length) return onFetchError();
  if (filterCountries.length > 10) return notify();
  if (filterCountries.length > 1) return moreOne();
}

function renderCountrie(countrie) {
  refs.cardContainer.innerHTML = countrieTempl(countrie);
}

function moreOne() {
  const filterCountriesNames = filterCountries.map(arr => arr.name);
  filterCountriesNamesLC = filterCountriesNames.map(el => el.toLowerCase());

  error('If search Countrie in answer, press Enter.');
  refs.cardContainer.innerHTML = countriesTempl(filterCountriesNames);
}

function notify() {
  refs.cardContainer.innerHTML = '';
  error('Too many matches found. Please enter a more specific query!');
}

function onFetchError() {
  refs.cardContainer.innerHTML = '';
  if (filterCountries.length > 10) return notify();
  error('There is no such sequence of characters');
}

function checkInclude(countrie, query) {
  // (boolean) проверяет есть ли страна, включающая набор букв в поле ввода
  return countrie
    .split(' ')
    .map(el => {
      return el.substring(0, query.length);
    })
    .includes(query);
}
