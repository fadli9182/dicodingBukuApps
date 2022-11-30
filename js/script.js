const books = [];
const RENDER_EVENT = "render";
const SAVED_EVENT = "saved";
const STORAGE_KEY = "BOOKSHELF_APPS";

function saveData() {
  localStorage.setItem("books", JSON.stringify(books));
  document.dispatchEvent(new Event(SAVED_EVENT));
}

function loadData() {
  const data = localStorage.getItem("books");
  if (data !== null) {
    const parsedData = JSON.parse(data);
    books.push(...parsedData);
  }
  renderBooks(books);
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadData();
  }
});

function searchBook(e) {
  e.preventDefault();
  const search = document.getElementById("searchBook").value;
  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()));
  renderBooks(filteredBooks);
}

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", searchBook);

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil disimpan.");
});

function renderBooks(books) {
  console.log(books);

  const bookList = document.getElementById("books");
  bookList.innerHTML = "";

  const completeBookList = document.getElementById("completed-books");
  completeBookList.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBook(book);
    if (!book.isComplete) {
      bookList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
}

function addBook() {
  let title = document.getElementById("judulBuku").value;
  let author = document.getElementById("penulisBuku").value;
  let year = document.getElementById("tahunBuku").value;
  let isComplete = document.getElementById("isComplete").checked;

  const generateID = new Date().getTime();
  const bookObject = generateBookObject(generateID, title, author, year, isComplete);
  books.push(bookObject);

  renderBooks(books);
  alert("Buku berhasil ditambahkan");
  saveData();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("card-book", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${bookObject.id}`);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addBookCompleted(bookObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

function addBookCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  renderBooks(books);
  saveData();
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id == bookId) {
      return book;
    }
  }
  return null;
}
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  renderBooks(books);
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookIndex = findBookIndex(bookId);

  if (bookIndex == null) return;

  if (confirm("Apakah anda yakin ingin menghapus buku ini?") == true) {
    books.splice(bookIndex, 1);
    renderBooks(books);
    saveData();
  } else {
    console.log("cancel");
    return;
  }
}

function findBookIndex(bookId) {
  let index = 0;
  for (const book of books) {
    if (book.id == bookId) {
      return index;
    }
    index++;
  }
  return null;
}
