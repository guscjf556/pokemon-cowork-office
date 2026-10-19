/// <reference path="./WA.d.ts" />

// WorkAdventure Scripting API - Pokemon Cowork Office
console.log("[Pokemon Cowork Office] Scripting API loaded!");

const POKEMON_SPRITES = {
    "pikachu": "characters/pikachu.png",
    "charmander": "characters/charmander.png",
    "squirtle": "characters/squirtle.png",
    "bulbasaur": "characters/bulbasaur.png",
    "eevee": "characters/eevee.png"
};

// 포켓몬 스프라이트 강제 교체 함수 (기존 인간 스프라이트 완전 제거)
function applyPokemonAvatar(pokemonId, pokemonName) {
    const spritePath = POKEMON_SPRITES[pokemonId] || POKEMON_SPRITES["pikachu"];
    const absoluteSpriteUrl = new URL(spritePath, window.location.href).href;

    console.log(`[Pokemon Office] Applying Pokemon: ${pokemonName || pokemonId} -> ${absoluteSpriteUrl}`);

    try {
        if (WA.player && typeof WA.player.setPlayerDetails === "function") {
            // WorkAdventure의 모든 인간 캐릭터 파츠 레이어를 제거하고 단일 포켓몬 스프라이트로 덮어쓰기
            WA.player.setPlayerDetails({
                characterLayers: [absoluteSpriteUrl]
            });
        }
        WA.chat.sendChatMessage(`⚡ [${pokemonName || pokemonId}] 아바타가 적용되었습니다!`, "포켓몬 오피스");
    } catch (err) {
        console.warn("setPlayerDetails failed:", err);
    }
}

// 1. 초기 입장 시 처리 (WA 초기화 완료 시)
WA.onInit().then(() => {
    // 저장된 포켓몬이 없으면 선택 모달 띄우기
    const saved = localStorage.getItem("myPokemon");
    if (!saved) {
        // 첫 접속 시 포켓몬 선택 팝업 오픈
        WA.nav.openCoWebSite("select_pokemon.html");
    } else {
        applyPokemonAvatar(saved);
    }
}).catch((e) => {
    console.warn("onInit hook error:", e);
});

// 2. 상단 메뉴 등록
try {
    WA.ui.registerMenuEntry("🐾 포켓몬 아바타 변경", () => {
        WA.nav.openCoWebSite("select_pokemon.html");
    });
    WA.ui.registerMenuEntry("⚡ 내 업무 대시보드", () => {
        WA.nav.openCoWebSite("dashboard/index.html");
    });
    WA.ui.registerMenuEntry("📋 오피스 업무 보고함", () => {
        WA.nav.openCoWebSite("report/index.html");
    });
} catch (e) {
    console.warn("registerMenuEntry error:", e);
}

// 3. iframe 메시지 수신 (포켓몬 선택 시 아바타 교체)
window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SET_POKEMON_AVATAR") {
        const pokeId = event.data.pokemon;
        const pokeName = event.data.name || pokeId;
        localStorage.setItem("myPokemon", pokeId);
        applyPokemonAvatar(pokeId, pokeName);

        if (event.data.closeModal) {
            try {
                WA.nav.closeCoWebSite();
            } catch(e) {}
        }
    }
});

// 4. 5인 멤버별 기본 프로필 및 구글 드라이브 정보
const OFFICE_MEMBERS = [
    {
        id: "desk_1",
        pokemon: "피카츄",
        role: "비서 / 총괄",
        name: "멤버 1",
        task: "메일/일정 확인 및 전체 업무 조율 중",
        driveUrl: "https://drive.google.com"
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

// 5. 5개 데스크 상호작용 등록
OFFICE_MEMBERS.forEach((member) => {
    let currentPopup = null;

    WA.room.onEnterZone(member.id, () => {
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

// 6. 중앙 회의존 안내
WA.room.onEnterZone("meeting_zone", () => {
    WA.chat.sendChatMessage(
        "🎙️ 중앙 브리핑룸에 입장했습니다. 5인 마이크 음성 대화가 활성화됩니다.",
        "오피스 안내"
    );
});

// 7. 연구 서재 안내
WA.room.onEnterZone("library_zone", () => {
    WA.ui.displayActionMessage({
        message: "[Space 키] 포켓몬 연구 서재 및 맥락 기록(_맥락.md) 열람",
        callback: () => {
            WA.nav.openCoWebSite("library/context.html");
        }
    });
});
