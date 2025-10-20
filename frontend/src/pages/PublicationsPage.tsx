import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Award, FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PublicationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('papers');
  const [searchTerm, setSearchTerm] = useState('');

  const papers = [
    {
      id: 1,
      title: "AI-Driven quality assurance in mammography: Enhancing quality control efficiency through automated phantom image evaluation in South Korea",
      authors: "Yun, Hoo et al.",
      journal: "PLoS One",
      year: 2025,
      volume: "20",
      pages: "e0330091",
      doi: "10.1371/journal.pone.0330091"
    },
    {
      id: 2,
      title: "Enhanced Detection Performance of Acute Vertebral Compression Fractures Using a Hybrid Deep Learning and Traditional Quantitative Measurement Approach: Beyond the Limitations of Genant Classification",
      authors: "Lee, Jemyoung et al.",
      journal: "Bioengineering",
      year: 2025,
      volume: "12",
      pages: "64",
      doi: "10.3390/bioengineering12010064"
    },
    {
      id: 3,
      title: "Automated Opportunistic Osteoporosis Screening Using Low-Dose Chest CT among Individuals Undergoing Lung Cancer Screening in a Korean Population",
      authors: "Kang, Woo Young et al.",
      journal: "Diagnostics",
      year: 2024,
      volume: "14",
      pages: "1789",
      doi: "10.3390/diagnostics14161789"
    },
    {
      id: 4,
      title: "Artificial intelligence-based classification and segmentation of bladder cancer in cystoscope images",
      authors: "Hwang, Won Ku et al.",
      journal: "Cancers",
      year: 2024,
      volume: "17",
      pages: "57",
      doi: "10.3390/cancers17010057"
    },
    {
      id: 5,
      title: "Automated deep learning-based bone mineral density assessment for opportunistic osteoporosis screening using various CT protocols with multi-vendor scanners",
      authors: "Park, Heejun et al.",
      journal: "Scientific Reports",
      year: 2024,
      volume: "14",
      pages: "25014",
      doi: "10.1038/s41598-024-76249-0"
    },
    {
      id: 6,
      title: "Improved detection accuracy of chronic vertebral compression fractures by integrating height loss ratio and deep learning approaches",
      authors: "Lee, Jemyoung et al.",
      journal: "Diagnostics",
      year: 2024,
      volume: "14",
      pages: "2477",
      doi: "10.3390/diagnostics14212477"
    },
    {
      id: 7,
      title: "Assessing lung fluid status using noninvasive bioelectrical impedance analysis in patients with acute heart failure: A pilot study",
      authors: "Lee, Sunki et al.",
      journal: "International Journal of Cardiology",
      year: 2024,
      volume: "409",
      pages: "132205",
      doi: "10.1016/j.ijcard.2024.132205"
    },
    {
      id: 8,
      title: "Deep learning-based respiratory muscle segmentation as a potential imaging biomarker for respiratory function assessment",
      authors: "Choi, Insung et al.",
      journal: "PLoS One",
      year: 2024,
      volume: "19",
      pages: "e0306789",
      doi: "10.1371/journal.pone.0306789"
    },
    {
      id: 9,
      title: "Clinical validation of a deep-learning-based bone age software in healthy Korean children",
      authors: "Nam, Hyo-Kyoung et al.",
      journal: "Annals of Pediatric Endocrinology & Metabolism",
      year: 2024,
      volume: "29",
      pages: "102-108",
      doi: "10.6065/apem.2346054.027"
    },
    {
      id: 10,
      title: "Evaluation of deep learning-based quantitative computed tomography for opportunistic osteoporosis screening",
      authors: "Oh, Sangseok et al.",
      journal: "Scientific Reports",
      year: 2024,
      volume: "14",
      pages: "363",
      doi: "10.1038/s41598-023-50905-7"
    },
    {
      id: 11,
      title: "Associations of longitudinal multiparametric MRI findings and clinical outcomes in intra-articular injections for knee osteoarthritis",
      authors: "Kang, Woo Young et al.",
      journal: "Diagnostics",
      year: 2024,
      volume: "14",
      pages: "2025",
      doi: "10.3390/diagnostics14182025"
    },
    {
      id: 12,
      title: "Deep learning-based pectoralis muscle volume segmentation method from chest computed tomography image using sagittal range detection and axial slice-based segmentation",
      authors: "Yang, Zepa et al.",
      journal: "PLoS One",
      year: 2023,
      volume: "18",
      pages: "e0290950",
      doi: "10.1371/journal.pone.0290950"
    },
    {
      id: 13,
      title: "Multicentre external validation of a commercial artificial intelligence software to analyse chest radiographs in health screening environments with low disease prevalence",
      authors: "Kim, Cherry et al.",
      journal: "European Radiology",
      year: 2023,
      volume: "33",
      pages: "3501-3509",
      doi: "10.1007/s00330-022-09334-5"
    },
    {
      id: 14,
      title: "Accuracy of two deep learning–based reconstruction methods compared with an adaptive statistical iterative reconstruction method for solid and ground-glass nodule volumetry on low-dose and ultra–low-dose chest computed tomography: A phantom study",
      authors: "Choi, Juwhan et al.",
      journal: "PLoS One",
      year: 2022,
      volume: "17",
      pages: "e0270122",
      doi: "10.1371/journal.pone.0270122"
    },
    {
      id: 15,
      title: "Multifragmentary patellar fracture has a distinct fracture pattern which makes coronal split, inferior pole, or satellite fragments",
      authors: "Cho, Jae-Woo et al.",
      journal: "Scientific Reports",
      year: 2021,
      volume: "11",
      pages: "22836",
      doi: "10.1038/s41598-021-02328-x"
    }
  ];

  const patents = [
    {
      id: 1,
      title: "복강경 이미지에서 연기를 감지하는 전자 장치 및 그 동작 방법",
      number: "10-2024-0062398",
      country: "대한민국",
      status: "등록",
      date: "2024.05"
    },
    {
      id: 2,
      title: "진균성 부비동염 검출 장치 및 검출 방법",
      number: "10-2023-0194942",
      country: "대한민국",
      status: "등록",
      date: "2023.12"
    },
    {
      id: 3,
      title: "COPD 환자를 위한 인공지능 기반의 약제 처방 시스템",
      number: "10-2587222",
      country: "대한민국",
      status: "등록",
      date: "2023.10"
    },
    {
      id: 4,
      title: "소아엑스레이 영상의 폐 영역 세그멘테이션 방법 및 장치",
      number: "10-2581540",
      country: "대한민국",
      status: "등록",
      date: "2023.09"
    },
    {
      id: 5,
      title: "흉부 CT 영상을 이용한 호흡근 분류 모델 학습 방법 및 장치",
      number: "10-2023-0083206",
      country: "대한민국",
      status: "출원",
      date: "2023.06"
    }
  ];

  const standards = [
    {
      id: 1,
      title: "의료용 전기기기 — 진단용 엑스선 — 제2부: 선질 등가 여과와 영구 여과에 대한 지침 및 근거",
      number: "KS C IEC TR 60522-2:2020",
      organization: "산업표준심의회",
      year: 2023
    },
    {
      id: 2,
      title: "의료용 전기기기 — 진단용 엑스선 — 제1부: 선질 등가 여과 및 영구 여과의 측정",
      number: "KS C IEC 60522-1:2020",
      organization: "산업표준심의회",
      year: 2023
    },
    {
      id: 3,
      title: "의료 영상 진단실의 평가 및 일상 시험 — 제3-5부: 인수 시험 및 일관성 시험 — 컴퓨터 단층촬영용 엑스선 장치의 촬영 성능",
      number: "KS C IEC 61223-3-5:2019",
      organization: "산업표준심의회",
      year: 2023
    }
  ];

  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <button onClick={() => navigate('/members')} className="text-gray-700 hover:text-blue-600 font-medium transition">
                구성원
              </button>
              <button onClick={() => navigate('/publications')} className="text-blue-600 font-semibold">
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
            <h1 className="text-5xl font-bold mb-4">Publications</h1>
            <p className="text-xl text-blue-100">연구 실적 및 출판물</p>
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">40+</div>
              <p className="text-gray-700 font-medium">SCI(E) 논문</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
              <div className="text-4xl font-bold text-indigo-600 mb-2">8건</div>
              <p className="text-gray-700 font-medium">특허</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">5건</div>
              <p className="text-gray-700 font-medium">KS 표준</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('papers')}
              className={`pb-4 px-4 font-semibold transition ${
                activeTab === 'papers'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>학술 논문</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('patents')}
              className={`pb-4 px-4 font-semibold transition ${
                activeTab === 'patents'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>특허</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('standards')}
              className={`pb-4 px-4 font-semibold transition ${
                activeTab === 'standards'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>표준</span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          {activeTab === 'papers' && (
            <div className="mb-8">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="논문 제목이나 저자로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Papers List */}
          {activeTab === 'papers' && (
            <div className="space-y-6">
              {filteredPapers.map((paper, index) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{paper.title}</h3>
                  <p className="text-gray-600 mb-3">{paper.authors}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium text-blue-600">{paper.journal}</span>
                    <span>•</span>
                    <span>{paper.year}</span>
                    <span>•</span>
                    <span>{paper.volume}</span>
                    <span>•</span>
                    <span>pp. {paper.pages}</span>
                  </div>
                  {paper.doi && (
                    <div className="mt-3">
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        DOI: {paper.doi} →
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Patents List */}
          {activeTab === 'patents' && (
            <div className="space-y-6">
              {patents.map((patent, index) => (
                <motion.div
                  key={patent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">{patent.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      patent.status === '등록' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {patent.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-medium">특허번호:</span> {patent.number}</p>
                    <p><span className="font-medium">국가:</span> {patent.country}</p>
                    <p><span className="font-medium">등록일:</span> {patent.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Standards List */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              {standards.map((standard, index) => (
                <motion.div
                  key={standard.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{standard.title}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-medium">표준번호:</span> {standard.number}</p>
                    <p><span className="font-medium">제정기관:</span> {standard.organization}</p>
                    <p><span className="font-medium">제정년도:</span> {standard.year}</p>
                  </div>
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
