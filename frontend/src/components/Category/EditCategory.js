import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import '../../stylesheet/Category/EditCategory.css';

const EditCategory = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        image: null,
        currentImageUrl: '',
        imagePreview: null
    });
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [brandLoading, setBrandLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Fetch category data and brands
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch brands
                const brandsResponse = await axios.get('/api/brands');
                setBrands(brandsResponse.data);
                setBrandLoading(false);

                // Fetch category
                const categoryResponse = await axios.get(`/api/categories/edit/${id}`);
                setCategory(categoryResponse.data);
                setFormData({
                    name: categoryResponse.data.name,
                    description: categoryResponse.data.description,
                    brand: categoryResponse.data.brand?._id || categoryResponse.data.brand || '',
                    currentImageUrl: categoryResponse.data.image?.url || '',
                    image: null,
                    imagePreview: null
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
            } finally {
                setFetching(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setFormData(prev => ({
            ...prev,
            image: file,
            imagePreview: previewUrl
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('brand', formData.brand);

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await axios.put(
                `/api/categories/edit/${id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSuccess('Category updated successfully!');
            setCategory(response.data.category);
            setFormData(prev => ({
                ...prev,
                currentImageUrl: response.data.category.image.url,
                image: null,
                imagePreview: null
            }));

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="category-form-container">
                <Sidebar />
                <div className="loading-container">
                    <div className="spinner-large"></div>
                    <p>Loading category details...</p>
                </div>
            </div>
        );
    }

    if (error && !fetching) {
        return (
            <div className="category-form-container">
                <Sidebar />
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => navigate('/categories/get/all')} className="back-btn">
                        Back to Categories
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="category-form-container">
            <Sidebar />

            <div className="form-header">
                <h2>Edit Category</h2>
                <div className="form-icon">✏️</div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError('')} className="close-btn">×</button>
                </div>
            )}

            {success && (
                <div className="success-message">
                    {success}
                    <button onClick={() => navigate(`/categories/get/all`)} className="view-btn">
                        View All Categories
                    </button>
                </div>
            )}

            <form className="category-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Category Name <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter category name"
                    />
                </div>

                <div className="form-group">
                    <label>Brand</label>
                    {brandLoading ? (
                        <div className="loading-text">Loading brands...</div>
                    ) : (
                        <select
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="brand-select"
                        >
                            <option value="">Select a brand</option>
                            {brands.map(brand => (
                                <option key={brand._id} value={brand._id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="form-group">
                    <label>
                        Description <span className="required">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                        placeholder="Describe your category..."
                    />
                </div>

                <div className="form-group">
                    <label>Current Image</label>
                    {formData.currentImageUrl && (
                        <div className="current-image">
                            <img
                                src={formData.currentImageUrl}
                                alt="Current category"
                                className="current-image-preview"
                            />
                        </div>
                    )}

                    <label>Update Image (optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {formData.imagePreview && (
                        <div className="image-preview">
                            <p>New Image Preview:</p>
                            <img
                                src={formData.imagePreview}
                                alt="Preview"
                                className="preview-image"
                            />
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Updating...
                            </>
                        ) : (
                            'Update Category'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategory;