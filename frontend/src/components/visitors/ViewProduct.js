import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DOMPurify from 'dompurify'; // Add this import
import Navbar from '../Navbar';
import '../../stylesheet/visitors/ViewProduct.css';

const ProductView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth); // Add this line
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [errorRelated, setErrorRelated] = useState(null);
    const [submittingReview, setSubmittingReview] = useState(false);
    // Add these to your component state
    const [activeTab, setActiveTab] = useState('description');
    const [newReview, setNewReview] = useState({
        rating: '',
        comment: ''
    });

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);

        try {
            // Verify authentication
            if (!userInfo?.token) {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Please login to submit a review');
                    navigate('/login');
                    return;
                }
                // Optionally refresh token here
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo?.token || localStorage.getItem('token')}`,
                },
            };

            const { data } = await axios.post(
                `/api/products/${id}/reviews`,
                {
                    rating: Number(newReview.rating),
                    comment: newReview.comment.trim()
                },
                config
            );

            // Refresh product data
            const response = await axios.get(`/api/products/view/${id}`);
            setProduct(response.data);

            // Reset form
            setNewReview({ rating: 0, comment: '' });
            alert('Review submitted successfully!');

        } catch (error) {
            console.error('Review error:', error);

            if (error.response?.status === 401) {
                // Handle token refresh here if implementing refresh tokens
                alert('Session expired. Please login again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert(error.response?.data?.message ||
                    'Failed to submit review. Please try again.');
            }
        } finally {
            setSubmittingReview(false);
        }
    };

    useEffect(() => {

        const fetchRelatedProducts = async (brandId, excludeId) => {
            setLoadingRelated(true);
            setErrorRelated(null);

            try {
                // Debug what we're sending
                console.log('Fetching related products for:', {
                    brandId: brandId,
                    brandIdType: typeof brandId,
                    excludeId: excludeId
                });

                const response = await axios.get(`/api/products/related/${brandId}?exclude=${excludeId}`);

                console.log('Received related products:', response.data);
                setRelatedProducts(response.data);
            } catch (err) {
                console.error('Error fetching related products:', {
                    error: err,
                    response: err.response
                });
                setErrorRelated(err.message);
            } finally {
                setLoadingRelated(false);
            }
        };

        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/view/${id}`);
                setProduct(response.data);

                // Update recently viewed
                const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                const newViewed = [response.data, ...viewed.filter(p => p._id !== response.data._id)].slice(0, 5);
                localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
                setRecentlyViewed(newViewed);

                setLoading(false);

                // To:
                if (response.data.brand) {
                    // Explicitly get the ID whether brand is populated or just reference
                    const brandId = response.data.brand._id || response.data.brand;
                    if (brandId) {
                        fetchRelatedProducts(brandId.toString(), response.data._id);
                    }
                }

            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load product');
                setLoading(false);
                console.error('Error fetching product:', err);
            }
        };

        fetchProduct();
    }, [id]);

    const handleQuantityChange = (value) => {
        const newQuantity = quantity + value;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const addToCart = () => {
        // Implement cart functionality
        alert(`${quantity} ${product.name} added to cart`);
    };

    if (loading) {
        return (
            <div className="product-view-container">
                <div className="loading-spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-view-container">
                <div className="error-message">
                    {error}
                    <button onClick={() => navigate('/products')} className="back-button">
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-view-container">
                <h2>Product not found</h2>
                <button onClick={() => navigate('/products')} className="back-button">
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="product-view-page">

            <Navbar />
            {/* Breadcrumb Navigation
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span> / </span>
                <Link to="/products">Shop</Link>
                <span> / </span>
                <span>{product.name}</span>
            </div> */}

            <div className="product-main-container">
                {/* Product Images */}
                <div className="product-images">
                    <div className="main-image">
                        <img
                            src={product.images?.[selectedImage]?.url || product.image?.url || '/images/placeholder-product.png'}
                            alt={product.name}
                            onError={(e) => {
                                e.target.src = '/images/placeholder-product.png';
                            }}
                        />
                    </div>
                    <div className="thumbnail-images">
                        {product.images?.map((img, index) => (
                            <div
                                key={index}
                                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img
                                    src={img.url}
                                    alt={`${product.name} - ${index + 1}`}
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder-product.png';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="product-details">
                    <h1 className="product-title">{product.name}</h1>

                    <div className="product-meta">
                        <div className="rating">
                            <div className="stars">
                                {product.rating ? (
                                    <>
                                        {Array(5).fill().map((_, i) => (
                                            <span key={i} className={`star ${i < Math.round(product.rating) ? 'filled' : ''}`}>
                                                ★
                                            </span>
                                        ))}
                                        <span className="average-rating">({product.rating.toFixed(1)})</span>
                                    </>
                                ) : (
                                    <span>No ratings yet</span>
                                )}
                            </div>
                            <span className="review-count">
                                {product.numReviews || 0} Review{product.numReviews !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    <div className="product-description">
                        <p>{product.shortDescription}</p>
                    </div>

                    <div className="product-attributes">
                        {product.sizeOptions && (
                            <div className="attribute">
                                <strong>Size Options:</strong> {product.sizeOptions}
                            </div>
                        )}
                        {product.color && (
                            <div className="attribute">
                                <strong>Color:</strong> {product.color}
                            </div>
                        )}
                        {product.unisex && (
                            <div className="attribute">
                                <strong>Unisex:</strong> {product.unisex}
                            </div>
                        )}
                    </div>

                    <div className="quantity-selector">
                        <button onClick={() => handleQuantityChange(-1)}>-</button>
                        <input
                            type="number"
                            value={quantity}
                            min="1"
                            max="10"
                            readOnly
                        />
                        <button onClick={() => handleQuantityChange(1)}>+</button>
                    </div>

                    <div className="action-buttons">
                        <button className="add-to-cart" onClick={addToCart}>
                            Enquiry
                        </button>
                        <button className="buy-now">
                            Get Quotation
                        </button>
                    </div>

                    <div className="product-categories">
                        <div className="brand">
                            <strong>Brand: </strong>
                            {product.brand?.name || 'No brand'}

                        </div>
                        <div className="attribute">
                            <strong>Category: </strong>
                            {product.category?.name || 'Uncategorized'}
                        </div>
                        {product.tags && product.tags.length > 0 && (
                            <div className="tags">
                                <strong>Tags:</strong>
                                {product.tags.map(tag => (
                                    <Link key={tag} to={`/products/tag/${tag}`}>{tag}</Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Tabs */}
            <div className="product-tabs">
                <div className="tab-header">
                    <button
                        className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Description
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews ({product.reviewCount || 0})
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'shipping' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shipping')}
                    >
                        Additional Information
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'description' && (
                        <div className="description-content">
                            {product.longDescription ? (
                                <div dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(product.longDescription)
                                }} />
                            ) : (
                                <p>No detailed description available.</p>
                            )}

                            {product.keyFeatures && (
                                <>
                                    <h3>Key Features</h3>
                                    <ul className="key-features">
                                        {product.keyFeatures.split('\n').filter(f => f.trim()).map((feature, i) => (
                                            <li key={i}>{feature.trim()}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {product.indications && (
                                <>
                                    <h3>Indications</h3>
                                    <ul className="indications">
                                        {product.indications.split('\n').filter(i => i.trim()).map((indication, i) => (
                                            <li key={i}>{indication.trim()}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {product.additionalInfo && (
                                <>
                                    <h3>Additional Information</h3>
                                    <div dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(product.additionalInfo)
                                    }} />
                                </>
                            )}
                        </div>
                    )}

                    { /**Update the review form rendering*/}
                    {activeTab === 'reviews' && (
                        <div className="reviews-content">
                            {product.reviews && product.reviews.length > 0 ? (
                                <div className="review-list">
                                    {product.reviews.map(review => (
                                        <div key={review._id} className="review-item">
                                            <div className="review-header">
                                                <span className="review-author">
                                                    {review.user?.name || review.name || 'Anonymous'}
                                                </span>
                                                <span className="review-date">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                                <div className="review-rating">
                                                    {Array(5).fill().map((_, i) => (
                                                        <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="review-text">{review.comment}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No reviews yet. Be the first to review this product!</p>
                            )}

                            <div className="add-review">
                                <h4>Write a Review</h4>
                                {userInfo ? (
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="rating-input">
                                            <label>Rating:</label>
                                            <div className="star-rating">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`star ${star <= newReview.rating ? 'filled' : ''}`}
                                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <textarea
                                            placeholder="Write your review here (minimum 10 characters)..."
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            required
                                            minLength="10"
                                            rows="5"
                                        />
                                        <button
                                            type="submit"
                                            className="submit-review"
                                            disabled={submittingReview}
                                        >
                                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="login-to-review">
                                        <p>Please <Link to="/login">sign in</Link> to write a review</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="shipping-content">
                            {product.additionalInformation}
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            <div className="related-products">
                <h2>Related Products</h2>

                {/* Add to your related products section */}
           
                {loadingRelated ? (
                    <div className="loading-message">Loading related products...</div>
                ) : errorRelated ? (
                    <div className="error-message">
                        Failed to load related products
                        <button onClick={() => window.location.reload()}>Retry</button>
                    </div>
                ) : relatedProducts.length > 0 ? (
                    <div className="products-grid">
                        {relatedProducts.map(relatedProduct => (
                            <div key={relatedProduct._id} className="product-card">
                                <Link to={`/products/view/${relatedProduct._id}`}>
                                    <img
                                        src={relatedProduct.image?.url || '/images/placeholder-product.png'}
                                        alt={relatedProduct.name}
                                        onError={(e) => {
                                            e.target.src = '/images/placeholder-product.png';
                                        }}
                                    />
                                    <h3>{relatedProduct.name}</h3>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-related">
                        No other products from this brand available
                    </div>
                )}
            </div>

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
                <div className="recently-viewed">
                    <h2>Recently Viewed Products</h2>
                    <div className="products-grid">
                        {recentlyViewed.map(item => (
                            <div key={item._id} className="product-card">
                                <Link to={`/products/view/${item._id}`}>
                                    <img src={item.image?.url || '/images/placeholder-product.png'} alt={item.name} />
                                    <h3>{item.name}</h3>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
    );
};

export default ProductView;