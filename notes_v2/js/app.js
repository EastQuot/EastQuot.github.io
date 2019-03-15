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
const addTitle = createElement('input',
  { id: 'addTitle', type: 'text', placeholder: 'title', autocomplete: "off" });
const addText = createElement('textarea', { id: 'addText' })
const addButton = createElement('button', { id: 'add-button', type: 'submit' }, 'tape');
const form = createElement('form', { id: 'form', onsubmit: addItem }, addTitle, addText, addButton);
const pagination = createElement('ul', { className: 'pagination' });
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

function getTime(now) {
  return new Date(now).toString().slice(16, 24);
}


function HandlePage() {
  localStorage.setItem('page', event.target.innerHTML);
  event.target.classList.toggle('active');

  PaginationInit();
};

// let length, ceilItem, floorItem, currentPage, allPage;

function PaginationInit(arg) {
  let array = getArrayFromStorage();
  let fragment = document.createDocumentFragment();
  List.innerHTML = '';

  if (array.length < 5) {

    array.forEach(obj => {
      let time = getTime(obj.time);
      let item = createItem(obj.title, obj.note, time);
      item.dataset.time = obj.time;
      fragment.appendChild(item);
    });
    List.appendChild(fragment)

  } else {

    pagination.innerHTML = '';

    let currentPage = localStorage.getItem('page');
    let count = 5
    let length = array.length;
    let allPage = Math.ceil(length / count);
    let floorItem = count * currentPage - count;
    let ceilItem = count * allPage;


    if (!currentPage) localStorage.setItem('page', `${allPage}`)

    for (let i = 1; i <= allPage; i++) {
      let li = createElement('li', { onclick: HandlePage }, `${i}`);
      li.classList.remove('active');
      if (li.innerHTML == currentPage) li.classList.add('active');
      pagination.appendChild(li);
    }

    if (length == ceilItem && arg) {
      floorItem  += 5;
      localStorage.setItem('page', `${allPage+1}`);
    }

    if (currentPage - 1 == allPage) {
      floorItem = count * allPage - count;
      localStorage.setItem('page', `${allPage}`);
    }


    for (let i = floorItem; i < length && i < floorItem + count; i++) {
      let time = getTime(array[i].time);
      let item = createItem(array[i].title, array[i].note, time);
      item.dataset.time = array[i].time;
      fragment.appendChild(item);
    }

    // if (length / count - currentPage > 0 && length / count - currentPage < 1) {
    //   console.log(1)
    //   floorItem = Math.ceil(length / count);
    //   localStorage.setItem('page', `${Math.ceil(length / count)}`)
    // }

    
    
    List.appendChild(fragment)
    
  }


};
PaginationInit();



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
  let item = createElement('li', { className: 'item', }, title, note, editTitle, editText, date, editButton, deleteButton);
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

  // if (ceilItem == length) {
  //     floorItem  += 5;
  //     localStorage.setItem('page', `${allPage+1}`);
  // }

  PaginationInit(true);


  addTitle.value = addText.value = '';
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
        obj.time = item.dataset.time = now;
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
  PaginationInit()

}

























