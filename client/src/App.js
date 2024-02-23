import React, { useState, useEffect } from 'react';
import './App.css';
import EmployeeList from './EmployeeList';

const App = () => {
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
    setIsSameAddress(!isSameAddress);

    if (!isSameAddress) {
      setPermanentAddress(currentAddress);
    }
  };

  const handleSubmit = async () => {
    if (!name || !salary || !dob || !currentAddress || !department || !designation) {
      alert('Please fill out all required fields.');
      return;
    }

    const data = {
      name,
      salary,
      dob,
      age,
      currentAddress,
      permanentAddress: isSameAddress ? currentAddress : permanentAddress,
      department,
      designation,
    };

    try {
      const response = await fetch('http://localhost:5000/api/addEmployee', {
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
      setName('');
      setSalary('');
      setDob('');
      setAge('');
      setCurrentAddress('');
      setPermanentAddress('');
      setIsSameAddress(false);
      setDepartment('');
      setDesignation('');
      setIsSubmitted(true);
      setTotalPages(Math.ceil((entries.length + 1) / PAGE_SIZE));
      setShowTable(true);
    } catch (error) {
      console.error('Error adding employee:', error.message);
      alert('Failed to add employee. Please try again.');
    }
  };

  const resetForm = () => {
    setName('');
    setSalary('');
    setDob('');
    setAge('');
    setCurrentAddress('');
    setPermanentAddress('');
    setIsSameAddress(false);
    setDepartment('');
    setDesignation('');
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
    setDob(event.target.value);
    const newAge = calculateAge(event.target.value);
    setAge(newAge);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleNameChange = (event) => {
    const newName = event.target.value.replace(/[^A-Za-z\s]/g, '');
    setName(newName);
  };

  const handleSalaryChange = (event) => {
    const newSalary = event.target.value.replace(/[^0-9]/g, '');
    setSalary(newSalary);
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
            <label>Name:</label>
            <input type="text" value={name} onChange={handleNameChange} />
            <br />
            <label>Salary:</label>
            <input type="text" value={salary} onChange={handleSalaryChange} />
            <br />
            <label>Date of Birth:</label>
            <input type="date" value={dob} onChange={handleDobChange} />
            <br />
            <label>Age:</label>
            <input type="text" value={age} readOnly />
            <br />
            <label>Current Address:</label>
            <input type="text" value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} />
            <br />
            <label>Permanent Address:</label>
            <input
              type="text"
              value={isSameAddress ? currentAddress : permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
              readOnly={isSameAddress}
            />
            <br />
            <label>Same as Current Address:</label>
            <input type="checkbox" checked={isSameAddress} onChange={handleCheckboxChange} />
            <br />
            <label>Department:</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="CSE">CSE</option>
              <option value="CSBS">CSBS</option>
            </select>
            <br />
            <label>Designation:</label>
            <div>
              <input type="radio" id="student" name="designation" value="student" checked={designation === 'student'} onChange={() => setDesignation('student')} />
              <label htmlFor="student">Student</label>
            </div>
            <div>
              <input type="radio" id="faculty" name="designation" value="faculty" checked={designation === 'faculty'} onChange={() => setDesignation('faculty')} />
              <label htmlFor="faculty">Faculty</label>
            </div>
            <br />
            <button type="button" onClick={handleSubmit}>
              Submit
            </button>
          </form>
        )}

        {showTable && (
          <div>
            <h2>Employee Entries</h2>
            <EmployeeList entries={entries} currentPage={currentPage} pageSize={PAGE_SIZE} />
            <div>
              {/* Pagination controls */}
              <p>Page {currentPage} of {totalPages}</p>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous Page
              </button>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
