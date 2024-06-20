// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

//deployed at "0xaEEef264DDbf9D6CC4737B1AbD954DC7DE9C1F1c"


contract LotteryNFT is ERC1155, Ownable {
    using Strings for uint; //이거 말고 Strings.toString(value) 이렇게 써도 됨. // uint와 uint256은 같다.
    
    string public name; // 토큰 이름
    string public symbol; // 토큰 심볼

    uint public ticketPrice; // 티켓 가격(wei단위임. ETH단위로 했을 때 소수점 찍는 방법을 잘 모르겠음 ㅜㅜ)
    // uint public totalTickets; // 총 발행량
    // uint public issuedTickets; // 현재 발행된 티켓 수
    uint private constant MAX_TOKENS = 8; // 7 미당첨 + 1 당첨
    uint private constant WINNING_TOKEN_ID = 7; // 당첨 티켓 ID
    uint private constant PRIZE_MULTIPLIER = 2; // 당첨금은 티켓 가격의 두 배!
    uint private constant FEE_RATE_BY_1000 = 23; // 2.3% 수수료 (1,000 단위로 계산하게 했음)

    // struct Ticket {
    //         uint tokenId;
    //         bool isWinner;
    //     }
        
    // mapping(address => Ticket) public tickets; // 프론트에서 address 호출해서 tokenID랑 isWinner 불러오는 용도로 매핑

    event TicketPurchased(address indexed buyer, uint indexed tokenId, bool isWinner); // 매핑 대신에 event를 사용함 // bool은 indexed 쓸 수가 없다고 함 // 뒤의 emit과 이어짐

    constructor(
        string memory _name, // 토큰 이름 - name에 저장되기 위해 배포할 떄 잠깐 받기 떄문에 _언더스코어를 붙이고 memory 사용
        string memory _symbol, // 토큰 심볼 - symbol에 저장되기 위해 배포할 떄 잠깐 받기 떄문에 _언더스코어를 붙이고 memory 사용
        uint _ticketPrice // 티켓 가격 - ticketPrice에 저장되기 위해 배포할 떄 잠깐 받기 떄문에 _언더스코어를 붙이고 memory 사용!
        // uint _totalTickets // 총 발행량 - 총 발행량 설정하려면 사용하기. 그냥 주석처리했음.
    ) 
        ERC1155("") // 초기 URI는 빈 문자열로 설정
        Ownable(msg.sender) 
    {
        name = _name;
        symbol = _symbol;
        ticketPrice = _ticketPrice;
        // totalTickets = _totalTickets; 총 발행량 - 총 발행량 설정하려면 사용하기. 그냥 주석처리했음.
    }

    function purchaseTicket() public payable {
        uint fee = (ticketPrice * FEE_RATE_BY_1000) / 1000; // 2.3% 수수료 계산
        uint netTicketPrice = ticketPrice + fee;
        require(msg.value >= netTicketPrice, "Incorrect ticket price including fee");
       // require(issuedTickets < totalTickets, "All tickets sold out"); - 총 발행량까지 찼는지 확인하는 코드.

        uint tokenId = determineOutcome();
        _mint(msg.sender, tokenId, 1, "");
        // issuedTickets += 1;

        bool isWinner = (tokenId == WINNING_TOKEN_ID);
        // tickets[msg.sender] = Ticket(tokenId, isWinner); // 앞의 매핑과 이어짐
        emit TicketPurchased(msg.sender, tokenId, isWinner); // 가스 아끼기 위해 event-emit 사용함. 나중에 프론트에서 불러오기 쉽다고 들어서. // 매핑은 여러 사람이 동시에 트랜잭션을 일으킬 때 덮어쓰기 등 문제가 발생할 수 있다고 함.

        // 수수료를 계약 소유자에게 전송
        payable(owner()).transfer(fee);
        
        if (isWinner) {
            uint prize = ticketPrice * PRIZE_MULTIPLIER;
            require(address(this).balance >= prize, "Not enough balance for the prize. Please contact support on Discord."); // address(this).balance = 스마트 계약의 현재 이더리움 잔액
            payable(msg.sender).transfer(prize);
        }
    }

    function random() private view returns (uint) {
        address Binance15_balance = 0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549; // 바이낸스15 지갑 밸런스를 난수로 활용
        address Binance16_balance = 0xDFd5293D8e347dFe59E90eFd55b2956a1343963d; // 바이낸스16 지갑 밸런스를 난수로 활용
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender, Binance15_balance.balance, Binance16_balance.balance, address(this).balance)));
    }

    function determineOutcome() private view returns (uint) {
        uint rand = random() % 100; // 50% 확률
        if (rand <50) {
            return WINNING_TOKEN_ID;
        } else {
            return (random() % 7); // 0 ~ 6: 미당첨 티켓 ID
        }
    }

    function uri(uint _tokenId) public pure override returns (string memory) {
        if (_tokenId == WINNING_TOKEN_ID) {
            return "https://lavender-neat-porcupine-347.mypinata.cloud/ipfs/QmZNtNaxhyz4n3PXW71RXUhsg8jR3PrpmQYjmfY3bXfVJx/WIN.json";
        } else {
            return string(abi.encodePacked("https://lavender-neat-porcupine-347.mypinata.cloud/ipfs/QmZNtNaxhyz4n3PXW71RXUhsg8jR3PrpmQYjmfY3bXfVJx/rugged_", _tokenId.toString(), ".json"));
        }
    }

    // 컨트랙트에 있는 ETH를 출금 하는 함수 -> 배포자만 가능
    function Harvest() external onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No balance to Harvest");
        payable(owner()).transfer(balance);
        
    }

     // 누구나 컨트랙트에 ETH를 보낼 수 있는 receive 함수 추가
    receive() external payable {}
}
