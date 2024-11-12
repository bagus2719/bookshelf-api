// Mengimpor framework Hapi dan daftar rute dari file books-routes.js
const Hapi = require('@hapi/hapi');
const routes = require('./routes/books-routes');

// Fungsi asinkron untuk inisialisasi server Hapi
const init = async () => {
  // Membuat server Hapi dengan konfigurasi port dan host
  const server = Hapi.server({
    port: 9000,         // Menetapkan port 9000 sebagai port server
    host: 'localhost'   // Menetapkan 'localhost' sebagai host server
  });

  // Menambahkan rute-rute yang didefinisikan di file books-routes.js ke server
  server.route(routes);

  // Memulai server dan menampilkan pesan jika berhasil
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`); // Informasi URI server
};

// Menangani error jika terjadi penolakan tanpa penanganan pada promise (error tak tertangani)
process.on('unhandledRejection', (err) => {
  console.log(err);    // Menampilkan error di konsol
  process.exit(1);     // Menghentikan proses dengan kode exit 1
});

// Memanggil fungsi init untuk memulai server
init();
