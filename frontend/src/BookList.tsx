import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Book } from './types/Books';
import { useCart } from './context/CartContext';
import { Link } from 'react-router-dom';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { addToCart, getTotalItems, getTotalPrice } = useCart();

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Book[]>('/api/books');
        const uniqueCategories = Array.from(
          new Set(response.data.map(book => book.category))
        );
        setCategories(['All', ...uniqueCategories]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Book[]>(
          `/api/books?page=${page}&pageSize=${pageSize}&sort=Title&order=${sortOrder}${
            selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : ''
          }`
        );
        setBooks(response.data);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, pageSize, sortOrder, selectedCategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset to first page when category changes
  };

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
      <div className="row">
        {/* Cart Summary */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Cart Summary</h5>
            </div>
            <div className="card-body">
              <p>Total Items: {getTotalItems()}</p>
              <p>Total Price: ${getTotalPrice().toFixed(2)}</p>
              <Link to="/cart" className="btn btn-primary w-100">
                View Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <h2 className="mb-4">Book List</h2>

          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label">Category:</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Results per page:</label>
              <select
                className="form-select"
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[5, 10, 20].map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                Sort by Title ({sortOrder.toUpperCase()})
              </button>
            </div>
          </div>

          {books.length === 0 ? (
            <div className="alert alert-info">No books found in this category.</div>
          ) : (
            <>
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {books.map((book, index) => (
                  <div key={`${book.bookID}-${index}`} className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{book.title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">by {book.author}</h6>
                        <p className="card-text">
                          <small>
                            {book.publisher} | {book.category} | {book.pageCount} pages<br />
                            ISBN: {book.isbn}
                          </small>
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="h5 mb-0">${book.price.toFixed(2)}</span>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              console.log('Adding book to cart:', book);
                              addToCart(book);
                            }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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
      </div>
    </div>
  );
};

export default BookList;

