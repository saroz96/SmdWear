import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { FaArrowLeft, FaCalendarAlt, FaEdit, FaHistory } from 'react-icons/fa';
import '../../stylesheet/brand/ViewBrand.css';

const BrandView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [errorRelated, setErrorRelated] = useState(null);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const { data } = await axios.get(`/api/brands/product/${id}`);
                setBrand(data);
                setLoading(false);

                // Fetch related products after brand is loaded
                if (data._id) {
                    fetchRelatedProducts(data._id);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load brand');
                setLoading(false);
                console.error('Error fetching brand:', err);
            }
        };

        const fetchRelatedProducts = async (brandId) => {
            setLoadingRelated(true);
            setErrorRelated(null);
            try {
                const response = await axios.get(`/api/products/brand/${brandId}`);
                setRelatedProducts(response.data);
            } catch (err) {
                setErrorRelated(err.response?.data?.message || 'Failed to load related products');
                console.error('Error fetching related products:', err);
            } finally {
                setLoadingRelated(false);
            }
        };

        fetchBrand();
    }, [id]);

    if (loading) {
        return (
            <div className="brand-view-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="brand-view-error-container">
                <div className="error-message">
                    {error}
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-secondary"
                    >
                        <FaArrowLeft className="icon" />
                        Back to Brands
                    </button>
                </div>
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="brand-not-found">
                <div className="not-found-content">
                    <h2>Brand not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-secondary"
                    >
                        <FaArrowLeft className="icon" />
                        Back to Brands
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="brand-view-container">
            <Navbar />

            <div className="brand-content-wrapper">
                {/* Main Brand Content */}
                <div className="">
                    <div className="brand-details-container">
                        {/* Brand Image */}
                        <div className="">
                            <img
                                src={brand.image?.url || '/images/placeholder-brand.png'}
                                alt={brand.name}
                                className="brand-image"
                                onError={(e) => {
                                    e.target.src = '/images/placeholder-brand.png';
                                }}
                            />
                        </div>

                        {/* Brand Details */}
                        <div className="brand-info">
                            <h1 className="brand-title">{brand.name}</h1>

                            <div className="brand-meta">
                                <div className="meta-item">
                                    <FaCalendarAlt className="icon" />
                                    <span>Created: {new Date(brand.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3/$1/$2 at')}</span>
                                </div>
                                <div className="meta-item">
                                    <FaHistory className="icon" />
                                    <span>Updated: {new Date(brand.updatedAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3/$1/$2 at')}</span>
                                </div>
                            </div>

                            <div className="brand-description">
                                <p>{brand.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="related-products">
                    <h2>Products from {brand.name}</h2>
                    {loadingRelated ? (
                        <div className="loading-spinner"></div>
                    ) : errorRelated ? (
                        <div className="error-message">{errorRelated}</div>
                    ) : relatedProducts.length > 0 ? (
                        <div className="products-grid">
                            {relatedProducts.map(product => (
                                <div key={product._id} className="product-card">
                                    <Link to={`/products/view/${product._id}`}>
                                        <img
                                            src={product.image?.url || '/images/placeholder-product.png'}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder-product.png';
                                            }}
                                        />
                                        <h3>{product.name}</h3>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No products found for this brand.</p>
                    )}
                </div>

                {/* Features Section */}
                <div className="features-section">
                    <div className="feature">
                        <div className="icon">🚚</div>
                        <h3>Free Delivery</h3>
                        <p>When ordering from 5000</p>
                    </div>
                    <div className="feature">
                        <div className="icon">💳</div>
                        <h3>Quick Payment</h3>
                        <p>100% secure payment</p>
                    </div>
                    <div className="feature">
                        <div className="icon">🎁</div>
                        <h3>Gift Certificate</h3>
                        <p>Buy now 5000 to 10000</p>
                    </div>
                    <div className="feature">
                        <div className="icon">📞</div>
                        <h3>24/7 Support</h3>
                        <p>Ready support</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandView;