'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function SchoolAdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    grade: '',
    studentId: '',
    graduationYear: ''
  });

  const grades = ['9th', '10th', '11th', '12th'];
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Check if user is logged in and is a school admin
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn || !user || user.userType !== 'school') {
      router.push('/login');
      return;
    }

    setCurrentUser(user);
    loadStudents(user);
  }, [router]);

  const loadStudents = (user) => {
    try {
      // Load all users and filter for students belonging to this school
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const schoolStudents = allUsers.filter(u => 
        u.userType === 'student' && u.schoolId === user.id
      );

      // Load opportunities to calculate volunteer hours
      const savedOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const sampleOpportunities = [
        {
          id: 1,
          title: "Beach Cleanup Volunteer",
          organization: "Ocean Conservation Society",
          location: "Santa Monica Beach, CA",
          date: "June 15, 2025",
          time: "9:00 AM - 12:00 PM",
          category: "Environment",
          description: "Join us for a morning of beach cleanup to protect marine life and keep our coastlines beautiful.",
          volunteers: 12,
          maxVolunteers: 20,
          volunteerHours: 3
        },
        {
          id: 2,
          title: "Food Bank Assistant",
          organization: "Community Food Network",
          location: "Downtown Food Bank",
          date: "June 18, 2025",
          time: "2:00 PM - 6:00 PM",
          category: "Community",
          description: "Help sort and distribute food to families in need. No experience required - training provided.",
          volunteers: 8,
          maxVolunteers: 15,
          volunteerHours: 4
        },
        {
          id: 3,
          title: "Reading Tutor for Kids",
          organization: "Literacy First",
          location: "Lincoln Elementary School",
          date: "June 20, 2025",
          time: "3:30 PM - 5:30 PM",
          category: "Education",
          description: "Support elementary students with reading skills through one-on-one tutoring sessions.",
          volunteers: 5,
          maxVolunteers: 10,
          volunteerHours: 2
        },
        {
          id: 4,
          title: "Senior Center Activities",
          organization: "Golden Years Community Center",
          location: "Riverside Senior Center",
          date: "June 22, 2025",
          time: "1:00 PM - 4:00 PM",
          category: "Healthcare",
          description: "Lead recreational activities and provide companionship for seniors in our community.",
          volunteers: 3,
          maxVolunteers: 8,
          volunteerHours: 3
        }
      ];
      
      const allOpportunities = [...sampleOpportunities, ...savedOpportunities];
      
      // Calculate volunteer hours for each student
      const studentsWithHours = schoolStudents.map(student => {
        const appliedOpportunities = student.appliedOpportunities || [];
        let totalHours = 0;
        const completedOpportunities = [];
        
        appliedOpportunities.forEach(oppId => {
          const opportunity = allOpportunities.find(opp => opp.id === oppId);
          if (opportunity) {
            totalHours += opportunity.volunteerHours || 0;
            completedOpportunities.push({
              id: opportunity.id,
              title: opportunity.title,
              organization: opportunity.organization,
              date: opportunity.date,
              hours: opportunity.volunteerHours || 0,
              category: opportunity.category
            });
          }
        });

        return {
          ...student,
          totalVolunteerHours: totalHours,
          completedOpportunities: completedOpportunities,
          applicationCount: appliedOpportunities.length
        };
      });

      setStudents(studentsWithHours);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.grade || !newStudent.studentId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Check if student ID already exists
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingStudent = allUsers.find(u => 
        u.userType === 'student' && u.studentId === newStudent.studentId
      );

      if (existingStudent) {
        alert('A student with this ID already exists');
        return;
      }

      // Check if email already exists
      const existingEmail = allUsers.find(u => u.email === newStudent.email);
      if (existingEmail) {
        alert('A user with this email already exists');
        return;
      }

      const studentData = {
        id: Date.now(),
        name: newStudent.name,
        email: newStudent.email,
        password: 'student123', // Default password - student should change this
        userType: 'student',
        schoolId: currentUser.id,
        schoolName: currentUser.name,
        grade: newStudent.grade,
        studentId: newStudent.studentId,
        graduationYear: newStudent.graduationYear || (currentYear + (12 - parseInt(newStudent.grade))),
        appliedOpportunities: [],
        createdAt: new Date().toISOString()
      };

      // Add to users array
      allUsers.push(studentData);
      localStorage.setItem('users', JSON.stringify(allUsers));

      // Reset form and close modal
      setNewStudent({
        name: '',
        email: '',
        grade: '',
        studentId: '',
        graduationYear: ''
      });
      setShowAddStudentModal(false);

      // Reload students
      loadStudents(currentUser);

      alert('Student added successfully! Default password is: student123');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student. Please try again.');
    }
  };

  const handleDeleteStudent = (studentId) => {
    if (!confirm('Are you sure you want to remove this student? This action cannot be undone.')) {
      return;
    }

    try {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = allUsers.filter(u => u.id !== studentId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      loadStudents(currentUser);
      alert('Student removed successfully');
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Error removing student. Please try again.');
    }
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  // Calculate analytics
  const totalStudents = students.length;
  const totalVolunteerHours = students.reduce((sum, student) => sum + student.totalVolunteerHours, 0);
  const averageHours = totalStudents > 0 ? (totalVolunteerHours / totalStudents).toFixed(1) : 0;
  const activeStudents = students.filter(s => s.applicationCount > 0).length;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading school dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentUser?.name || 'School'} Admin Dashboard 🏫
                </h1>
                <p className="text-gray-600 mt-2">Manage student accounts and track volunteer hours</p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Add Student
                </button>
                <button
                  onClick={() => loadStudents(currentUser)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Cards */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Students</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Volunteer Hours</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalVolunteerHours}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Average Hours/Student</p>
                    <p className="text-2xl font-semibold text-gray-900">{averageHours}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Students</p>
                    <p className="text-2xl font-semibold text-gray-900">{activeStudents}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search students by name, email, or student ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Grades</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade} Grade</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500">
                    {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Students Table */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedGrade !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Add your first student to get started!'
                    }
                  </p>
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Add Student
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Volunteer Hours
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applications
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {student.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.studentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {student.totalVolunteerHours} hours
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {student.applicationCount} applications
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => viewStudentDetails(student)}
                              className="text-emerald-600 hover:text-emerald-900"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Add Student Modal */}
        {showAddStudentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Student</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter student's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter student's email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade *
                  </label>
                  <select
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade} Grade</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    value={newStudent.studentId}
                    onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter unique student ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year (optional)
                  </label>
                  <input
                    type="number"
                    value={newStudent.graduationYear}
                    onChange={(e) => setNewStudent({...newStudent, graduationYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 2028"
                    min={currentYear}
                    max={currentYear + 10}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Student Details Modal */}
        {showStudentModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Student Details: {selectedStudent.name}
                </h3>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedStudent.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedStudent.email}</p>
                    <p><span className="font-medium">Grade:</span> {selectedStudent.grade}</p>
                    <p><span className="font-medium">Student ID:</span> {selectedStudent.studentId}</p>
                    <p><span className="font-medium">Graduation Year:</span> {selectedStudent.graduationYear}</p>
                  </div>
                </div>

             <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Volunteer Summary</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Total Hours:</span> {selectedStudent.totalVolunteerHours}</p>
                    <p><span className="font-medium">Applications:</span> {selectedStudent.applicationCount}</p>
                    <p><span className="font-medium">Completed:</span> {selectedStudent.completedOpportunities?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Completed Opportunities */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Completed Volunteer Opportunities</h4>
                {selectedStudent.completedOpportunities && selectedStudent.completedOpportunities.length > 0 ? (
                  <div className="space-y-3">
                    {selectedStudent.completedOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900">{opportunity.title}</h5>
                            <p className="text-sm text-gray-600">{opportunity.organization}</p>
                            <p className="text-sm text-gray-500">{opportunity.date}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              {opportunity.hours} hours
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{opportunity.category}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <p>No completed volunteer opportunities yet</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}