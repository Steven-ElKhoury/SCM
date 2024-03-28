import React, { useState } from 'react';
import { FormControl, Button, Form, Container, Row, Col } from 'react-bootstrap';
import '../css/CreateEmployee.css'; // Import your custom CSS file

function CreateEmployee() {
    const [employee, setEmployee] = useState({
        name: '',
        dob: '',
        personalEmail: '',
        position: '',
        role: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        dob: '',
        personalEmail: '',
        position: '',
        role: '',
    });

    const handleChange = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.value,
        });
        setErrors({
            ...errors,
            [e.target.name]: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation
        let newErrors = {};
        if (!employee.name.trim()) newErrors.name = 'Please enter a name.';
        if (!employee.dob) newErrors.dob = 'Please enter a date of birth.';
        if (!employee.personalEmail.includes('@')) newErrors.email = 'Please enter a valid email.';
        if (!employee.position.trim()) newErrors.position = 'Please enter a position.';
        if (!employee.role) newErrors.role = 'Please select a role.';
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        // Send the employee data to the server
        const response = await fetch('http://localhost:3001/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employee)
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log('User created successfully:', data);
        } else {
            console.log('Failed to create user:', response.statusText);
        }
    };

    return (
            <Row className="justify-content-md-center">
                <Col>
                    <Form className="create-employee-form" onSubmit={handleSubmit}>
                    
                     <Form.Label>Name</Form.Label>
                        <FormControl 
                            className="mb-3"
                            placeholder="Name" 
                            name="name" 
                            value={employee.name} 
                            onChange={handleChange} 
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback className = "feedback" type="invalid">{errors.name}</Form.Control.Feedback>
                    <Form.Label>Date of Birth</Form.Label>
                        <FormControl 
                            className="mb-3"
                            placeholder="Date of Birth" 
                            name="dob" 
                            type="date" 
                            value={employee.dob} 
                            onChange={handleChange} 
                            isInvalid={!!errors.dob}
                        />
                        <Form.Control.Feedback className = "feedback" type="invalid">{errors.dob}</Form.Control.Feedback>
                        
                        <Form.Label>Email</Form.Label>
                        
                        <FormControl 
                            className="mb-3"
                            placeholder="Email" 
                            name="personalEmail" 
                            type="email" 
                            value={employee.personalEmail} 
                            onChange={handleChange} 
                            isInvalid={!!errors.personalEmail}
                        />
                        <Form.Control.Feedback className = "feedback" type="invalid">{errors.email}</Form.Control.Feedback>
                        
                        <Form.Label>Position</Form.Label>
                        <FormControl 
                            className="mb-3"
                            placeholder="Position" 
                            name="position" 
                            value={employee.position} 
                            onChange={handleChange} 
                            isInvalid={!!errors.position}
                        />
                        <Form.Control.Feedback className = "feedback" type="invalid">{errors.position}</Form.Control.Feedback>
                        
                        <Form.Label>Role</Form.Label>
                        <Form.Select 
                            className="role-select mb-3"
                            name="role" 
                            value={employee.role} 
                            onChange={handleChange} 
                            isInvalid={!!errors.role}
                        >
                            <option value="">Select a role</option>
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                        </Form.Select>
                        <Form.Control.Feedback className = "feedback" type="invalid">{errors.role}</Form.Control.Feedback>

                        <Button className="submit-button mt-3" type="submit">Create Employee</Button>
                    </Form>
                </Col>
            </Row>
    );
}

export default CreateEmployee;