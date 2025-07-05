import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../stylesheet/BrandList.css';

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const brandsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('/api/brands/get/all');
            setBrands(response.data);
        } catch (err) {
            setError('Failed to load brands. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this brand? This action cannot be undone.')) {
            try {
                setError('');
                await axios.delete(`/api/brands/${id}`);
                setBrands(brands.filter(brand => brand._id !== id));
                // Show success feedback
                setError(''); // Clear any previous errors
                setTimeout(() => {
                    // This would be better with a proper toast notification
                    alert('Brand deleted successfully');
                }, 100);
            } catch (err) {
                setError('Failed to delete brand. ' + (err.response?.data?.message || err.message));
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

    const sortedBrands = [...brands].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredBrands = sortedBrands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastBrand = currentPage * brandsPerPage;
    const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
    const currentBrands = filteredBrands.slice(indexOfFirstBrand, indexOfLastBrand);
    const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="brand-management-container">
            <Sidebar />
            <div className="main-content">
                <div className="brands-table-wrapper">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                        <h2 className="mb-3 mb-md-0">Brand Management</h2>
                        <div className="d-flex gap-3 flex-wrap">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Search brands..."
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
                                onClick={() => navigate('/brands/new')}
                            >
                                <i className="bi bi-plus-lg me-2"></i>
                                Add Brand
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
                            <p className="mt-3 fs-5">Loading brands...</p>
                        </div>
                    ) : filteredBrands.length > 0 ? (
                        <>
                            <div className="brands-table-container">
                                <table className="brands-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th onClick={() => handleSort('name')}>
                                                Name {sortConfig.key === 'name' && (
                                                    <i className={`bi bi-caret-${sortConfig.direction === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>
                                                )}
                                            </th>
                                            <th onClick={() => handleSort('description')}>
                                                Description {sortConfig.key === 'description' && (
                                                    <i className={`bi bi-caret-${sortConfig.direction === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>
                                                )}
                                            </th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentBrands.map(brand => (
                                            <tr key={brand._id}>
                                                <td>
                                                    <div className="image-preview-small">
                                                        <img
                                                            src={brand.image?.url || '/placeholder.png'}
                                                            alt={brand.name}
                                                            className="brand-image-tiny"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/placeholder.png';
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong>{brand.name}</strong>
                                                </td>
                                                <td className="description-cell">
                                                    {brand.description}
                                                    {brand.description && brand.description.length > 100 && (
                                                        <button
                                                            className="btn btn-link btn-sm p-0 ms-2"
                                                            onClick={() => {
                                                                // This would be better with a modal or expandable section
                                                                alert(brand.description);
                                                            }}
                                                        >
                                                            Read more
                                                        </button>
                                                    )}
                                                </td>
                                                <td className='date-cell'>
                                                    {new Date(brand.updatedAt).toLocaleString('en-US', {
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
                                                            onClick={() => navigate(`/brands/view/${brand._id}`)}
                                                            title="View details"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                            <span className="d-none d-md-inline ms-1">View</span>
                                                        </button>

                                                        {/* Edit Button */}
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-warning"
                                                            onClick={() => navigate(`/brands/${brand._id}`)}
                                                            title="Edit"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                            <span className="d-none d-md-inline ms-1">Edit</span>
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(brand._id)}
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
                                Showing {indexOfFirstBrand + 1}-{Math.min(indexOfLastBrand, filteredBrands.length)} of {filteredBrands.length} brands
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <div className="empty-state">
                                <i className="bi bi-box-seam display-4 text-muted"></i>
                                <h4 className="mt-3">No brands found</h4>
                                <p className="text-muted">
                                    {searchTerm ? 'No brands match your search.' : 'You currently have no brands.'}
                                </p>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => navigate('/brands/new')}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add Your First Brand
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

export default BrandList;