// Mengimpor array 'books' untuk menyimpan data buku di memori dan 'nanoid' untuk membuat ID unik
const books = require("../books");
const { nanoid } = require("nanoid");

// Handler untuk menambahkan buku baru
const addBookHandler = (request, h) => {
  // Mengambil data dari request payload
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
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  // Membuat data buku baru dengan properti tambahan yang dihasilkan di server
  const id = nanoid(16); // ID unik menggunakan nanoid
  const insertedAt = new Date().toISOString(); // Tanggal saat buku ditambahkan
  const updatedAt = insertedAt; // Tanggal saat buku terakhir diperbarui
  const finished = pageCount === readPage; // Status 'finished' tergantung pada apakah semua halaman sudah dibaca

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
  // Mengambil nilai query 'name', 'reading', dan 'finished' dari request
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
      (book) => book.reading === (reading === '1') // True jika '1', false jika '0'
    );
  }

  // Filter berdasarkan status 'finished' jika query 'finished' ada
  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === (finished === '1') // True jika '1', false jika '0'
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
  // Mengambil 'bookId' dari parameter request
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

// Mengekspor semua handler dalam satu objek agar dapat diakses di tempat lain
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler };
