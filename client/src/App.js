import React, { useState, useEffect } from 'react';
import './App.css';
import EmployeeList from './EmployeeList';

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    salary: '',
    dob: '',
    age: '',
    currentAddress: '',
    isSameAddress: false,
    department: '',
    designation: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [entries, setEntries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [showTable, setShowTable] = useState(false);

  const PAGE_SIZE = 10;

  useEffect(() => {
    console.log('Effect running');
    const storedEntries = JSON.parse(localStorage.getItem('employeeEntries')) || [];
    console.log('Loaded entries from local storage:', storedEntries);
    setEntries(storedEntries);
    setTotalPages(Math.ceil(storedEntries.length / PAGE_SIZE));
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('employeeEntries', JSON.stringify(entries));
      console.log('Saved entries to local storage:', entries);
    }
  }, [entries]);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleCheckboxChange = () => {
    setFormData({
      ...formData,
      isSameAddress: !formData.isSameAddress,
      permanentAddress: formData.isSameAddress ? formData.currentAddress : formData.permanentAddress,
    });
  };

  const handleNextClick = () => {
    // Validate data for the first page before proceeding to the next page
    if (!formData.name || !formData.salary || !formData.dob || !formData.currentAddress) {
      alert('Please fill out all required fields.');
      return;
    }

    setCurrentPage(2);
  };

  const handleSubmit = async () => {
    // Validate data for the second page before submitting to the database
    if (!formData.department) {
      alert('Please select a department.');
      return;
    }

    const data = {
      ...formData,
      permanentAddress: formData.isSameAddress ? formData.currentAddress : formData.permanentAddress,
    };

    try {
      // Send data to the server
      const response = await fetch('https://ems-1-v6de.onrender.com/api/addEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add employee');
      }

      console.log('Employee added successfully');
      setEntries([...entries, data]);
      setFormData({
        name: '',
        salary: '',
        dob: '',
        age: '',
        currentAddress: '',
        isSameAddress: false,
        department: '',
        designation: '',
      });
      setCurrentPage(1);
      setIsSubmitted(true);
      setTotalPages(Math.ceil((entries.length + 1) / PAGE_SIZE));
      setShowTable(true);
    } catch (error) {
      console.error('Error adding employee:', error.message);
      alert('Failed to add employee. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      salary: '',
      dob: '',
      age: '',
      currentAddress: '',
      isSameAddress: false,
      department: '',
      designation: '',
    });
    setIsSubmitted(false);
    setShowTable(false);
  };

  const handleResetLocalStorageClick = () => {
    localStorage.removeItem('employeeEntries');
    setEntries([]);
    setTotalPages(1);
    setCurrentPage(1);
    setShowTable(false);
  };

  const handleDobChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    
    // Ensure the user is at least 20 years old
    if (age < 20) {
      alert('You must be at least 20 years old.');
      return;
    }

    setFormData({
      ...formData,
      dob: event.target.value,
      age: calculateAge(event.target.value),
    });
  };

  const handleNameChange = (event) => {
    const newName = event.target.value.replace(/[^A-Za-z\s]/g, '');

    // Ensure the name is within 30 characters
    if (newName.length > 30) {
      alert('Name should be within 30 characters.');
      return;
    }

    setFormData({
      ...formData,
      name: newName,
    });
  };

  const handleSalaryChange = (event) => {
    const newSalary = event.target.value.replace(/[^0-9]/g, '');
    setFormData({
      ...formData,
      salary: newSalary,
    });
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">IRIS COMPANY</div>
        <div className="navbar-right">
          <button type="button" onClick={handleResetLocalStorageClick}>
            Reset
          </button>
        </div>
      </nav>

      <div className="app-container">
        <h4>We Welcome you to the IRIS company's employee details form page </h4>
        {isSubmitted ? (
          <div className="modal">
            <p>Form submitted successfully!</p>
            <button onClick={resetForm}>Submit Another Entry</button>
          </div>
        ) : (
          <form>
            {currentPage === 1 && (
              <>
                <label>Name:</label>
                <input type="text" value={formData.name} onChange={handleNameChange} />
                <br />
                <label>Salary:</label>
                <input type="text" value={formData.salary} onChange={handleSalaryChange} />
                <br />
                <label>Date of Birth:</label>
                <input type="date" value={formData.dob} onChange={handleDobChange} />
                <br />
                <label>Age:</label>
                <input type="text" value={formData.age} readOnly />
                <br />
                <label>Current Address:</label>
                <input type="text" value={formData.currentAddress} onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })} />
                <br />
                <label>Permanent Address same as Current Address:</label>
                <input type="checkbox" checked={formData.isSameAddress} onChange={handleCheckboxChange} />
                <br />
                <button type="button" onClick={handleNextClick}>
                  Next
                </button>
              </>
            )}

            {currentPage === 2 && (
              <>
                <label>Permanent Address:</label>
                <input
                  type="text"
                  value={formData.isSameAddress ? formData.currentAddress : formData.permanentAddress}
                  onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                  readOnly={formData.isSameAddress}
                />
                <br />
                <label>Department:</label>
                <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="CSE">CSE</option>
                  <option value="CSBS">CSBS</option>
                </select>
                <br />
                <label>Designation:</label>
                <div>
                  <input
                    type="radio"
                    id="student"
                    name="designation"
                    value="student"
                    checked={formData.designation === 'student'}
                    onChange={() => setFormData({ ...formData, designation: 'student' })}
                  />
                  <label htmlFor="student">Student</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="faculty"
                    name="designation"
                    value="faculty"
                    checked={formData.designation === 'faculty'}
                    onChange={() => setFormData({ ...formData, designation: 'faculty' })}
                  />
                  <label htmlFor="faculty">Faculty</label>
                </div>
                <br />
                <button type="button" onClick={handleSubmit}>
                  Submit
                </button>
              </>
            )}
          </form>
        )}

        {showTable && (
          <div>
            <h2>Employee Entries</h2>
            <EmployeeList entries={entries} currentPage={currentPage} pageSize={PAGE_SIZE} />
            <div>
              {/* Pagination controls */}
              <p>Page {currentPage} of {totalPages}</p>
              <button type="button" onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <button type="button" onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
