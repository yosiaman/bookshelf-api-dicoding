const { nanoid } = require('nanoid');
const bookShelf = require('./bookshelf');

// function for add a book
function addBookHandler(request, h) {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(10);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage ? true : false;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };
  bookShelf.push(newBook);
  const isSuccess = bookShelf.filter(book => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan'
  });
  response.code(201);
  return response;
}

// function for get all books
function getAllBooksHandler(request) {
  let books = bookShelf;
  const { reading, finished, name } = request.query;

  if (reading !== undefined) {
    books = books.filter(item => item.reading === !!Number(reading));
  }

  if (finished !== undefined) {
    books = books.filter(item => item.finished === !!Number(finished));
  }

  if (name !== undefined) {
    books = books.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
  }

  return {
    status: 'success',
    data: {
      books: books.map(item => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher
      }))
    }
  };
}

// function for get book by id
function getBookByIdHandler(request, h) {
  const { bookId } = request.params;
  const book = bookShelf.filter(item => item.id === bookId)[0];
  
  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;
}

// function to edit a book info
function editBookByIdHandler(request, h) {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  const index = bookShelf.findIndex(item => item.id === bookId);
  if (index !== -1) {
    bookShelf[index] = {
      ...bookShelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response;
}

// function to delete a book by id
function deleteBookByIdHandler(request, h) {
  const { bookId } = request.params;
  const index = bookShelf.findIndex(item => item.id === bookId);
  if (index !== -1) {
    bookShelf.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  response.code(404);
  return response;
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}