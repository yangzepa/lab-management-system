import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink, GraduationCap, BookOpen, Award, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfessorPage() {
  const navigate = useNavigate();

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
              <button onClick={() => navigate('/professor')} className="text-blue-600 font-semibold">
                교수소개
              </button>
              <button onClick={() => navigate('/members')} className="text-gray-700 hover:text-blue-600 font-medium transition">
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
            <h1 className="text-5xl font-bold mb-4">교수 소개</h1>
            <p className="text-xl text-blue-100">Professor Introduction</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Profile Image */}
                <div className="w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 mx-auto md:mx-0 shadow-lg">
                  <img
                    src="/professor.jpeg"
                    alt="Prof. Zepa Yang"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">양제파</h2>
                  <p className="text-2xl text-blue-600 font-semibold mb-6">조교수 | Assistant Professor</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a href="mailto:yangzepa@gmail.com" className="text-gray-900 hover:text-blue-600">
                          yangzepa@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900">041-530-1319</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Office</p>
                        <p className="text-gray-900">M605호 (멀티미디어동 6층)</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ExternalLink className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Google Scholar</p>
                        <a
                          href="https://scholar.google.com/citations?user=8mIacDwAAAAJ"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">학력 | Education</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="font-semibold text-lg text-gray-900">공학박사 (Ph.D.)</p>
                  <p className="text-gray-600">서울대학교 융합과학기술대학원 방사선과학협동과정, 2018</p>
                  <p className="text-sm text-gray-500 mt-1">Seoul National University, Graduate school of Convergence Science and Technology, Programs in Radiation Sciences</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="font-semibold text-lg text-gray-900">공학석사 (M.S.)</p>
                  <p className="text-gray-600">서울대학교 의과대학 의과학과, 2013</p>
                  <p className="text-sm text-gray-500 mt-1">Seoul National University, College of Medicine, Dept. of Biomedical Sciences</p>
                </div>
                <div className="border-l-4 border-blue-300 pl-4">
                  <p className="font-semibold text-lg text-gray-900">공학사 (B.S.)</p>
                  <p className="text-gray-600">한양대학교 컴퓨터공학과, 2010</p>
                  <p className="text-sm text-gray-500 mt-1">Hanyang University, Computer Engineering</p>
                </div>
              </div>
            </div>

            {/* Research Interests */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">연구 관심 분야 | Research Interests</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">🏥 CT Physics Based Research</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Synthetic and low-dose CT simulation</li>
                    <li>• Iterative reconstruction modeling</li>
                    <li>• Beam hardening estimation and correction</li>
                    <li>• Protocol optimization</li>
                  </ul>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">📊 Medical Data Curation</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Large-scale clinical data curation</li>
                    <li>• Advanced anonymization methods</li>
                    <li>• Multimodal data integration</li>
                    <li>• Secure governance frameworks</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">🔬 Image Processing</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Multimodal medical imaging (CT, MR, US)</li>
                    <li>• Quantitative biomarkers</li>
                    <li>• Signal and image processing</li>
                    <li>• AR/VR-enabled medical imaging</li>
                  </ul>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-900 mb-2">🤖 Automation & AI</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• AI-driven automation frameworks</li>
                    <li>• ML for classification/detection/segmentation</li>
                    <li>• LLM/AGI-based medical applications</li>
                    <li>• Large-scale feature extraction</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Career */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <Award className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">경력 | Career</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="font-semibold text-lg text-gray-900">순천향대학교 컴퓨터공학과 조교수</p>
                  <p className="text-gray-600">2025.09 - 현재</p>
                  <p className="text-sm text-gray-500 mt-1">Soonchunhyang University, Assistant Professor in Computer Engineering</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="font-semibold text-lg text-gray-900">고려대학교 구로병원 의료영상데이터센터 수석연구원/연구교수</p>
                  <p className="text-gray-600">2017.11 - 2025.08</p>
                  <p className="text-sm text-gray-500 mt-1">Korea University Guro Hospital, Senior Researcher / Research Professor</p>
                </div>
                <div className="border-l-4 border-blue-300 pl-4">
                  <p className="font-semibold text-lg text-gray-900">Techtoast 대표</p>
                  <p className="text-gray-600">2016 - 2019</p>
                  <p className="text-sm text-gray-500 mt-1">Chief, System / Mobile web-app development</p>
                </div>
                <div className="border-l-4 border-blue-200 pl-4">
                  <p className="font-semibold text-lg text-gray-900">Massachusetts General Hospital (MGH) 방문연구원</p>
                  <p className="text-gray-600">2011.07 - 2011.12</p>
                  <p className="text-sm text-gray-500 mt-1">Visiting Research Fellow, Coronary artery detection/segmentation, CT Reconstruction</p>
                </div>
                <div className="border-l-4 border-gray-300 pl-4">
                  <p className="font-semibold text-lg text-gray-900">INFINITT Healthcare / Wooridul MIT 개발자</p>
                  <p className="text-gray-600">2006 - 2008</p>
                  <p className="text-sm text-gray-500 mt-1">PACS / Hospital Information System Developer</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">주요 실적 | Achievements</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <div className="text-4xl font-bold text-blue-600 mb-2">40+</div>
                  <p className="text-gray-700 font-medium">SCI(E) 논문 게재</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">8건</div>
                  <p className="text-gray-700 font-medium">특허 등록</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-4xl font-bold text-purple-600 mb-2">5건</div>
                  <p className="text-gray-700 font-medium">KS 표준 제정</p>
                </div>
              </div>
            </div>
          </motion.div>
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
