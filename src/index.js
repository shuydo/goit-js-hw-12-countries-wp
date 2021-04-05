import './styles.css';
// ========= pnotyfy =========
// import { info } from '@pnotify/core'; //-blue, alert-yellow(работает
// даже если при вызове ниже не поменять! отловила мой! success - салатовый,
// error - red с полосками по диагонали и треугольник с "!") ,
import { error } from '@pnotify/core';

import { defaults } from '@pnotify/core';
defaults.width = '361px'; // def 360
// defaults.minHeight = '16px'; // def 16

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css'; // цвет темы. Если убрать - бу.белая
// import * as Confirm from '@pnotify/confirm'; // подтверждение на закрытие
// import '@pnotify/confirm/dist/PNotifyConfirm.css'; // тож не нужен без подтвержд.

function notify() {
  error({
    // title: 'Button Clicked',
    text:
      // 'You have clicked the button. You may now complete the process of reading the notice.',
      'Too many matches found. Please enter a more specific query!',
    // 'Добавьте букв',
    // modules: new Map([
    //   [
    //     Confirm,
    //     {
    //       confirm: true,
    //       // buttons: [
    //       //   {
    //       //     text: 'Ok',
    //       //     primary: true,
    //       //     click: notice => {
    //       //       notice.close();
    //       //     },
    //       //   },
    //       // ],
    //     },
    //   ],
    // ]),
  });
}

// const App = document.getElementById('app');

// App.innerHTML = `
// <div class="container">
//   <h1>PNotify 5 in Vanilla ES6!</h1>
//   <button>Notify me!</button>
// </div>
// `;

// App.querySelector('button').addEventListener('click', click);
// ====== pnotify end ============

var _ = require('lodash');

console.clear();
// console.log(_.isEqual(1,2));
// import 'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js';

import API from './js/api-service';
import countrieTempl from './templ-countrie.hbs';
import countriesTempl from './to-ten.hbs';

import getRefs from './js/get-refs';

const refs = getRefs();
// console.log(_.defaults({ a: 1 }, { a: 3, b: 2 }));
// refs.searchForm.addEventListener('submit', onSearch);

refs.searchForm.addEventListener('input', _.debounce(onInputChange, 500));
// let inputCbInvocationCounter = 0;

function onInputChange(event) {
  // inputCbInvocationCounter += 1;
  if (event.target.value)
    API.fetchCountries(event.target.value)
      .then(res => {
        console.table(`${res.length} - matches`);
        if (res.length > 10) return notify();
        // (refs.cardContainer.innerHTML =
        //   'Too many matches found. Please enter a more specific query!');

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
      // console.table(res);
      return renderCountrie(res[0]);
    })
    .catch(onFetchError)
    .finally(() => form.reset());
}

function onFetchError(error) {
  console.log(error);
  alert('There is no such sequence of characters');
}

function renderCountrie(countrie) {
  const arrayLang = countrie.languages;
  const pureLangs = arrayLang.map(arrayLang => {
    return arrayLang.name;
  });

  const { name, capital, population, langus = pureLangs, flag } = countrie;

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
