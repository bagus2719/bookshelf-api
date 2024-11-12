// Mengimpor handler yang menangani setiap endpoint dari file books-handlers.js
const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
} = require('../handlers/books-handlers');

// Mendefinisikan array 'routes' yang berisi objek konfigurasi untuk setiap endpoint
const routes = [
  {
    method: 'POST',                  // Metode HTTP POST
    path: '/books',                   // Endpoint untuk menambahkan buku baru
    handler: addBookHandler,          // Fungsi handler untuk menambahkan buku baru
  },
  {
    method: 'GET',                    // Metode HTTP GET
    path: '/books',                   // Endpoint untuk mendapatkan daftar semua buku
    handler: getAllBooksHandler,      // Fungsi handler untuk mengambil data semua buku
  },
  {
    method: 'GET',                    // Metode HTTP GET
    path: '/books/{bookId}',          // Endpoint untuk mendapatkan detail buku berdasarkan bookId
    handler: getBookByIdHandler,      // Fungsi handler untuk mengambil data buku berdasarkan ID
  },
  {
    method: 'PUT',                    // Metode HTTP PUT
    path: '/books/{bookId}',          // Endpoint untuk memperbarui data buku berdasarkan bookId
    handler: updateBookByIdHandler,   // Fungsi handler untuk memperbarui data buku
  },
  {
    method: 'DELETE',                 // Metode HTTP DELETE
    path: '/books/{bookId}',          // Endpoint untuk menghapus buku berdasarkan bookId
    handler: deleteBookByIdHandler,   // Fungsi handler untuk menghapus buku
  },
];

// Mengekspor array 'routes' sehingga dapat diimpor dan digunakan dalam konfigurasi server
module.exports = routes;
