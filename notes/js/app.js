'use strict'

function createElement(tag, props, ...children) {
  let element = document.createElement(tag);

  if (props)
    Object.keys(props).forEach(key => element[key] = props[key]);

  children.forEach(child => {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }
    element.appendChild(child);
  });

  return element;
}




const h1 = createElement('h1', null, 'Notes');
const List = createElement('ul', { id: 'list' });
const addTitle = createElement('input', { id: 'addTitle', type: 'text',placeholder: 'title' });
const addText = createElement('textarea', { id: 'addText'})
const addButton = createElement('button', { id: 'add-button', type: 'submit', onclick: setupPagination }, 'tape');
const form = createElement('form', { id: 'form', onsubmit: addItem }, addTitle, addText, addButton);
const pagination = createElement('ul', { className: 'pagination', onclick: paginationHendler })
const app = document.getElementById('app');

app.appendChild(h1);
app.appendChild(List);
app.appendChild(form);
app.appendChild(pagination);



function getArrayFromStorage() {
  let Notes = localStorage.getItem('Notes');
  let array = Notes ? JSON.parse(Notes) : [];
  return array;
}

function getTime(now){
  return new Date(now).toString().slice(16, 24);
}


function init() {
  let array = getArrayFromStorage();
  array.forEach(obj => {
    let time = new Date(obj.time).toString().slice(16, 24);

    let item = createItem(obj.title, obj.note, time);
    item.dataset.time = obj.time;
    List.appendChild(item);
  });
};
init();


function writeStorage(time, title, note) {
  let array = getArrayFromStorage();

  array.push({
    time: time,
    title: title,
    note: note
  });

  array = JSON.stringify(array);
  localStorage.setItem('Notes', array);

}



function createItem(caption, memo, time) {
  let title = createElement('span', { className: 'title' }, caption);
  let note = createElement('span', { className: 'note' }, memo);
  let editTitle = createElement('input', { type: 'text', className: 'editTitle' });
  let editText = createElement('textarea', { className: 'editText' });
  let date = createElement('span', { className: 'date' }, time);
  let basket = createElement('i', { className: 'fa fa-trash' });
  let pancil = createElement('i', { className: 'fa fa-pencil-square-o' });
  let editButton = createElement('button', { className: 'editButton', onclick: editItem }, pancil);
  let deleteButton = createElement('button', { className: 'deleteButton', onclick: deleteItem }, basket);
  let item = createElement('li', { className: 'item', }, title, note, editTitle, editText,date, editButton, deleteButton);
  return item;
}



function addItem(event) {
  event.preventDefault();

  let title = addTitle.value;
  let note = addText.value;

  if (title === '') return // alert('Необходимо ввести.');
  // if ( note === '') return // alert('Необходимо ввести.');

  let now = Date.now();
  let time = getTime(now);
  let item = createItem(title, note, time);

  writeStorage(item.dataset.time = now, title, note);
  List.appendChild(item);

  addTitle.value = addText.value =  '';
}


function editItem() {
  let item = this.parentNode;
  let title = item.querySelector('.title');
  let note = item.querySelector('.note');
  let editTitle = item.querySelector('.editTitle');
  let editText = item.querySelector('.editText');
  let isEditing = item.classList.contains('editing');

  if (isEditing) {
    title.textContent = editTitle.value;
    note.textContent = editText.value;
    this.innerHTML = "<i class='fa fa-pencil-square-o'></i>";

    let array = getArrayFromStorage();

    array.forEach((obj) => {
      if (obj.time == item.dataset.time) {
        obj.title = editTitle.value;
        obj.note = editText.value;
        let date = item.querySelector('.date');
        let now = Date.now();
        let time = getTime(now);
        obj.time = item.dataset.time  = now;
        date.innerHTML = time;
      };
    });
    localStorage.setItem('Notes', JSON.stringify(array));

  } else {
    editTitle.value = title.textContent;
    editText.value = note.textContent;
    this.innerHTML = "<i class='fa fa-floppy-o'></i>";

  }

  item.classList.toggle('editing');

}


function deleteItem() {
  let array = getArrayFromStorage();
  let item = this.parentNode;

  let index;
  array.forEach((obj, i) => {
    if (obj.time == item.dataset.time) {
      index = i;
    }
  })
  array.splice(index, 1);
  localStorage.setItem('Notes', JSON.stringify(array));

  List.removeChild(item);
  setupPagination();

}



let mainPage, count, items, length;

function setupPagination() {

  setTimeout(function () {

    items = List.querySelectorAll('.item');

    items.forEach((item, i) => {
      item.dataset.num = i + 1;
    })

    count = 5;
    length = getArrayFromStorage().length;
    let countPage = Math.ceil(length / count);

    let str = "";
    let i = 0;

    for (i = 0; i < countPage; i++) {
      str += `<li data-page="${i * count} "id="page${i + 1}" > ${i + 1} </li>`
    }
    pagination.innerHTML = str;


    for (let i = 0; i < items.length; i++) {
      items[i].style.display = "none";
      if (i >= length - length % 5 || (length % 5 == 0 && i >= length - 5)) {
        items[i].style.display = "";
      }
    }

    mainPage = document.getElementById(`page${i}`);
    if (mainPage) mainPage.classList.add("active");

  }, 0)

}



setupPagination();



function paginationHendler(e) {
  let target = e.target;
  let id = target.id;

  if (target.tagName !== "LI") return;


  let dataPage = +target.dataset.page; // 0 or 5

  mainPage.classList.remove("active");
  mainPage = document.getElementById(id);
  mainPage.classList.add("active");

  let j = 0;
  for (let i = 0; i < items.length; i++) {
    let dataNum = items[i].dataset.num;
    // if (dataNum <= dataPage || dataNum >= dataPage) {
    items[i].style.display = "none";
    // }
  }

  for (let i = dataPage; i < items.length; i++) {
    if (j >= count) break;
    items[i].style.display = "";
    j++;
  }


}






















