package com.lab.management.config;

import com.lab.management.entity.Notice;
import com.lab.management.entity.Researcher;
import com.lab.management.entity.ResearcherStatus;
import com.lab.management.entity.User;
import com.lab.management.entity.Grade;
import com.lab.management.repository.NoticeRepository;
import com.lab.management.repository.ResearcherRepository;
import com.lab.management.repository.UserRepository;
import com.lab.management.service.ResearchAreaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ResearchAreaService researchAreaService;
    private final UserRepository userRepository;
    private final ResearcherRepository researcherRepository;
    private final NoticeRepository noticeRepository;

    @Override
    public void run(String... args) {
        initializeResearchAreas();
        initializeAdminProfile();
        initializeNotices();
    }

    private void initializeResearchAreas() {
        String[] defaultAreas = {
                "Medical_AI",
                "Deep_Learning",
                "CT_Physics",
                "Computer_Vision",
                "LLM",
                "Backend",
                "Data_Analysis"
        };

        for (String area : defaultAreas) {
            try {
                researchAreaService.createResearchArea(area, null);
                log.info("Created research area: {}", area);
            } catch (IllegalArgumentException e) {
                // Area already exists, skip
                log.debug("Research area already exists: {}", area);
            }
        }
    }

    private void initializeAdminProfile() {
        try {
            // Find admin user by username
            User adminUser = userRepository.findByUsername("admin").orElse(null);

            if (adminUser == null) {
                log.debug("Admin user not found, skipping profile creation");
                return;
            }

            // Check if admin already has a researcher profile
            if (adminUser.getResearcher() != null) {
                log.debug("Admin already has a researcher profile");
                return;
            }

            // Create researcher profile for admin
            Researcher adminResearcher = Researcher.builder()
                    .name("시스템 관리자")
                    .studentId("ADMIN001")
                    .grade(Grade.GRADUATE)
                    .admissionYear(LocalDate.now().getYear())
                    .email("yangzepa@sch.ac.kr")
                    .status(ResearcherStatus.ACTIVE)
                    .joinDate(LocalDate.now())
                    .build();

            Researcher savedResearcher = researcherRepository.save(adminResearcher);

            // Link researcher to admin user
            adminUser.setResearcher(savedResearcher);
            userRepository.save(adminUser);

            log.info("Created researcher profile for admin user: {}", savedResearcher.getName());
        } catch (Exception e) {
            log.error("Failed to initialize admin profile", e);
        }
    }

    private void initializeNotices() {
        // 공지사항이 이미 있으면 초기화하지 않음
        if (noticeRepository.count() > 0) {
            log.info("Notices already exist. Skipping initialization.");
            return;
        }

        log.info("Initializing sample notices...");

        // 관리자 연구원 찾기 (admin 계정과 연결된 연구원)
        Researcher adminResearcher = researcherRepository.findByEmail("yangzepa@sch.ac.kr")
                .orElse(null);

        if (adminResearcher == null) {
            log.warn("Admin researcher not found. Skipping notice initialization.");
            return;
        }

        // 공지사항 1: 2025년 1학기 세미나 일정 안내
        Notice notice1 = new Notice();
        notice1.setTitle("2025년 1학기 세미나 일정 안내");
        notice1.setContent("안녕하세요, 연구실 구성원 여러분.\n\n" +
                "2025년 1학기 세미나 일정을 다음과 같이 안내드립니다.\n\n" +
                "📅 일시: 매주 금요일 오후 2시\n" +
                "📍 장소: 공학관 5층 세미나실\n\n" +
                "주요 내용:\n" +
                "- 연구 진행 상황 발표\n" +
                "- 최신 논문 리뷰\n" +
                "- 프로젝트 진행 사항 공유\n\n" +
                "모든 연구원분들의 적극적인 참여 부탁드립니다.");
        notice1.setIsPublic(true);
        notice1.setAuthor(adminResearcher);

        // 공지사항 2: CT Dose 프로젝트 중간 발표회
        Notice notice2 = new Notice();
        notice2.setTitle("CT Dose 계산 프로젝트 중간 발표회");
        notice2.setContent("CT Dose 계산 프로젝트 중간 발표회를 다음과 같이 진행합니다.\n\n" +
                "📅 일시: 2025년 1월 15일 (수) 오후 3시\n" +
                "📍 장소: 대회의실\n" +
                "👥 발표자: 박평진, 최태성\n\n" +
                "발표 내용:\n" +
                "1. 프로젝트 진행 현황 (40%)\n" +
                "2. CT 영상 분석 알고리즘 개발 결과\n" +
                "3. 방사선량 계산 모델 검증\n" +
                "4. 향후 계획 및 일정\n\n" +
                "관심 있는 연구원분들의 많은 참석 바랍니다.");
        notice2.setIsPublic(true);
        notice2.setAuthor(adminResearcher);

        // 공지사항 3: 연구실 환경 개선 프로젝트
        Notice notice3 = new Notice();
        notice3.setTitle("연구실 환경 개선 프로젝트 진행 안내");
        notice3.setContent("'연구실을 연구실답게' 프로젝트가 시작되었습니다.\n\n" +
                "🎯 목표: 연구원들이 쾌적하게 연구할 수 있는 환경 조성\n\n" +
                "개선 사항:\n" +
                "✅ 책상 및 의자 교체\n" +
                "✅ 수납 공간 확충\n" +
                "✅ 조명 개선\n" +
                "✅ 공기청정기 설치\n\n" +
                "👥 담당: 강민선, 김규린\n" +
                "📅 완료 예정: 2025년 12월\n\n" +
                "추가 의견이나 건의사항이 있으시면 언제든지 말씀해 주세요!");
        notice3.setIsPublic(true);
        notice3.setAuthor(adminResearcher);

        // 공지사항 4: Medical AI 워크샵 참가 안내
        Notice notice4 = new Notice();
        notice4.setTitle("Medical AI 국제 워크샵 참가 안내");
        notice4.setContent("Medical AI 분야 국제 워크샵 참가 기회를 안내드립니다.\n\n" +
                "🌏 행사명: International Workshop on Medical AI 2025\n" +
                "📅 일시: 2025년 2월 20일 - 22일\n" +
                "📍 장소: 서울 코엑스\n\n" +
                "주요 세션:\n" +
                "- Deep Learning for Medical Imaging\n" +
                "- Computer Vision in Healthcare\n" +
                "- Large Language Models in Medicine\n" +
                "- CT Image Analysis and Dose Calculation\n\n" +
                "참가 희망자는 1월 10일까지 신청 바랍니다.\n" +
                "등록비는 연구실에서 지원합니다.");
        notice4.setIsPublic(true);
        notice4.setAuthor(adminResearcher);

        // 공지사항 5: 논문 투고 현황 및 목표
        Notice notice5 = new Notice();
        notice5.setTitle("2025년 상반기 논문 투고 현황 및 목표");
        notice5.setContent("2025년 상반기 논문 투고 계획을 공유합니다.\n\n" +
                "📊 현재 진행 상황:\n" +
                "- SCI 논문 2편 작성 중\n" +
                "- 국내 학술대회 발표 3건 준비\n\n" +
                "🎯 목표:\n" +
                "- SCI 논문 3편 투고\n" +
                "- 국제 학술대회 2건 발표\n" +
                "- 국내 학술대회 5건 발표\n\n" +
                "주요 연구 주제:\n" +
                "1. CT Dose Calculation using Deep Learning\n" +
                "2. Medical Image Segmentation\n" +
                "3. Large Language Models for Medical Diagnosis\n\n" +
                "논문 작성에 관한 질문이나 도움이 필요하신 분들은 언제든지 연락주세요.");
        notice5.setIsPublic(false);
        notice5.setAuthor(adminResearcher);

        // 공지사항 6: 신규 장비 도입 안내
        Notice notice6 = new Notice();
        notice6.setTitle("고성능 워크스테이션 도입 안내");
        notice6.setContent("연구 효율성 향상을 위해 고성능 워크스테이션을 도입했습니다.\n\n" +
                "💻 사양:\n" +
                "- CPU: AMD Ryzen Threadripper 3990X (64코어)\n" +
                "- GPU: NVIDIA RTX 4090 x 2\n" +
                "- RAM: 256GB DDR4\n" +
                "- Storage: 4TB NVMe SSD + 16TB HDD\n\n" +
                "📍 위치: 연구실 중앙 서버실\n\n" +
                "사용 용도:\n" +
                "- Deep Learning 모델 학습\n" +
                "- 대용량 의료 영상 데이터 처리\n" +
                "- CT 시뮬레이션 및 분석\n\n" +
                "사용을 원하시는 분들은 사용 일정을 공유 캘린더에 등록해 주세요.");
        notice6.setIsPublic(true);
        notice6.setAuthor(adminResearcher);

        // 공지사항 7: 방학 중 연구실 운영 안내
        Notice notice7 = new Notice();
        notice7.setTitle("겨울방학 연구실 운영 안내");
        notice7.setContent("겨울방학 기간 동안 연구실 운영 방침을 안내드립니다.\n\n" +
                "📅 기간: 2024년 12월 23일 - 2025년 2월 28일\n\n" +
                "운영 방침:\n" +
                "1. 연구실 출입: 평일 09:00 - 18:00\n" +
                "2. 주말 및 공휴일: 사전 신고 후 출입 가능\n" +
                "3. 세미나: 2주에 1회 (격주 금요일)\n" +
                "4. 미팅: 온라인 중심으로 진행\n\n" +
                "⚠️ 주의사항:\n" +
                "- 퇴실 시 반드시 전원 및 냉난방 확인\n" +
                "- 마지막 퇴실자는 문단속 확인\n" +
                "- 장비 사용 후 정리정돈 필수\n\n" +
                "긴급 상황 발생 시 연락처: 010-XXXX-XXXX");
        notice7.setIsPublic(false);
        notice7.setAuthor(adminResearcher);

        // 데이터베이스에 저장
        noticeRepository.save(notice1);
        noticeRepository.save(notice2);
        noticeRepository.save(notice3);
        noticeRepository.save(notice4);
        noticeRepository.save(notice5);
        noticeRepository.save(notice6);
        noticeRepository.save(notice7);

        log.info("Successfully initialized {} sample notices", 7);
    }
}
