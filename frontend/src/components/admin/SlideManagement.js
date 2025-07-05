import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const SlideManagement = () => {
  const [slides, setSlides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    isActive: true
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await axios.get('/api/slides');
      setSlides(response.data);
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', image);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('link', formData.link);
      formDataToSend.append('isActive', formData.isActive);

      await axios.post('/api/slides', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchSlides();
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        link: '',
        isActive: true
      });
      setImage(null);
    } catch (error) {
      console.error('Error creating slide:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/slides/${id}`);
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  return (
    <div className="slide-management">
      <h2>Slider Management</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add New Slide
      </Button>

      <div className="slides-list mt-4">
        {slides.map((slide) => (
          <div key={slide._id} className="slide-item mb-3 p-3 border rounded">
            <img 
              src={slide.image.url} 
              alt={slide.title || 'Slide'} 
              className="img-thumbnail" 
              style={{ maxHeight: '100px' }}
            />
            <div className="slide-info mt-2">
              <h5>{slide.title || 'No Title'}</h5>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => handleDelete(slide._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Slide</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control 
                type="file" 
                onChange={(e) => setImage(e.target.files[0])} 
                required 
              />
            </Form.Group>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>Title (Optional)</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>
            <Form.Group controlId="formLink" className="mb-3">
              <Form.Label>Link URL (Optional)</Form.Label>
              <Form.Control 
                type="url" 
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
              />
            </Form.Group>
            <Form.Group controlId="formIsActive" className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Active" 
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Slide
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SlideManagement;