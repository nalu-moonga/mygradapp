import React, { useState, useEffect } from 'react';

// PWA functionality - Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered: ', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed: ', error);
      });
  });
}

const FacultyTracker = () => {
  const [faculty, setFaculty] = useState([]);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    school: '',
    lab: '',
    accepting: false,
    emailed: false
  });
  const [editIndex, setEditIndex] = useState(null);
  const [filterSchool, setFilterSchool] = useState('');
  const [sortBy, setSortBy] = useState('school');

  // MIT color scheme
  const colors = {
    cardinal: '#A31F34',
    lightCardinal: '#C25A6C',
    gray: '#8A8B8C',
    lightGray: '#F2F2F2',
    white: '#FFFFFF',
    black: '#333333',
    darkGray: '#666666'
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFaculty({
      ...newFaculty,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Function to add a new faculty
  const addFaculty = () => {
    if (newFaculty.name.trim() === '' || newFaculty.school.trim() === '') {
      return;
    }

    if (editIndex !== null) {
      // Update existing faculty
      const updatedFaculty = [...faculty];
      updatedFaculty[editIndex] = newFaculty;
      setFaculty(updatedFaculty);
      setEditIndex(null);
    } else {
      // Add new faculty
      setFaculty([...faculty, newFaculty]);
    }

    // Reset form
    setNewFaculty({
      name: '',
      school: '',
      lab: '',
      accepting: false,
      emailed: false
    });
  };

  // Function to edit a faculty
  const handleEdit = (index) => {
    setNewFaculty(faculty[index]);
    setEditIndex(index);
  };

  // Function to delete a faculty
  const handleDelete = (index) => {
    const updatedFaculty = faculty.filter((_, i) => i !== index);
    setFaculty(updatedFaculty);
  };

  // Function to handle sorting
  const handleSort = (key) => {
    setSortBy(key);
  };

  // Filter and sort faculty list
  const filteredAndSortedFaculty = faculty
    .filter(item => filterSchool === '' || item.school.toLowerCase().includes(filterSchool.toLowerCase()))
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });

  // Button component for consistent styling
  const Button = ({ children, onClick, primary, small }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-sm 
        ${primary ? 
          `bg-${colors.cardinal.replace('#', '')} text-white hover:bg-opacity-90` : 
          `bg-white text-${colors.black.replace('#', '')} border border-${colors.cardinal.replace('#', '')} hover:bg-${colors.lightGray.replace('#', '')}`
        }
        ${small ? 'text-sm px-2 py-1' : ''}
      `}
      style={{
        backgroundColor: primary ? colors.cardinal : colors.white,
        color: primary ? colors.white : colors.black,
        borderColor: colors.cardinal
      }}
    >
      {children}
    </button>
  );

  // Save data to localStorage whenever faculty changes
  useEffect(() => {
    localStorage.setItem('facultyData', JSON.stringify(faculty));
  }, [faculty]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('facultyData');
    if (savedData) {
      setFaculty(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{ backgroundColor: colors.lightGray }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.black }}>Faculty Application Tracker</h1>
          <p className="mt-2 text-lg" style={{ color: colors.darkGray }}>Keep track of faculty you're interested in working with</p>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" style={{ backgroundColor: colors.white }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.black }}>
            {editIndex !== null ? 'Edit Faculty' : 'Add New Faculty'}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.darkGray }}>Faculty Name*</label>
              <input
                type="text"
                name="name"
                value={newFaculty.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                style={{ borderColor: colors.lightCardinal }}
                placeholder="Dr. Jane Smith"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.darkGray }}>School*</label>
              <input
                type="text"
                name="school"
                value={newFaculty.school}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                style={{ borderColor: colors.lightCardinal }}
                placeholder="Stanford University"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.darkGray }}>Lab Name</label>
              <input
                type="text"
                name="lab"
                value={newFaculty.lab}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                style={{ borderColor: colors.lightCardinal }}
                placeholder="AI Research Lab"
              />
            </div>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="accepting"
                  checked={newFaculty.accepting}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                  style={{ accentColor: colors.cardinal }}
                />
                <label className="ml-2 text-sm" style={{ color: colors.darkGray }}>Accepting Students</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="emailed"
                  checked={newFaculty.emailed}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                  style={{ accentColor: colors.cardinal }}
                />
                <label className="ml-2 text-sm" style={{ color: colors.darkGray }}>Emailed</label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            {editIndex !== null && (
              <Button onClick={() => {
                setEditIndex(null);
                setNewFaculty({
                  name: '',
                  school: '',
                  lab: '',
                  accepting: false,
                  emailed: false
                });
              }}>
                Cancel
              </Button>
            )}
            <Button primary onClick={addFaculty}>
              {editIndex !== null ? 'Update' : 'Add Faculty'}
            </Button>
          </div>
        </div>

        {/* Filter and Sort Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" style={{ backgroundColor: colors.white }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.darkGray }}>Filter by School:</label>
              <input
                type="text"
                value={filterSchool}
                onChange={(e) => setFilterSchool(e.target.value)}
                className="p-2 border rounded-md"
                style={{ borderColor: colors.lightCardinal }}
                placeholder="Enter school name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.darkGray }}>Sort by:</label>
              <div className="flex space-x-2">
                <Button small onClick={() => handleSort('school')} primary={sortBy === 'school'}>School</Button>
                <Button small onClick={() => handleSort('name')} primary={sortBy === 'name'}>Name</Button>
                <Button small onClick={() => handleSort('emailed')} primary={sortBy === 'emailed'}>Emailed</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: colors.white }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: colors.cardinal }}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Faculty</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">School</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Lab</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedFaculty.length > 0 ? (
                  filteredAndSortedFaculty.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.school}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.lab}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.accepting ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.accepting ? 'Accepting' : 'Not Accepting'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.emailed ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {item.emailed ? 'Emailed' : 'Not Emailed'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(index)}
                            className="text-indigo-600 hover:text-indigo-900"
                            style={{ color: colors.cardinal }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No faculty added yet. Add some using the form above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyTracker;
