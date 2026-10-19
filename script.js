/// <reference path="./WA.d.ts" />

// WorkAdventure Scripting API - Modern Cowork Office
console.log("[Modern Cowork Office] Scripting API loaded!");

// 5인 팀원별 프로필 및 공유 구글 드라이브 정보
const OFFICE_MEMBERS = [
    {
        id: "desk_1",
        name: "팀장 / 총괄",
        task: "프로젝트 진행상황 점검 및 주간 일정 조율 중",
        driveUrl: "https://drive.google.com"
    },
    {
        id: "desk_2",
        name: "기획 / 제작",
        task: "2026 발표자료(PPT) 템플릿 제작 및 디자인 수정 중",
        driveUrl: "https://drive.google.com"
    },
    {
        id: "desk_3",
        name: "연구 / 분석",
        task: "최신 학술 논문 12편 핵심 요약 및 데이터 분석 중",
        driveUrl: "https://drive.google.com"
    },
    {
        id: "desk_4",
        name: "자료 / 아카이빙",
        task: "서재 맥락 기록(_맥락.md) 최신화 및 파일 분류 중",
        driveUrl: "https://drive.google.com"
    },
    {
        id: "desk_5",
        name: "상담 / 운영",
        task: "상담 포트폴리오 사례 비식별화 및 결과 정리 중",
        driveUrl: "https://drive.google.com"
    }
];

// 1. 상단 메뉴 등록
try {
    WA.ui.registerMenuEntry("💼 내 업무 대시보드", () => {
        WA.nav.openCoWebSite("dashboard/index.html");
    });
    WA.ui.registerMenuEntry("📋 오피스 업무 보고함", () => {
        WA.nav.openCoWebSite("report/index.html");
    });
} catch (e) {
    console.warn("registerMenuEntry error:", e);
}

// 2. 5개 데스크 상호작용 등록 (상대방 상태 확인 및 공유 구글 드라이브 열기)
OFFICE_MEMBERS.forEach((member) => {
    let currentPopup = null;

    WA.room.onEnterZone(member.id, () => {
        currentPopup = WA.ui.openPopup(
            member.id,
            `[${member.name}]\n현재 업무: "${member.task}"`,
            [
                {
                    label: "📁 공유 구글 드라이브 열기",
                    className: "primary",
                    callback: () => {
                        WA.nav.openCoWebSite(member.driveUrl);
                    }
                },
                {
                    label: "닫기",
                    className: "normal",
                    callback: () => {
                        if (currentPopup) currentPopup.close();
                    }
                }
            ]
        );

        WA.ui.displayActionMessage({
            message: `[Space 키] ${member.name}의 공유 구글 드라이브 열기`,
            callback: () => {
                WA.nav.openCoWebSite(member.driveUrl);
            }
        });
    });

    WA.room.onLeaveZone(member.id, () => {
        if (currentPopup) {
            currentPopup.close();
            currentPopup = null;
        }
    });
});

// 3. 중앙 회의존 (5인 WebRTC 음성 통화 구역)
WA.room.onEnterZone("meeting_zone", () => {
    WA.chat.sendChatMessage(
        "🎙️ 중앙 회의실에 입장했습니다. 5인 음성 대화가 활성화됩니다.",
        "오피스 안내"
    );
});

// 4. 오피스 자료실 (서재 & _맥락.md)
WA.room.onEnterZone("library_zone", () => {
    WA.ui.displayActionMessage({
        message: "[Space 키] 오피스 자료실 및 맥락 기록(_맥락.md) 열람",
        callback: () => {
            WA.nav.openCoWebSite("library/context.html");
        }
    });
});
