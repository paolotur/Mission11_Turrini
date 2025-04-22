import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Book } from './types/Books';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Book[]>(`/api/books?page=${page}&pageSize=${pageSize}&sort=Title&order=${sortOrder}`);
        setBooks(response.data);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, pageSize, sortOrder]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Book List</h2>

      <div className="d-flex align-items-center mb-3">
        <label className="me-2">Results per page:</label>
        <select
          className="form-select w-auto"
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
            setPage(1); // Reset to first page on page size change
          }}
        >
          {[5, 10, 20].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        <button
          className="btn btn-outline-primary ms-auto"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          Sort by Title ({sortOrder.toUpperCase()})
        </button>
      </div>

      {books.length === 0 ? (
        <div className="alert alert-info">No books found.</div>
      ) : (
        <>
          <ul className="list-group">
            {books.map(book => (
              <li key={book.bookId} className="list-group-item">
                <strong>{book.title}</strong> by {book.author}<br />
                <small>
                  {book.publisher} | {book.category} | {book.pageCount} pages<br />
                  ISBN: {book.isbn} | ${book.price.toFixed(2)}
                </small>
              </li>
            ))}
          </ul>

          <div className="mt-4 d-flex justify-content-between">
            <button
              className="btn btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookList;
