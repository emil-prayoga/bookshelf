const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

const RENDER_EVENT = 'render-book';
const EDIT_EVENT = 'edit-book';

let editTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('bookForm');
  const searchForm = document.getElementById('searchBook');

  submitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (editTargetId) {
      updateBook();
    } else {
      addBook();
    }
    submitForm.reset();
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = document.getElementById('searchBookTitle').value.toLowerCase();
    searchBook(keyword);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function isStorageExist() {
  return typeof Storage !== 'undefined';
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const bookObject = generateBookObjectFromForm();
  books.push(bookObject);
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function updateBook() {
  const updatedData = generateBookObjectFromForm();
  const index = books.findIndex((book) => book.id === editTargetId);
  if (index !== -1) {
    books[index] = { ...updatedData, id: editTargetId };
  }
  editTargetId = null;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
  document.getElementById('bookFormSubmit').style.fontWeight = 'normal';
  document.getElementById('bookFormSubmit').innerHTML = 'Masukkan Buku ke rak <span> Belum selesai dibaca</span>';

 const sectionTitle = document.querySelector('section h2');
  if (sectionTitle) {
    sectionTitle.innerText = 'Tambah Buku';
  }
}

function generateBookObjectFromForm() {
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = Number(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;
  return {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
}

function makeBook(book) {
  const title = document.createElement('h3');
  title.innerText = book.title;
  title.dataset.testid = 'bookItemTitle';

  const author = document.createElement('p');
  author.innerText = `Penulis: ${book.author}`;
  author.dataset.testid = 'bookItemAuthor';

  const year = document.createElement('p');
  year.innerText = `Tahun: ${book.year}`;
  year.dataset.testid = 'bookItemYear';

  const container = document.createElement('div');
  container.classList.add('book-item');
  container.dataset.bookid = book.id;
  container.dataset.testid = 'bookItem';

  const buttonContainer = document.createElement('div');

  const toggleButton = document.createElement('button');
  toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.dataset.testid = 'bookItemIsCompleteButton';
  toggleButton.addEventListener('click', () => toggleBookStatus(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus Buku';
  deleteButton.dataset.testid = 'bookItemDeleteButton';
  deleteButton.addEventListener('click', () => deleteBook(book.id));

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit Buku';
  editButton.dataset.testid = 'bookItemEditButton';
  editButton.addEventListener('click', () => setFormToEdit(book));

  buttonContainer.append(toggleButton, deleteButton, editButton);

  container.append(title, author, year, buttonContainer);
  return container;
}

function toggleBookStatus(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function setFormToEdit(book) {
  document.getElementById('bookFormTitle').value = book.title;
  document.getElementById('bookFormAuthor').value = book.author;
  document.getElementById('bookFormYear').value = book.year;
  document.getElementById('bookFormIsComplete').checked = book.isComplete;
  editTargetId = book.id;
  document.getElementById('bookFormSubmit').innerHTML = 'Update Buku';
  document.getElementById('bookFormSubmit').style.fontWeight = 'bold';


   const sectionTitle = document.querySelector('section h2');
  if (sectionTitle) {
    sectionTitle.innerText = 'Edit Buku';
  }
}

function searchBook(keyword) {
  console.log('Keyword dicari:', keyword);
  console.log('Semua data buku:', books);

  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');
  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(keyword));
  console.log('Buku setelah filter:', filteredBooks); 

  for (const book of filteredBooks) {
    const bookElement = makeBook(book); 
    if (book.isComplete) {
      completeList.append(bookElement);
    } else {
      incompleteList.append(bookElement);
    }
  }
}


document.addEventListener(RENDER_EVENT, () => {
  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');
  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  for (const book of books) {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      completeList.append(bookElement);
    } else {
      incompleteList.append(bookElement);
    }
  }
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const keyword = document.getElementById('searchBookTitle').value.toLowerCase();
  searchBook(keyword);
});