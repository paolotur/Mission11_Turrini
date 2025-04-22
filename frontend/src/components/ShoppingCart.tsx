import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ShoppingCart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <button className="btn btn-link" onClick={handleContinueShopping}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.bookId}>
                    <td>{item.title}</td>
                    <td>{item.author}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.bookId, parseInt(e.target.value))}
                        className="form-control w-auto"
                      />
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item.bookId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-end"><strong>Total:</strong></td>
                  <td colSpan={2}>${getTotalPrice().toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-secondary" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
            <button className="btn btn-primary">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart; 