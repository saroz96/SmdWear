import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../stylesheet/Slider/SliderList.css';

const SliderList = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const slidesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('/api/admin/slider/get/all');
            setSlides(response.data || []);
        } catch (err) {
            setError('Failed to load slides. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this slider? This action cannot be undone.')) {
            try {
                setError('');
                await axios.delete(`/api/admin/slider/${id}`);
                setSlides(slides.filter(slide => slide._id !== id));
                // Show success feedback
                setTimeout(() => {
                    alert('Slide deleted successfully');
                }, 100);
            } catch (err) {
                setError('Failed to delete slide. ' + (err.response?.data?.message || err.message));
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

    const sortedSlides = [...slides].sort((a, b) => {
        // Handle cases where properties might be undefined
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredSlides = sortedSlides.filter(slide => {
        // Safely handle undefined properties
        const title = slide.title || '';
        const description = slide.description || '';

        return (
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Pagination logic
    const indexOfLastSlides = currentPage * slidesPerPage;
    const indexOfFirstSlides = indexOfLastSlides - slidesPerPage;
    const currentSlides = filteredSlides.slice(indexOfFirstSlides, indexOfLastSlides);
    const totalPages = Math.ceil(filteredSlides.length / slidesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="slides-management-container">
            <Sidebar />
            <div className="main-content">
                <div className="slides-table-wrapper">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                        <h2 className="mb-3 mb-md-0">Slider Management</h2>
                        <div className="d-flex gap-3 flex-wrap">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Search slides..."
                                    className="form-control"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                <i className="bi bi-search search-icon"></i>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/admin/slider/new')}
                            >
                                <i className="bi bi-plus-lg me-2"></i>
                                Add Slide
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
                            <p className="mt-3 fs-5">Loading slides...</p>
                        </div>
                    ) : filteredSlides.length > 0 ? (
                        <>
                            <div className="slides-table-container">
                                <table className="slides-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th onClick={() => handleSort('title')}>
                                                Title {sortConfig.key === 'title' && (
                                                    <i className={`bi bi-caret-${sortConfig.direction === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>
                                                )}
                                            </th>
                                            <th onClick={() => handleSort('description')}>
                                                Description {sortConfig.key === 'description' && (
                                                    <i className={`bi bi-caret-${sortConfig.direction === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>
                                                )}
                                            </th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentSlides.map(slide => (
                                            <tr key={slide._id}>
                                                <td>
                                                    <div className="image-preview-small">
                                                        <img
                                                            src={slide.image?.url || '/placeholder.png'}
                                                            alt={slide.title || 'Slide image'}
                                                            className="slides-image-tiny"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/placeholder.png';
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong>{slide.title || 'Untitled Slide'}</strong>
                                                </td>
                                                <td>
                                                    {slide.description || 'No description'}
                                                </td>
                                                <td>
                                                    <span className={`badge ${slide.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                                        {slide.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className='date-cell'>
                                                    {new Date(slide.createdAt).toLocaleString('en-US', {
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
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-warning"
                                                            onClick={() => navigate(`/admin/slider/edit/${slide._id}`)}
                                                            title="Edit"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                            <span className="d-none d-md-inline ms-1">Edit</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(slide._id)}
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
                                Showing {indexOfFirstSlides + 1}-{Math.min(indexOfLastSlides, filteredSlides.length)} of {filteredSlides.length} slides
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <div className="empty-state">
                                <i className="bi bi-images display-4 text-muted"></i>
                                <h4 className="mt-3">No slides found</h4>
                                <p className="text-muted">
                                    {searchTerm ? 'No slides match your search.' : 'You currently have no slides.'}
                                </p>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => navigate('/admin/slider/new')}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add Your First Slide
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

export default SliderList;