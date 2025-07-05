import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiFileText, FiHeart, FiEye, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Navbar from '../Navbar';
// import Footer from '../Footer';
import '../../stylesheet/visitors/Products.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [sortOption, setSortOption] = useState('featured');
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    const handleQuickView = (product) => {
        setQuickViewProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setQuickViewProduct(null);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('/api/products/view/all');
            setProducts(response.data);
        } catch (err) {
            setError('Failed to load products. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = (productId) => {
        if (wishlist.includes(productId)) {
            setWishlist(wishlist.filter(id => id !== productId));
        } else {
            setWishlist([...wishlist, productId]);
        }
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Sorting logic
    const sortProducts = (products) => {
        switch (sortOption) {
            case 'price-low':
                return [...products].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...products].sort((a, b) => b.price - a.price);
            case 'rating':
                return [...products].sort((a, b) => b.rating - a.rating);
            case 'newest':
                return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            default:
                return products;
        }
    };

    const sortedProducts = sortProducts(currentProducts);

    return (
        <div className='ecommerce-container'>
            <Navbar />

            <div className="product-listing-container">
                {/* Filters and Sorting */}
                <div className="product-controls">
                    <div className="results-count">
                        Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} products
                    </div>
                    <div className="sort-options">
                        <label htmlFor="sort">Sort by:</label>
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Customer Rating</option>
                            <option value="newest">Newest Arrivals</option>
                        </select>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="products-grid">
                            {sortedProducts.map(product => (
                                <div className="product-card" key={product._id}>
                                    <div className="product-badges">
                                        {product.isNew && <span className="badge new">New</span>}
                                        {product.discount > 0 && <span className="badge discount">-{product.discount}%</span>}
                                        <button
                                            className={`wishlist-btn ${wishlist.includes(product._id) ? 'active' : ''}`}
                                            onClick={() => toggleWishlist(product._id)}
                                        >
                                            <FiHeart />
                                        </button>
                                    </div>
                                    <div className="product-image-container">
                                        <img
                                            src={product.image?.url || '/images/placeholder-product.jpg'}
                                            alt={product.name}
                                            className="product-image"
                                            onClick={() => navigate(`/products/view/${product._id}`)}
                                        />
                                        <div className="product-actions">
                                            <button className="quick-view" onClick={(e) => {
                                                e.stopPropagation();
                                                handleQuickView(product);
                                            }}>
                                                <FiEye /> Quick View
                                            </button>
                                            <button className="add-to-cart" onClick={() => navigate(`/products/view/${product._id}`)}>
                                                <FiShoppingCart /> View
                                            </button>
                                        </div>
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-title" onClick={() => navigate(`/products/view/${product._id}`)}>
                                            {product.name}
                                        </h3>
                                        <div className="product-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar
                                                    key={i}
                                                    className={i < Math.floor(product.rating) ? 'filled' : ''}
                                                />
                                            ))}
                                            <span>({product.reviewCount})</span>
                                        </div>
                                     
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <FiChevronLeft />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        className={currentPage === i + 1 ? 'active' : ''}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    <FiChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h4>No products found</h4>
                        <p>Check back later for new arrivals</p>
                    </div>
                )}
            </div>

            {/* Newsletter Section */}
            <div className="newsletter-section">
                <h3>Subscribe to Our Newsletter</h3>
                <p>Get updates on new products and special offers</p>
                <form className="newsletter-form">
                    <input type="email" placeholder="Your email address" required />
                    <button type="submit">Subscribe</button>
                </form>
            </div>

            {/* <Footer /> */}

            {/* Quick View Modal */}
            {isModalOpen && quickViewProduct && (
                <div className="quick-view-modal">
                    <div className="modal-overlay" onClick={closeModal}></div>
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeModal}>
                            &times;
                        </button>

                        <div className="modal-product-container">
                            {/* Left Column - Images */}
                            <div className="modal-product-images">
                                <div className="modal-main-image">
                                    <img
                                        src={quickViewProduct.image?.url || '/images/placeholder-product.jpg'}
                                        alt={quickViewProduct.name}
                                    />
                                </div>
                            </div>

                            {/* Right Column - Details */}
                            <div className="modal-product-details">
                                <h2>{quickViewProduct.name}</h2>

                                <div className="modal-product-meta">
                                    <div className="modal-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className={i < Math.floor(quickViewProduct.rating) ? 'filled' : ''}
                                            />
                                        ))}
                                        <span>({quickViewProduct.reviewCount || 0} reviews)</span>
                                    </div>

                                    {quickViewProduct.brand && (
                                        <div className="modal-brand">
                                            <strong>Brand:</strong> {quickViewProduct.brand.name || quickViewProduct.brand}
                                            <br />
                                            <strong>Category:</strong> {quickViewProduct.category.name || quickViewProduct.category}

                                        </div>
                                    )}
                                </div>

                                <div className="modal-description">
                                    <p>{quickViewProduct.shortDescription || 'No description available.'}</p>
                                </div>

                                {quickViewProduct.sizeOptions && (
                                    <div className="modal-size-options">
                                        <strong>Sizes:</strong> {quickViewProduct.sizeOptions}
                                    </div>
                                )}

                                {quickViewProduct.color && (
                                    <div className="modal-color">
                                        <strong>Color:</strong> {quickViewProduct.color}
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button
                                        className="modal-view-details"
                                        onClick={() => {
                                            closeModal();
                                            navigate(`/products/view/${quickViewProduct._id}`);
                                        }}
                                    >
                                        View Full Details
                                    </button>
                                    <button className="modal-add-to-cart">
                                        <FiFileText /> Get Quote
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;