import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../stylesheet/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/products/get/all');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        setError('');
        await axios.delete(`/api/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
        // Show success feedback
        setError(''); // Clear any previous errors
        setTimeout(() => {
          // This would be better with a proper toast notification
          alert('Product deleted successfully');
        }, 100);
      } catch (err) {
        setError('Failed to delete product. ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredProducts = sortedProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="product-management-container">
      <Sidebar />
      <div className="main-content">
        <div className="products-table-wrapper">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <h2 className="mb-3 mb-md-0">Product Management</h2>
            <div className="d-flex gap-3 flex-wrap">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
                <i className="bi bi-search search-icon"></i>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/products/new')}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Add Product
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }} />
              <p className="mt-3 fs-5">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th onClick={() => handleSort('name')}>
                        Name {sortConfig.key === 'name' && (
                          <i className={`bi bi-caret-${sortConfig.direction === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>
                        )}
                      </th>
                      <th onClick={() => handleSort('shortDescription')}>
                        Description {sortConfig.key === 'shortDescription' && (
                          <i className={`bi bi-caret-${sortConfig.direction === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>
                        )}
                      </th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map(product => (
                      <tr key={product._id} className="product-row"
                        data-brand={product.brand?.name || ''}
                        data-category={product.category?.name || ''}>
                        <td>
                          <div className="image-preview-small">
                            <img
                              src={product.image?.url || '/placeholder.png'}
                              alt={product.name}
                              className="product-image-tiny"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder.png';
                              }}
                            />
                          </div>
                        </td>
                        <td className="product-name-cell">
                          <strong>{product.name}</strong>
                          <div className="brand-category-info">
                            {product.brand?.name} | {product.category?.name}
                          </div>
                        </td>
                        <td className="shortDescription-cell">
                          {product.shortDescription}
                          {product.shortDescription && product.shortDescription.length > 100 && (
                            <button
                              className="btn btn-link btn-sm p-0 ms-2"
                              onClick={() => {
                                // This would be better with a modal or expandable section
                                alert(product.shortDescription);
                              }}
                            >
                              Read more
                            </button>
                          )}
                        </td>
                        <td className='date-cell'>
                          {new Date(product.updatedAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3/$1/$2 at')}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            {/* View Button */}
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => navigate(`/products/view/${product._id}`)}
                              title="View details"
                            >
                              <i className="bi bi-eye"></i>
                              <span className="d-none d-md-inline ms-1">View</span>
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              className="btn btn-outline-warning"
                              onClick={() => navigate(`/products/${product._id}`)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                              <span className="d-none d-md-inline ms-1">Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(product._id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                              <span className="d-none d-md-inline ms-1">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                      >
                        Prev
                      </button>
                    </li>
                    {[...Array(totalPages).keys()].map(number => (
                      <li
                        key={number + 1}
                        className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(number + 1)}
                        >
                          {number + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}

              <div className="text-muted text-end">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="empty-state">
                <i className="bi bi-box-seam display-4 text-muted"></i>
                <h4 className="mt-3">No products found</h4>
                <p className="text-muted">
                  {searchTerm ? 'No products match your search.' : 'You currently have no products in your inventory.'}
                </p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate('/products/new')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Your First Product
                </button>
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary mt-2 ms-2"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;