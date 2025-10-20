import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, User, Calendar, BookOpen, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Researcher {
  id: number;
  name: string;
  studentId: string;
  grade: string;
  admissionYear: number;
  email: string;
  phone: string | null;
  status: string;
  joinDate: string;
  researchAreas: string[];
  photoUrl: string | null;
}

export default function MembersPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/public/researchers');
      setMembers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const gradeLabels: { [key: string]: string } = {
    FRESHMAN: '1학년',
    SOPHOMORE: '2학년',
    JUNIOR: '3학년',
    SENIOR: '4학년',
    GRADUATE: '대학원생'
  };

  const statusLabels: { [key: string]: string } = {
    ACTIVE: '재학',
    ON_LEAVE: '휴학',
    GRADUATED: '졸업',
    INTERNSHIP: '인턴십'
  };

  const statusColors: { [key: string]: string } = {
    ACTIVE: 'bg-green-100 text-green-700',
    ON_LEAVE: 'bg-yellow-100 text-yellow-700',
    GRADUATED: 'bg-gray-100 text-gray-700',
    INTERNSHIP: 'bg-blue-100 text-blue-700'
  };

  const researchAreaLabels: { [key: string]: string } = {
    Medical_AI: '의료 AI',
    Deep_Learning: '딥러닝',
    CT_Physics: 'CT Physics',
    Computer_Vision: '컴퓨터 비전',
    LLM: 'LLM',
    Backend: '백엔드',
    Data_Analysis: '데이터 분석'
  };

  const grades = ['ALL', 'SENIOR', 'JUNIOR', 'SOPHOMORE', 'FRESHMAN', 'GRADUATE'];

  const filteredMembers = selectedGrade === 'ALL'
    ? members
    : members.filter(m => m.grade === selectedGrade);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Efficient Computing Lab</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => navigate('/professor')} className="text-gray-700 hover:text-blue-600 font-medium transition">
                교수소개
              </button>
              <button onClick={() => navigate('/members')} className="text-blue-600 font-semibold">
                구성원
              </button>
              <button onClick={() => navigate('/publications')} className="text-gray-700 hover:text-blue-600 font-medium transition">
                Publications
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">연구실 구성원</h1>
            <p className="text-xl text-blue-100">Lab Members</p>
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">{members.length}</div>
              <p className="text-gray-700 font-medium">총 연구원</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {members.filter(m => m.grade === 'SENIOR' || m.grade === 'JUNIOR').length}
              </div>
              <p className="text-gray-700 font-medium">3-4학년</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {members.filter(m => m.grade === 'SOPHOMORE' || m.grade === 'FRESHMAN').length}
              </div>
              <p className="text-gray-700 font-medium">1-2학년</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl">
              <div className="text-4xl font-bold text-pink-600 mb-2">
                {members.filter(m => m.grade === 'GRADUATE').length}
              </div>
              <p className="text-gray-700 font-medium">대학원생</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Filter */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {grades.map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedGrade === grade
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {grade === 'ALL' ? '전체' : gradeLabels[grade]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">로딩 중...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-20">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">해당하는 연구원이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6"
                >
                  {/* Profile Picture */}
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>

                  {/* Name and Status */}
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[member.status]}`}>
                        {statusLabels[member.status]}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                        {gradeLabels[member.grade]}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                      <span className="font-medium">학번:</span>
                      <span className="ml-2">{member.studentId}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                      <a href={`mailto:${member.email}`} className="hover:text-blue-600 truncate">
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                      <span className="font-medium">입학:</span>
                      <span className="ml-2">{member.admissionYear}년</span>
                    </div>
                  </div>

                  {/* Research Areas */}
                  {member.researchAreas && member.researchAreas.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex items-center mb-2">
                        <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">연구 분야</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {member.researchAreas.map((area, areaIndex) => (
                          <span
                            key={areaIndex}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                          >
                            {researchAreaLabels[area] || area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Efficient Computing Lab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
