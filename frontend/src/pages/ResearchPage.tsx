import { motion } from 'framer-motion';
import { GraduationCap, Cpu, Brain, Microscope, Network, Building2, Cross, Factory } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResearchPage() {
  const navigate = useNavigate();

  const researchAreas = [
    {
      id: 1,
      title: "의료 데이터 효율화 및 AI 응용",
      icon: Brain,
      color: "from-blue-600 to-indigo-600",
      description: "의료 영상 분석, CT Physics 기반 영상처리, 딥러닝 기반 의료 AI 개발",
      topics: [
        {
          name: "CT Physics 기반 영상 분석",
          details: [
            "CT 선량 추정 및 최적화",
            "저선량 CT 영상 개선",
            "물리 기반 영상 재구성"
          ]
        },
        {
          name: "Deep Learning 의료영상 응용",
          details: [
            "영상 분할 및 객체 검출",
            "영상 품질 개선 및 노이즈 제거",
            "Transfer Learning 기반 진단 보조"
          ]
        },
        {
          name: "LLM 기반 의료 AI",
          details: [
            "의료 텍스트 분석 및 요약",
            "진단 보조 시스템 개발",
            "의료 지식 그래프 구축"
          ]
        }
      ]
    },
    {
      id: 2,
      title: "고성능 컴퓨팅 인프라",
      icon: Cpu,
      color: "from-purple-600 to-pink-600",
      description: "GPU/CPU 클러스터 최적화, 작업 스케줄링, Container Orchestration",
      topics: [
        {
          name: "GPU/CPU 클러스터 최적화",
          details: [
            "병렬 처리 알고리즘 설계",
            "자원 활용률 최적화",
            "성능 벤치마킹 및 분석"
          ]
        },
        {
          name: "작업 스케줄링",
          details: [
            "분산 작업 스케줄링 시스템",
            "우선순위 기반 자원 할당",
            "실시간 모니터링 및 로깅"
          ]
        },
        {
          name: "Container Orchestration",
          details: [
            "Docker 기반 컨테이너화",
            "Kubernetes 클러스터 관리",
            "CI/CD 파이프라인 구축"
          ]
        }
      ]
    }
  ];

  const collaborations = [
    {
      category: "의료기관",
      icon: Cross,
      color: "bg-blue-50 text-blue-700",
      partners: [
        "고려대 구로병원",
        "가천대 길병원",
        "중앙대학교광명병원",
        "아주대학교병원",
        "경북대학교병원",
        "MGH/Harvard"
      ]
    },
    {
      category: "산업체",
      icon: Factory,
      color: "bg-purple-50 text-purple-700",
      partners: [
        "인피니트헬스케어",
        "태영소프트",
        "클라리파이",
        "유스바이오"
      ]
    },
    {
      category: "연구기관",
      icon: Building2,
      color: "bg-indigo-50 text-indigo-700",
      partners: [
        "KTL",
        "보건산업진흥원",
        "한국스마트헬스케어협회",
        "COSD-IEC"
      ]
    }
  ];

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
              <button onClick={() => navigate('/research')} className="text-blue-600 font-semibold">
                연구분야
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
            <h1 className="text-5xl font-bold mb-4">연구 분야</h1>
            <p className="text-xl text-blue-100">Research Areas</p>
          </motion.div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {researchAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white rounded-2xl shadow-xl p-8"
                >
                  {/* Area Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{area.title}</h2>
                      <p className="text-gray-600 mt-1">{area.description}</p>
                    </div>
                  </div>

                  {/* Topics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {area.topics.map((topic, topicIndex) => (
                      <div
                        key={topicIndex}
                        className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 hover:shadow-md transition"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{topic.name}</h3>
                        <ul className="space-y-2">
                          {topic.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              <span className="text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Research Methodology */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-8">
              <Microscope className="w-10 h-10 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">연구 방법론</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">1</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">문제 정의</h3>
                <p className="text-sm text-gray-600">실제 의료 현장의 문제를 파악하고 연구 목표를 설정</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">2</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">데이터 수집</h3>
                <p className="text-sm text-gray-600">협력 기관으로부터 의료 데이터 수집 및 전처리</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">알고리즘 개발</h3>
                <p className="text-sm text-gray-600">AI 모델 설계 및 고성능 컴퓨팅 환경에서 학습</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">4</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">검증 및 배포</h3>
                <p className="text-sm text-gray-600">임상 환경에서 성능 검증 및 실용화 추진</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collaboration Network */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-12">
              <Network className="w-10 h-10 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">연구 협력 네트워크</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collaborations.map((collab, index) => {
                const IconComponent = collab.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                  >
                    <div className={`w-16 h-16 rounded-2xl ${collab.color} flex items-center justify-center mb-4 mx-auto`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
                      {collab.category}
                    </h3>
                    <ul className="space-y-3">
                      {collab.partners.map((partner, pIndex) => (
                        <li key={pIndex} className="text-center">
                          <span className="inline-block px-4 py-2 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                            {partner}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
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
