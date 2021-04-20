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
// let countries = [];
let filterCountries = [];
let filterCountriesNames = [];
let filterCountriesNamesLC = [];

refs.searchForm.addEventListener('input', _.debounce(onInputChange, 500));
refs.searchForm.addEventListener('submit', evt => {
  evt.preventDefault();
  // console.log('sabmit');
  if (filterCountriesNamesLC.includes(query))
    renderCountrie(filterCountries[filterCountriesNamesLC.indexOf(query)]);
});

function onInputChange(evt) {
  query = evt.target.value.toLowerCase().trim();
  API.fetchCountries(query).then(analyse).catch(onFetchError);
}

function analyse(resp) {
  console.clear();
  console.table(`${resp.length} - matches`);

  if (resp.length === 1 && query.includes(' ')) return renderCountrie(resp[0]);

  filterCountries = resp.filter(arr =>
    checkInclude(arr.name.toLowerCase(), query),
  );

  console.log(`${filterCountries.length} - filtered`);

  if (filterCountries.length === 1) {
    return renderCountrie(filterCountries[0]);
  }
  // if (resp.length < 11) {
  // countries = [...resp];
  // filterCountries = countries.filter(arr =>
  //   checkInclude(arr.name.toLowerCase(), query),
  // );
  // }

  if (filterCountries.length > 10) return notify();
  if (filterCountries.length > 1) return moreOne();

  if (!_.isArray(resp) || !filterCountries.length) return onFetchError();
  // 1. от введения следующей буквы, которой нет ни в одной из стран на экране
  // 2. от случая, когда фильтация убрала все страны отобранные BACKом
  // (но сюда также подпадает ситуация, когда запрос содержит пробелы)
  console.log('WFWFWFWFWFWFWFWFWFWFWFWFWFWFWFWFWF');
}

function renderCountrie(countrie) {
  refs.cardContainer.innerHTML = countrieTempl(countrie);
}

function moreOne() {
  // if (!(countries.length === filterCountries.length))

  if (!filterCountries.length) onFetchError();

  if (filterCountries.length === 1) {
    return renderCountrie(filterCountries[0]);
  }

  filterCountriesNames = filterCountries.map(arr => arr.name);
  filterCountriesNamesLC = filterCountriesNames.map(el => el.toLowerCase());

  if (filterCountries.length)
    error('If search Countrie in response, press Enter.');
  refs.cardContainer.innerHTML = countriesTempl(filterCountriesNames);
}

function notify() {
  refs.cardContainer.innerHTML = '';

  error({
    text: 'Too many matches found. Please enter a more specific query!',
  });
}

function onFetchError() {
  refs.cardContainer.innerHTML = '';
  if (filterCountries.length > 10) return notify();
  error('There is no such sequence of characters');
}

function checkInclude(countrie, query) {
  // boolean - проверяет есть ли страна, включающая набор букв в поле ввода
  return countrie
    .split(' ')
    .map(el => {
      return el.substring(0, query.length);
    })
    .includes(query);
}

// function renderCountrieByName(name) {
//   console.log(filterCountriesNames.indexOf(name));

//   renderCountrie(filterCountries[filterCountriesNames.indexOf(name)]);
// }

// function checkCountrieInclude(arr, query) {
//   arr.includes(query);
// }
