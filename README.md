# NFT 복권 서비스 프론트엔드 기획서

## 주요 페이지 정의

1. **메인 페이지**: 지갑 연결 및 복권 구매

## 사용자 흐름

1. 메인 페이지
   - 사용자가 지갑 연결 버튼을 클릭
   - 지갑 연결이 완료되면 티켓 구매 버튼으로 변경
   - 사용자가 티켓 구매 버튼을 클릭
   - 버튼이 로딩 버튼으로 변경되며 MetaMask 결제 창이 열림
   - 결제가 완료되고 트랜잭션이 종료되면 모달 창에 구매한 NFT가 표시됨
   - 모달 창에는 "당첨" 또는 "미당첨" 결과가 표시됨

## UI 디자인

### 메인 페이지

---

| 로고 서비스 제목              |
| ----------------------------- |
| 지갑 연결 버튼                |
| ----------------------------- |
| 티켓 구매 버튼                |
| ----------------------------- |
| 로딩 버튼                     |
| ----------------------------- |
| 당첨/미당첨 결과 모달 창      |

---

## 기술 스택

- TypeScript
- React
- Redux
- Tailwind CSS
- Chakra UI
- Vite
- ethers.js

## 스마트 계약 통합

이 서비스에 사용되는 스마트 계약은 ERC1155 표준을 구현하며, 티켓 구매, 당첨자 결정 및 결제 처리를 위한 로직이 포함된 `Lottery.sol`입니다.

## 기능 구현

### 1. 프로젝트 설정 및 초기 구조

- **Vite**를 사용하여 프로젝트를 생성하고 설정합니다.
- **TypeScript**를 사용하여 타입 안전성을 확보합니다.
- **Tailwind CSS**와 **Chakra UI**를 사용하여 스타일링을 합니다.
- **Redux**를 사용하여 상태 관리를 합니다.

### 2. 지갑 연결 기능

- **ethers.js**를 사용하여 MetaMask 지갑을 연결합니다.
- 사용자가 지갑 연결 버튼을 클릭하면 MetaMask 지갑 연결을 시도합니다.
- 지갑 연결이 성공하면 Redux 상태를 업데이트하여 연결 상태를 저장합니다.
- 지갑 연결 성공 후 지갑 연결 버튼을 티켓 구매 버튼으로 변경합니다.

### 3. 티켓 구매 기능

- 사용자가 티켓 구매 버튼을 클릭하면 MetaMask 결제 창이 열립니다.
- **ethers.js**를 사용하여 결제 트랜잭션을 생성하고 스마트 계약의 `purchaseTicket` 함수를 호출합니다.
- 결제 진행 중에는 로딩 버튼을 표시하여 사용자에게 결제가 진행 중임을 알립니다.
- 결제에는 티켓 가격과 2.3% 수수료가 포함되도록 합니다.
- 결제가 완료되면 트랜잭션을 확인하고 Redux 상태를 업데이트합니다.
- `TicketPurchased` 이벤트를 발생시키고 이를 수신하여 UI를 업데이트합니다.
- 트랜잭션이 성공적으로 완료되면 모달 창에 구매한 NFT를 표시합니다.

### 4. 결과 모달 창

- 결제가 완료되고 트랜잭션이 완료되면 모달 창에 구매한 NFT를 표시합니다.
- **Chakra UI** 컴포넌트를 사용하여 모달 창을 구현합니다.
- 모달 창에는 트랜잭션 결과에 따라 "당첨" 또는 "미당첨"이 표시됩니다.
- "당첨" 결과일 경우 추가 결제 처리를 통해 상금을 분배할 수 있습니다.

### 5. 상태 관리

- **Redux**를 사용하여 지갑 연결 상태, 결제 상태, 트랜잭션 결과 등을 관리합니다.
- 각 상태 변경에 따라 UI 컴포넌트가 적절히 업데이트되도록 설정합니다.

### 6. 스타일링

- **Tailwind CSS**를 사용하여 빠르고 효율적인 스타일링을 적용합니다.
- **Chakra UI** 컴포넌트를 사용하여 모달 창 및 버튼 등의 UI 컴포넌트를 스타일링합니다.

### 7. 최종 통합 및 테스트

- 모든 기능을 통합하여 전체 흐름이 원활하게 작동하는지 테스트합니다.
- 각 기능에 대한 유닛 테스트와 통합 테스트를 진행하여 버그를 수정합니다.

## 스마트 계약 세부 사항

`Lottery.sol` 스마트 계약은 다음과 같은 주요 기능을 포함합니다:

- 복권 티켓을 위한 ERC1155 토큰 구현
- 티켓 구매 및 당첨자 결정을 위한 함수
- 프론트엔드에 티켓 구매를 알리기 위한 `TicketPurchased` 이벤트
- 결제 및 상금 분배를 처리하는 로직, 포함된 2.3% 수수료 및 두 배 상금 지급
- 난수 생성 및 티켓 ID 할당을 위한 유틸리티 함수

---

모든 기능은 `App.tsx` 내에서 구현되며, 여러 컴포넌트로 분리하지 않습니다. 스마트 계약 `Lottery.sol`과의 통합은 `ethers.js`를 사용하여 지갑 연결, 트랜잭션, 이벤트 수신을 용이하게 처리합니다.
