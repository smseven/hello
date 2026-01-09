# WebRTC Canvas Collab

WebRTC 기반의 실시간 화상 회의 및 협업 드로잉 애플리케이션입니다.

## 🚀 완료된 기능 목록 (Completed Features)

### 1. 실시간 영상/음성 통화 (Real-time Video/Audio)
- **WebRTC 기반 1:N 통화**: `simple-peer`를 사용하여 Mesh 네트워크 구조로 참여자 간 직접 연결.
- **미디어 제어**:
  - 마이크 음소거/해제 (Mute/Unmute)
  - 카메라 끄기/켜기 (Stop/Start Video)
- **자신 및 상대방 화면 표시**: 로컬 비디오와 원격 피어 비디오를 그리드 형태로 표시.

### 2. 공동 캔버스 (Collaborative Canvas)
- **실시간 드로잉 동기화**:
  - **WebRTC DataChannel**을 사용하여 저지연(Low-latency) 드로잉 데이터 전송.
  - 마우스 및 터치 이벤트를 지원하여 PC와 모바일 모두에서 사용 가능.
- **드로잉 도구**:
  - 색상 선택 (Color Picker)
  - 캔버스 초기화 (Clear)
- **이미지 저장**: 작성한 캔버스를 이미지 파일(PNG)로 다운로드.

### 3. 실시간 텍스트 채팅 & 파일 공유 (Chat & File Sharing)
- **텍스트 채팅**: `Socket.io`를 이용한 실시간 메시지 전송.
- **이미지 파일 공유**:
  - 채팅창에서 이미지 파일(jpg, png 등) 업로드 및 전송.
  - Base64 인코딩을 통해 전송 (최대 2MB 제한).
  - 채팅창 내 이미지 미리보기.

### 4. 반응형 UI & 모바일 지원
- **Tailwind CSS**를 활용한 반응형 레이아웃.
- 모바일 환경에서의 터치 드로잉 지원.

---

## 🛠 기술 스택 (Tech Stack)

- **Frontend**: React, TypeScript, Vite, TailwindCSS, simple-peer
- **Backend**: Node.js, Express, Socket.io
- **Deployment/Ops**: (Localhost Development Environment configured)

## 🏃‍♂️ 실행 방법 (How to Run)

### 사전 요구사항
- Node.js (v18+)
- npm

### 설치 및 실행

1. **저장소 클론 및 의존성 설치**
   ```bash
   # Root 경로에서
   npm install # (Optional, if root package.json exists)

   # Server 설정
   cd server
   npm install

   # Client 설정
   cd ../client
   npm install
   ```

2. **서버 실행**
   ```bash
   cd server
   npm run dev
   # Port: 5000
   ```

3. **클라이언트 실행**
   ```bash
   cd client
   npm run dev
   # Port: 5173 or 5174
   ```

4. **접속**
   - 브라우저에서 클라이언트 URL(예: `http://localhost:5173`)로 접속.
   - 방 이름(Room ID)을 입력하고 "Join Room" 버튼 클릭.
   - 다른 탭이나 기기에서 같은 방 이름으로 접속하여 테스트.
