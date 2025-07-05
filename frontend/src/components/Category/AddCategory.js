import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import '../../stylesheet/Category/AddCategory.css';

const Category = ({ category }) => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        description: '',
        image: null
    });
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [brandLoading, setBrandLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch brands when component mounts
        const fetchBrands = async () => {
            try {
                const response = await axios.get('/api/brands');
                setBrands(response.data);
                setBrandLoading(false);
            } catch (err) {
                setError('Failed to load brands');
                setBrandLoading(false);
            }
        };

        fetchBrands();

        if (category) {
            setFormData({
                name: category.name || '',
                brand: category.brand?._id || '',
                description: category.description || '',
                image: category.image?.url || ''
            });
        }
    }, [category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setFormData(prev => ({
            ...prev,
            image: previewUrl,
            file // Store the actual file object
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
            formDataToSend.append('brand', formData.brand);
            formDataToSend.append('description', formData.description);

            if (formData.file) {
                formDataToSend.append('image', formData.file);
            }

            let response;
            if (category) {
                // Update existing category
                response = await axios.put(`/api/categories/${category._id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccess('Category updated successfully!');
                // Optionally update local state with the updated category data
                setFormData(prev => ({
                    ...prev,
                    name: response.data.name,
                    brand: response.data.brand?._id || '',
                    description: response.data.description,
                    image: response.data.image?.url || ''
                }));
            } else {
                // Create new category
                response = await axios.post('/api/categories/new', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccess('Category created successfully!');
            }

            // Redirect after success
            setTimeout(() => {
                navigate(`/categories/edit/${response.data._id}`);
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="category-form-container">
            <Sidebar />

            <div className="form-header">
                <h2>{category ? 'Edit Category' : 'Add New Category'}</h2>
                <div className="form-icon">
                    {category ? '✏️' : '➕'}
                </div>
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
                    <span className="spinner-small"></span>
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
                    <label>
                        Brand
                    </label>
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
                    <label>
                        Image {!category && <span className="required">*</span>}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required={!category}
                    />
                    {formData.image && (
                        <div className="image-preview">
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="preview-image"
                            />
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Processing...
                            </>
                        ) : (
                            category ? 'Update category' : 'Create category'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Category;