import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import '../../stylesheet/brand/EditBrand.css';

const EditBrand = () => {
    const { id } = useParams();
    const [brand, setBrand] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        currentImageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Fetch brand data
    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const response = await axios.get(`/api/brands/edit/${id}`);
                setBrand(response.data);
                setFormData({
                    name: response.data.name,
                    description: response.data.description,
                    currentImageUrl: response.data.image?.url || '',
                    image: null
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch brand');
            } finally {
                setFetching(false);
            }
        };

        fetchBrand();
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

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await axios.put(
                `/api/brands/edit/${id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSuccess('Brand updated successfully!');
            setBrand(response.data.brand);
            setFormData(prev => ({
                ...prev,
                currentImageUrl: response.data.brand.image.url,
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
            <div className="brand-form-container">
                <Sidebar />
                <div className="loading-container">
                    <div className="spinner-large"></div>
                    <p>Loading brand details...</p>
                </div>
            </div>
        );
    }

        if (error && !fetching) {
        return (
            <div className="brand-form-container">
                <Sidebar />
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => navigate('/brands/get/all')} className="back-btn">
                        Back to Brand
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="brand-form-container">
            <Sidebar />

            <div className="form-header">
                <h2>Edit Brand</h2>
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
                    <button onClick={() => navigate(`/brands/get/all`)} className="view-btn">
                        View All Brand
                    </button>
                </div>
            )}

            <form className="brand-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Brand Name <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter brand name"
                    />
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
                        placeholder="Describe your brand..."
                    />
                </div>

                <div className="form-group">
                    <label>Current Image</label>
                    {formData.currentImageUrl && (
                        <div className="current-image">
                            <img
                                src={formData.currentImageUrl}
                                alt="Current brand"
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
                            'Update Brand'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBrand;