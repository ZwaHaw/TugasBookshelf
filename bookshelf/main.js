const books = [];
const EVENT_CHANGE = "change-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSELF_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
    alert("Buku Ditambahkan");
    e.target.reset();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function addBook() {
  const inputIdBook = document.getElementById("idbook").value;
  const inputTitle = document.getElementById("title").value;
  const inputAuthor = document.getElementById("author").value;
  const inputYear = document.getElementById("year").value;

  const inputYearValue = new Date(inputYear).getFullYear();

  const generatedID = generateId();
  const newBook = generateNewBook(
    generatedID,
    inputTitle, 
    inputAuthor,
    inputYearValue,
    isReaded
  );
  books.push(newBook);

  saveData();

  document.dispatchEvent(new Event(EVENT_CHANGE));
}


function generateId() {
  return +new Date();
}

function generateNewBook(id, bookTitle, inputAuthor, inputYear, isReaded) {
  return {
    id,
    bookTitle,
    inputAuthor,
    inputYear,
    isReaded,
  };
}

document.addEventListener(EVENT_CHANGE, function () {
  const list = books.length;
  const read = [];
  const unRead = [];
  const unReadBooksList = document.getElementById("books");
  unReadBooksList.innerHTML = "";

  const readBookList = document.getElementById("books-items");
  readBookList.innerHTML = "";

  const unReadBook = document.getElementById("unread-book");
  unReadBook.innerText = "";
  const readBook = document.getElementById("read-book");
  readBook.innerText = "";

  for (const bookItem of books) {
    const bookList = makeBookElement(bookItem);
    if (bookItem.isReaded) {
      readBookList.append(bookList);
      read.push(readBookList);
      readBook.innerText = read.length;
    } else {
      unReadBooksList.append(bookList);
      unRead.push(bookList);
      unReadBook.innerText = unRead.length;
    }
  }
  ifNoList();
  totalOfBooks();
});

function ifNoList() {
  const list = books.length;
  const container = document.querySelector(".no-list");
  if (list == 0) {
    container.classList.add("picture");
  } else {
    container.classList.remove("picture");
  }
}

const resetList = document.getElementById("btn-reset");
resetList.addEventListener("click", function () {
  const reset = books.length;
  if (reset == 0) {
    alert("List Kosong");
  } else {
    if (confirm("Hapus Semua List?")) {
      resetBookList();
      alert("Semua List Dihapus");
    }
  }
});

function resetBookList() {
  books.length = 0;
  document.dispatchEvent(new Event(EVENT_CHANGE));
  saveData();
}

function totalOfBooks() {
  const totalBooks = document.getElementById("total-books");
  totalBooks.innerHTML = books.length;
}

document.getElementById("bookTitle").addEventListener("keyup", function () {
  const inputValue = document.getElementById("bookTitle").value;
  const listBooks = document.querySelectorAll(".list-item");

  for (let i = 0; i < listBooks.length; i++) {
    if (!inputValue || listBooks[i].textContent.toLowerCase().indexOf(inputValue) > -1) {
      listBooks[i].classList.remove("hide");
    } else {
      listBooks[i].classList.add("hide");
    }
  }
});

document.getElementById("btn-submit").addEventListener("click", function () {
  isReaded = true;
});

document.getElementById("btn-unread").addEventListener("click", function () {
  isReaded = false; 
});

function markAsRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isReaded = true;
  document.dispatchEvent(new Event(EVENT_CHANGE));
  saveData();
}

function findBook(bookId) {
  for (const todoItem of books) {
    if (todoItem.id === bookId) {
      return todoItem;
    }
  }
  return null;
}

function undoBookTitleFromReaded(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isReaded = false;
  document.dispatchEvent(new Event(EVENT_CHANGE));
  saveData();
}

function removeBookTitleFromReaded(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(EVENT_CHANGE));
  saveData();
}

function addBookTitleToReadList(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isReaded = true;
  document.dispatchEvent(new Event(EVENT_CHANGE));
  saveData();
}

function findBook(bookId) {
  for (const todoItem of books) {
    if (todoItem.id === bookId) {
      return todoItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(EVENT_CHANGE));
}

document.addEventListener("DOMContentLoaded", function () {
  let isListViewVisible = false;
  const viewListButton = document.getElementById("btn-view");

  viewListButton.addEventListener("click", function () {
    isListViewVisible = !isListViewVisible;
    const readBookList = document.getElementById("books-items");
    const unReadBooksList = document.getElementById("books");
    if (isListViewVisible) {
      readBookList.style.display = "block";
      unReadBooksList.style.display = "block";
      viewListButton.textContent = "Sembunyikan List";
    } else {
      readBookList.style.display = "none";
      unReadBooksList.style.display = "none";
      viewListButton.textContent = "Lihat List";
    }
  });
});

function makeBookElement(newBook) {
  const bookId = document.createElement("p");
  bookId.innerText = `ID: ${newBook.id}`;

  const bookTitle = document.createElement("h2");
  bookTitle.innerText = `Judul: ${newBook.bookTitle}`;

  const authorName = document.createElement("p");
  authorName.innerText = `Penulis: ${newBook.inputAuthor}`;
  
  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun Terbit: ${newBook.inputYear}`;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(bookId, bookTitle, authorName, bookYear);

  const container = document.createElement("div");
  container.classList.add("item", "list-item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${newBook.id}`);

  if (newBook.isReaded) {
    const undoButton = document.createElement("img");
    undoButton.setAttribute("src", "assets/undo3.png");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      if (confirm("Anda Yakin Mengembalikan Buku ke Daftar Belum DIbaca?")) {
        undoBookTitleFromReaded(newBook.id);
        alert("Buku Dikembalikan ke List Belum Dibaca");
      } else {
      }
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      if (confirm("Anda Yakin Menghapus Buku Dari Bookshelf?")) {
        removeBookTitleFromReaded(newBook.id);
        alert("Buku Dihapus Dari Bookshelf");
      } else {
      }
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      if (confirm("Anda Yakin Buku Telah Dibaca?")) {
        addBookTitleToReadList(newBook.id);
        alert("Buku Dipindahkan ke List Sudah Dibaca");
      } else {
      }
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      if (confirm("Anda Yakin Menghapus Buku Dari Bookshelf?")) {
        removeBookTitleFromReaded(newBook.id);
        alert("Buku Dihapus Dari Bookshelf");
      } else {
      }
    });

    container.append(checkButton, trashButton);
  }

  return container;
}
