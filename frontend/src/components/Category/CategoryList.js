import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../stylesheet/Category/CategoryList.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('/api/categories/get/all');
            setCategories(response.data);
        } catch (err) {
            setError('Failed to load categories. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            try {
                setError('');
                await axios.delete(`/api/categories/${id}`);
                setCategories(categories.filter(category => category._id !== id));
                // Show success feedback
                setError(''); // Clear any previous errors
                setTimeout(() => {
                    // This would be better with a proper toast notification
                    alert('Category deleted successfully');
                }, 100);
            } catch (err) {
                setError('Failed to delete categories. ' + (err.response?.data?.message || err.message));
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

    const sortedCategories = [...categories].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredCategories = sortedCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastCategories = currentPage * categoriesPerPage;
    const indexOfFirstCategories = indexOfLastCategories - categoriesPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategories, indexOfLastCategories);
    const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="categories-management-container">
            <Sidebar />
            <div className="main-content">
                <div className="categories-table-wrapper">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                        <h2 className="mb-3 mb-md-0">Category Management</h2>
                        <div className="d-flex gap-3 flex-wrap">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Search categories..."
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
                                onClick={() => navigate('/categories/new')}
                            >
                                <i className="bi bi-plus-lg me-2"></i>
                                Add Category
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
                            <p className="mt-3 fs-5">Loading categories...</p>
                        </div>
                    ) : filteredCategories.length > 0 ? (
                        <>
                            <div className="categories-table-container">
                                <table className="categories-table">
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
                                        {currentCategories.map(category => (
                                            <tr key={category._id}>
                                                <td>
                                                    <div className="image-preview-small">
                                                        <img
                                                            src={category.image?.url || '/placeholder.png'}
                                                            alt={category.name}
                                                            className="categories-image-tiny"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/placeholder.png';
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong>{category.name}</strong>
                                                </td>
                                                <td className="description-cell">
                                                    {category.description}
                                                    {category.description && category.description.length > 100 && (
                                                        <button
                                                            className="btn btn-link btn-sm p-0 ms-2"
                                                            onClick={() => {
                                                                // This would be better with a modal or expandable section
                                                                alert(category.description);
                                                            }}
                                                        >
                                                            Read more
                                                        </button>
                                                    )}
                                                </td>
                                                <td className='date-cell'>
                                                    {new Date(category.updatedAt).toLocaleString('en-US', {
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
                                                            onClick={() => navigate(`/categories/view/${category._id}`)}
                                                            title="View details"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                            <span className="d-none d-md-inline ms-1">View</span>
                                                        </button>

                                                        {/* Edit Button */}
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-warning"
                                                            onClick={() => navigate(`/categories/edit/${category._id}`)}
                                                            title="Edit"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                            <span className="d-none d-md-inline ms-1">Edit</span>
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(category._id)}
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
                                Showing {indexOfFirstCategories + 1}-{Math.min(indexOfLastCategories, filteredCategories.length)} of {filteredCategories.length} categories
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <div className="empty-state">
                                <i className="bi bi-box-seam display-4 text-muted"></i>
                                <h4 className="mt-3">No category found</h4>
                                <p className="text-muted">
                                    {searchTerm ? 'No categories match your search.' : 'You currently have no category.'}
                                </p>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => navigate('/categories/new')}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add Your First Category
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

export default CategoryList;