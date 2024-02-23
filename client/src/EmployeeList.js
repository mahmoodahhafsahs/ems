import React from 'react';

const EmployeeList = ({ entries, currentPage, pageSize }) => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedEntries = entries.slice(startIndex, endIndex);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Salary</th>
          <th>Date of Birth</th>
          <th>Age</th>
          <th>Current Address</th>
          <th>Permanent Address</th>
          <th>Department</th>
          <th>Designation</th>
        </tr>
      </thead>
      <tbody>
        {displayedEntries.map((entry, index) => (
          <tr key={index}>
            <td>{entry.name}</td>
            <td>{entry.salary}</td>
            <td>{entry.dob}</td>
            <td>{entry.age}</td>
            <td>{entry.currentAddress}</td>
            <td>{entry.permanentAddress}</td>
            <td>{entry.department}</td>
            <td>{entry.designation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeList;
