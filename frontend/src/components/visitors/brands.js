import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Navbar from '../Navbar';
// import Footer from '../Footer';
import '../../stylesheet/visitors/brands.css';

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [brandsPerPage] = useState(12);
    const [sortOption, setSortOption] = useState('featured');
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('/api/brands/view/all');
            setBrands(response.data);
        } catch (err) {
            setError('Failed to load brands. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = (brandId) => {
        if (wishlist.includes(brandId)) {
            setWishlist(wishlist.filter(id => id !== brandId));
        } else {
            setWishlist([...wishlist, brandId]);
        }
    };

    // Pagination logic
    const indexOfLastBrand = currentPage * brandsPerPage;
    const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
    const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);
    const totalPages = Math.ceil(brands.length / brandsPerPage);

    // Sorting logic
    const sortBrands = (brands) => {
        switch (sortOption) {
            case 'price-low':
                return [...brands].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...brands].sort((a, b) => b.price - a.price);
            case 'rating':
                return [...brands].sort((a, b) => b.rating - a.rating);
            case 'newest':
                return [...brands].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            default:
                return brands;
        }
    };

    const sortedBrands = sortBrands(currentBrands);

    return (
        <div className='ecommerce-container'>
            <Navbar />

            <div className="brand-listing-container">
                {/* Filters and Sorting */}
                <div className="brand-controls">
                    <div className="results-count">
                        Showing {indexOfFirstBrand + 1}-{Math.min(indexOfLastBrand, brands.length)} of {brands.length} brands
                    </div>
                    <div className="sort-options">
                        Our Brands
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading brands...</p>
                    </div>
                ) : brands.length > 0 ? (
                    <>
                        <div className="brands-grid">
                            {sortedBrands.map(brand => (
                                <div className="brand-card" key={brand._id}>
                                    <div className="brand-badges">
                                        {brand.isNew && <span className="badge new">New</span>}
                                        {brand.discount > 0 && <span className="badge discount">-{brand.discount}%</span>}
                                        <button
                                            className={`wishlist-btn ${wishlist.includes(brand._id) ? 'active' : ''}`}
                                            onClick={() => toggleWishlist(brand._id)}
                                        >
                                            <FiHeart />
                                        </button>
                                    </div>
                                    <div className="brand-image-container">
                                        <img
                                            src={brand.image?.url || '/images/placeholder-brand.jpg'}
                                            alt={brand.name}
                                            className="brand-image"
                                            onClick={() => navigate(`/brands/view/${brand._id}`)}
                                        />
                                        <div className="brand-actions">
                                            <button className="quick-view" onClick={() => navigate(`/brands/product/${brand._id}`)}>
                                                <FiEye /> View
                                            </button>
                                        </div>
                                    </div>
                                    <div className="brand-info">
                                        <h3 className="brand-title" onClick={() => navigate(`/brands/view/${brand._id}`)}>
                                            {brand.name}
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
                        <h4>No brands found</h4>
                        <p>Check back later for new arrivals</p>
                    </div>
                )}
            </div>

            {/* Newsletter Section */}
            <div className="newsletter-section">
                <h3>Subscribe to Our Newsletter</h3>
                <p>Get updates on new brands and special offers</p>
                <form className="newsletter-form">
                    <input type="email" placeholder="Your email address" required />
                    <button type="submit">Subscribe</button>
                </form>
            </div>

            {/* <Footer /> */}
        </div>
    );
};

export default BrandList;