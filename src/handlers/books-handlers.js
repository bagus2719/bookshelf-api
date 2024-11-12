const books = require("../books");
const { nanoid } = require("nanoid");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validasi name
  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  }

  // Validasi readPage tidak lebih besar dari pageCount
  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  // Membuat data buku baru
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Menambahkan buku ke array books
  books.push(newBook);

  // Mengembalikan respons sukses
  return h
    .response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    })
    .code(201);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // Mulai dengan semua buku
  let filteredBooks = books;

  // Filter berdasarkan nama (jika query 'name' ada)
  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter berdasarkan status 'reading' (jika query 'reading' ada)
  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter(
      (book) => book.reading === (reading === '1')
    );
  }

  // Filter berdasarkan status 'finished' (jika query 'finished' ada)
  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === (finished === '1')
    );
  }

  // Respons hanya menampilkan id, name, dan publisher dari buku yang difilter
  return h.response({
    status: "success",
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Mencari buku berdasarkan id
  const book = books.find((b) => b.id === bookId);

  // Jika buku tidak ditemukan
  if (!book) {
    return h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
  }

  // Jika buku ditemukan
  return {
    status: "success",
    data: {
      book,
    },
  };
};

// Mengekspor semua handler dalam satu objek
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler };
