import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Navbar from '../Navbar';
// import Footer from '../Footer';
import '../../stylesheet/visitors/Category.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(12);
    const [sortOption, setSortOption] = useState('featured');
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('/api/categories/view/all');
            setCategories(response.data);
        } catch (err) {
            setError('Failed to load categories. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = (categoriesId) => {
        if (wishlist.includes(categoriesId)) {
            setWishlist(wishlist.filter(id => id !== categoriesId));
        } else {
            setWishlist([...wishlist, categoriesId]);
        }
    };

    // Pagination logic
    const indexOfLastCategories = currentPage * categoriesPerPage;
    const indexOfFirstCategories = indexOfLastCategories - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategories, indexOfLastCategories);
    const totalPages = Math.ceil(categories.length / categoriesPerPage);

    // Sorting logic
    const sortCategories = (categories) => {
        switch (sortOption) {
            case 'price-low':
                return [...categories].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...categories].sort((a, b) => b.price - a.price);
            case 'rating':
                return [...categories].sort((a, b) => b.rating - a.rating);
            case 'newest':
                return [...categories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            default:
                return categories;
        }
    };

    const sortedCategories = sortCategories(currentCategories);

    return (
        <div className='ecommerce-container'>
            <Navbar />

            <div className="categories-listing-container">
                {/* Filters and Sorting */}
                <div className="categories-controls">
                    <div className="results-count">
                        Showing {indexOfFirstCategories + 1}-{Math.min(indexOfLastCategories, categories.length)} of {categories.length} categories
                    </div>
                    <div className="sort-options">
                        Category
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading categories...</p>
                    </div>
                ) : categories.length > 0 ? (
                    <>
                        <div className="categories-grid">
                            {sortedCategories.map(categories => (
                                <div className="categories-card" key={categories._id}>
                                    <div className="categories-badges">
                                        {categories.isNew && <span className="badge new">New</span>}
                                        {categories.discount > 0 && <span className="badge discount">-{categories.discount}%</span>}
                                        <button
                                            className={`wishlist-btn ${wishlist.includes(categories._id) ? 'active' : ''}`}
                                            onClick={() => toggleWishlist(categories._id)}
                                        >
                                            <FiHeart />
                                        </button>
                                    </div>
                                    <div className="categories-image-container">
                                        <img
                                            src={categories.image?.url || '/images/placeholder-categories.jpg'}
                                            alt={categories.name}
                                            className="categories-image"
                                            onClick={() => navigate(`/categories/view/${categories._id}`)}
                                        />
                                        <div className="categories-actions">
                                            <button className="quick-view" onClick={() => navigate(`/categories/view/${categories._id}`)}>
                                                <FiEye /> View
                                            </button>
                                        </div>
                                    </div>
                                    <div className="categories-info">
                                        <h3 className="categories-title" onClick={() => navigate(`/categories/view/${categories._id}`)}>
                                            {categories.name}
                                        </h3>
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
                        <h4>No categories found</h4>
                        <p>Check back later for new arrivals</p>
                    </div>
                )}
            </div>

            {/* Newsletter Section */}
            <div className="newsletter-section">
                <h3>Subscribe to Our Newsletter</h3>
                <p>Get updates on new categories and special offers</p>
                <form className="newsletter-form">
                    <input type="email" placeholder="Your email address" required />
                    <button type="submit">Subscribe</button>
                </form>
            </div>

            {/* <Footer /> */}
        </div>
    );
};

export default CategoryList;