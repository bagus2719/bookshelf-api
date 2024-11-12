// Mengimpor array 'books' untuk menyimpan data buku di memori dan 'nanoid' untuk membuat ID unik
const books = require("../books");
const { nanoid } = require("nanoid");

// Handler untuk menambahkan buku baru
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

  // Validasi: Memastikan properti 'name' ada, jika tidak berikan respons gagal
  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  }

  // Validasi: Memastikan 'readPage' tidak lebih besar dari 'pageCount'
  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  // Membuat data buku baru dengan properti tambahan yang dihasilkan di server
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  // Membuat objek buku baru dengan semua data yang diperlukan
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

  // Menambahkan buku ke array 'books' yang menyimpan semua data buku
  books.push(newBook);

  // Mengembalikan respons sukses dengan ID buku yang baru ditambahkan
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

// Handler untuk mendapatkan seluruh buku yang difilter berdasarkan query parameters
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // Mulai dengan array 'books' yang berisi semua buku
  let filteredBooks = books;

  // Filter berdasarkan nama buku jika query 'name' ada
  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter berdasarkan status 'reading' jika query 'reading' ada
  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter(
      (book) => book.reading === (reading === '1')
    );
  }

  // Filter berdasarkan status 'finished' jika query 'finished' ada
  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === (finished === '1')
    );
  }

  // Mengembalikan respons dengan hanya id, name, dan publisher dari buku-buku yang difilter
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

// Handler untuk mendapatkan detail buku berdasarkan 'bookId' dari path parameter
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Mencari buku berdasarkan 'bookId'
  const book = books.find((b) => b.id === bookId);

  // Jika buku tidak ditemukan, kembalikan respons gagal dengan status 404
  if (!book) {
    return h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
  }

  // Jika buku ditemukan, kembalikan respons sukses dengan detail buku
  return {
    status: "success",
    data: {
      book,
    },
  };
};

// Handler untuk memperbarui data buku berdasarkan 'bookId'
const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
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

  // Validasi: Memastikan 'name' ada
  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  // Validasi: Memastikan 'readPage' tidak lebih besar dari 'pageCount'
  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  // Mencari indeks buku berdasarkan bookId
  const index = books.findIndex((book) => book.id === bookId);

  // Jika buku dengan bookId tidak ditemukan
  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
  }

  // Memperbarui data buku
  const updatedAt = new Date().toISOString();
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: pageCount === readPage,
    updatedAt,
  };

  // Mengembalikan respons sukses
  return h
    .response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    .code(200);
};

// Handler untuk menghapus buku berdasarkan 'bookId'
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Mencari indeks buku berdasarkan bookId
  const index = books.findIndex((book) => book.id === bookId);

  // Jika buku dengan bookId tidak ditemukan
  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
  }

  // Menghapus buku dari array books
  books.splice(index, 1);

  // Mengembalikan respons sukses
  return h
    .response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    .code(200);
};

// Mengekspor semua handler dalam satu objek agar dapat diakses di tempat lain
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
