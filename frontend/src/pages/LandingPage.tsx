import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink, Users, Briefcase, GraduationCap, Megaphone, Cpu, Brain, Microscope, Network, Building2, Cross, Factory } from 'lucide-react';
import { publicApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import type { Notice } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatGrade } from '@/utils/format';

export default function LandingPage() {
  const [labInfo, setLabInfo] = useState<any>(null);
  const [researchers, setResearchers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lab, researchersList, projectsList, noticesList] = await Promise.all([
        publicApi.getLabInfo(),
        publicApi.getResearchers(),
        publicApi.getProjects(),
        publicApi.getNotices(3),
      ]);

      setLabInfo(lab);
      setResearchers(researchersList);
      setProjects(projectsList);
      setNotices(noticesList);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  if (!labInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
        "고려대학교 구로병원",
        "가천대학교 길병원",
        "중앙대학교 광명병원",
        "아주대학교병원",
        "경북대학교병원",
        "MGH/Harvard Medical School"
      ]
    },
    {
      category: "관계산업체",
      icon: Factory,
      color: "bg-purple-50 text-purple-700",
      partners: [
        "인피니트헬스케어(주)",
        "태영소프트(주)",
        "클라리파이(주)",
        "유스바이오(주)",
        "뷰노(주)",
        "루닛(주)",
        "코어라인소프트(주)",
        "메디올로지(주)",
        "메디컬아이피(주)",
        "프로메디우스(주)",
        "JLK(주)",
        "제노레이(주)",
        "블루비커(주)",
        "지오비전(주)",
        "성민네트웍스(주)",
        "디케이메디컬솔루션즈(주)",
        "에비드넷(주)",
        "메디사피엔스(주)",
        "펜타텍(주)",
        "캐논메디컬시스템즈코리아(주)"
      ]
    },
    {
      category: "연구기관",
      icon: Building2,
      color: "bg-indigo-50 text-indigo-700",
      partners: [
        "한국산업기술시험원(KTL)",
        "한국보건산업진흥원",
        "한국스마트헬스케어협회",
        "IEC COSD(의료기기 표준화 기구)"
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
              <h1 className="text-xl font-bold text-gray-900">{labInfo.name}</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => navigate('/professor')} className="text-gray-700 hover:text-blue-600 font-medium transition">
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
            <div className="md:hidden">
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
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-6">
              Efficient Computing Lab
            </h1>
            <h2 className="text-3xl font-semibold mb-4 text-blue-100">
              효율컴퓨팅 연구실
            </h2>
            <p className="text-xl mb-6 text-blue-50">
              순천향대학교 컴퓨터공학과
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl mx-auto">
              <p className="text-2xl font-medium mb-3">
                "효율을 최우선으로, 일이든 삶이든"
              </p>
              <p className="text-lg text-blue-50">
                제한된 자원으로 최대의 성능을 이끌어내고, 효율적인 컴퓨팅 환경을 구축하여<br/>
                정확하지만 간단한 방법으로 문제를 해결합니다.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-8">
              <Megaphone className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-3xl font-bold text-gray-900">공지사항</h3>
            </div>
            {notices.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
                등록된 공지사항이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notices.map((notice, index) => (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
                  >
                    {notice.imageUrl ? (
                      <>
                        <div className="aspect-video w-full overflow-hidden bg-gray-100">
                          <img
                            src={notice.imageUrl}
                            alt={notice.title}
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {notice.title}
                          </h4>
                          <div className="prose prose-sm max-w-none text-gray-600 text-sm line-clamp-3 mb-3">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1" {...props} />,
                                li: ({node, ...props}) => <li className="ml-2" {...props} />,
                                code: ({node, inline, ...props}: any) =>
                                  inline ?
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs" {...props} /> :
                                    <code className="block bg-gray-100 p-2 rounded my-2 overflow-x-auto text-xs" {...props} />,
                              }}
                            >
                              {notice.content}
                            </ReactMarkdown>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                          {notice.title}
                        </h4>
                        <div className="prose prose-sm max-w-none text-gray-600 text-sm mb-4 line-clamp-6">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="ml-2" {...props} />,
                              code: ({node, inline, ...props}: any) =>
                                inline ?
                                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs" {...props} /> :
                                  <code className="block bg-gray-100 p-2 rounded my-2 overflow-x-auto text-xs" {...props} />,
                            }}
                          >
                            {notice.content}
                          </ReactMarkdown>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
              주요 연구 분야
            </h3>

            <div className="space-y-8">
              {researchAreas.map((area, index) => {
                const IconComponent = area.icon;
                return (
                  <motion.div
                    key={area.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    {/* Area Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{area.title}</h2>
                        <p className="text-gray-600 text-sm">{area.description}</p>
                      </div>
                    </div>

                    {/* Topics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {area.topics.map((topic, topicIndex) => (
                        <div
                          key={topicIndex}
                          className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4"
                        >
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{topic.name}</h3>
                          <ul className="space-y-1">
                            {topic.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-start text-sm">
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
          </motion.div>
        </div>
      </section>

      {/* Research Methodology */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Microscope className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">연구 방법론</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">1</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">문제 정의</h3>
                <p className="text-xs text-gray-600">실제 의료 현장의 문제를 파악하고 연구 목표를 설정</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">2</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">데이터 수집</h3>
                <p className="text-xs text-gray-600">협력 기관으로부터 의료 데이터 수집 및 전처리</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">3</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">알고리즘 개발</h3>
                <p className="text-xs text-gray-600">AI 모델 설계 및 고성능 컴퓨팅 환경에서 학습</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-pink-600 mb-1">4</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">검증 및 배포</h3>
                <p className="text-xs text-gray-600">임상 환경에서 성능 검증 및 실용화 추진</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collaboration Network */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-8">
              <Network className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">연구 협력 네트워크</h2>
            </div>

            <div className="space-y-6">
              {collaborations.map((collab, index) => {
                const IconComponent = collab.icon;
                const isIndustrial = collab.category === "관계산업체";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-xl ${collab.color} flex items-center justify-center mr-3`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {collab.category}
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          ({collab.partners.length})
                        </span>
                      </h3>
                    </div>

                    {isIndustrial ? (
                      // 관계산업체: 가로로 여러 개 배치 (더 조밀한 레이아웃)
                      <div className="flex flex-wrap gap-2">
                        {collab.partners.map((partner, pIndex) => (
                          <span
                            key={pIndex}
                            className="inline-block px-3 py-1.5 bg-gray-50 rounded-lg text-xs text-gray-700 hover:bg-gray-100 hover:shadow-sm transition"
                          >
                            {partner}
                          </span>
                        ))}
                      </div>
                    ) : (
                      // 의료기관, 연구기관: 기존 레이아웃 (세로로 배치, 더 큰 텍스트)
                      <div className="flex flex-wrap gap-2">
                        {collab.partners.map((partner, pIndex) => (
                          <span
                            key={pIndex}
                            className="inline-block px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:shadow-sm transition"
                          >
                            {partner}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-12">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-4xl font-bold text-gray-900">구성원</h3>
            </div>

            {/* Professor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 border-2 border-blue-200"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold flex-shrink-0">
                  양
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-3xl font-bold text-gray-900 mb-2">양제파 교수</h4>
                  <p className="text-xl text-blue-600 font-semibold mb-4">지도교수 | Lab Director</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                    <div className="flex items-center justify-center md:justify-start">
                      <Mail className="w-5 h-5 mr-2 text-blue-600" />
                      <a href="mailto:yangzepa@gmail.com" className="hover:text-blue-600">
                        yangzepa@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <Phone className="w-5 h-5 mr-2 text-blue-600" />
                      <span>041-530-1319</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      <span>M605호 (멀티미디어동 6층)</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
                      <a
                        href="https://scholar.google.com/citations?user=8mIacDwAAAAJ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        Google Scholar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Researchers */}
            <h4 className="text-2xl font-bold text-gray-900 mb-6">연구원</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchers.map((researcher, index) => (
                <motion.div
                  key={researcher.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {researcher.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-lg text-gray-900 mb-1">
                        {researcher.name}
                      </h5>
                      <p className="text-sm text-gray-600 mb-2">{formatGrade(researcher.grade)}</p>
                      <div className="flex flex-wrap gap-1">
                        {researcher.researchAreas?.slice(0, 3).map((area: string) => (
                          <span
                            key={area}
                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-12">
              <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-3xl font-bold text-gray-900">Projects</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.filter(p => p.isPublic).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-xl text-gray-900">{project.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {project.categories?.map((cat: string) => (
                        <span
                          key={cat}
                          className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{project.progress}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact & Join Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-bold mb-4">Contact & 참여안내</h3>
            <p className="text-xl text-blue-100">함께 연구할 열정적인 학생들을 기다립니다!</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <h4 className="text-2xl font-bold mb-6">연락처 정보</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium mb-1">이메일</p>
                    <a href="mailto:yangzepa@gmail.com" className="text-blue-100 hover:text-white">
                      yangzepa@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium mb-1">전화</p>
                    <p className="text-blue-100">041-530-1319</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium mb-1">위치</p>
                    <p className="text-blue-100">
                      충청남도 아산시 신창면 순천향로 22<br/>
                      멀티미디어동 M605호 (6층)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recruitment Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <h4 className="text-2xl font-bold mb-6">참여 방법</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold mb-2">학부 연구생</h5>
                  <ul className="text-sm text-blue-100 space-y-1">
                    <li>• 프로그래밍 기초 지식</li>
                    <li>• 연구 프로젝트 참여 기회</li>
                    <li>• 멘토링 및 포트폴리오 구축</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">대학원생 (석/박사)</h5>
                  <ul className="text-sm text-blue-100 space-y-1">
                    <li>• 등록금 전액 지원</li>
                    <li>• 연구장학금 지급</li>
                    <li>• 학회 참가 및 해외 연수 기회</li>
                  </ul>
                </div>
                <div className="pt-4">
                  <a
                    href="mailto:yangzepa@gmail.com?subject=연구실 참여 문의"
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    지원하기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Efficient Computing Lab</h4>
              <p className="text-sm">효율컴퓨팅 연구실</p>
              <p className="text-sm">순천향대학교 컴퓨터공학과</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.sch.ac.kr" target="_blank" rel="noopener noreferrer" className="hover:text-white">순천향대학교</a></li>
                <li><a href="https://cs.sch.ac.kr" target="_blank" rel="noopener noreferrer" className="hover:text-white">컴퓨터공학과</a></li>
                <li><a href="https://scholar.google.com/citations?user=8mIacDwAAAAJ" target="_blank" rel="noopener noreferrer" className="hover:text-white">Google Scholar</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>yangzepa@gmail.com</li>
                <li>041-530-1319</li>
                <li>M605호 (멀티미디어동 6층)</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Efficient Computing Lab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
