/// <reference path="./WA.d.ts" />

// WorkAdventure Scripting API - Pokemon Cowork Office

console.log("[Pokemon Cowork Office] Scripting API loaded!");

// 5인 멤버별 기본 프로필 및 구글 드라이브 정보
const OFFICE_MEMBERS = [
    {
        id: "desk_1",
        pokemon: "피카츄",
        role: "비서 / 총괄",
        name: "멤버 1",
        task: "메일/일정 확인 및 전체 업무 조율 중",
        driveUrl: "https://drive.google.com" // 실제 팀원 구글 드라이브 폴더 링크로 교체 가능
    },
    {
        id: "desk_2",
        pokemon: "파이리",
        role: "제작자",
        name: "멤버 2",
        task: "2026 학회 발표 PPT 제작 및 디자인 수정 중",
        driveUrl: "https://drive.google.com"
    },
    {
        id: "desk_3",
        pokemon: "꼬부기",
        role: "연구원",
        name: "멤버 3",
        task: "중독 관련 최신 논문 12편 검색 및 요약 정리 중",
        driveUrl: "https://drive.google.com"
    },
    {
        id: "desk_4",
        pokemon: "이상해씨",
        role: "사서 / 아카이빙",
        name: "멤버 4",
        task: "서재 맥락 기록(_맥락.md) 최신화 및 자료 분류 중",
        driveUrl: "https://drive.google.com"
    },
    {
        id: "desk_5",
        pokemon: "이브이",
        role: "상담 / 교육",
        name: "멤버 5",
        task: "상담 포트폴리오 사례 비식별화 정리 중",
        driveUrl: "https://drive.google.com"
    }
];

// 1. 상단 메뉴에 '내 업무 대시보드' 및 '오피스 보고함' 등록
try {
    WA.ui.registerMenuEntry("⚡ 내 업무 대시보드", () => {
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
        // 머리 위 팝업: 상대방의 현재 진행 업무 표시
        currentPopup = WA.ui.openPopup(
            member.id,
            `[${member.pokemon}] ${member.name} (${member.role})\n현재 작업: "${member.task}"`,
            [
                {
                    label: "📁 공유 드라이브 열기",
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

        // 하단 액션 메시지 안내
        WA.ui.displayActionMessage({
            message: `[Space 키] ${member.name}(${member.pokemon})의 공유 드라이브 열기`,
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

// 3. 중앙 회의존 (음성 대화 집중 구역)
WA.room.onEnterZone("meeting_zone", () => {
    WA.chat.sendChatMessage(
        "🎙️ 중앙 브리핑룸에 입장했습니다. 5인 마이크 음성 대화가 활성화됩니다.",
        "오피스 안내"
    );
});

// 4. 연구 서재 (자료실 & _맥락.md)
WA.room.onEnterZone("library_zone", () => {
    WA.ui.displayActionMessage({
        message: "[Space 키] 포켓몬 연구 서재 및 맥락 기록(_맥락.md) 열람",
        callback: () => {
            WA.nav.openCoWebSite("library/context.html");
        }
    });
});

