pragma solidity ^0.8.26;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LotteryNFT is ERC1155, Ownable {
    using Strings for uint;

    string public name;
    string public symbol;
    uint public ticketPrice;
    
    uint private constant MAX_TOKENS = 8;
    uint private constant WINNING_TOKEN_ID = 7;
    uint private constant PRIZE_MULTIPLIER = 2;
    uint private constant FEE_RATE_BY_1000 = 23;

    event TiketPurchased(address indexed buyer, uint indexed  tokenId, bool isWinner);

    constructor(
        string memory _name,
        string memory _symbol,
        uint _ticketPrice
    )

    ERC1155("")
    Ownable(msg.sender)
    
    {
        name = _name;
        symbol = _symbol;
        ticketPrice = _ticketPrice;
    }

    function purchaseTicket() public payable {
        uint fee = (ticketPrice * FEE_RATE_BY_1000) / 1000;
        uint netTicketPrice = ticketPrice + fee;
        require(msg.value == netTicketPrice, "Incorrect ticket price including fee");

        uint tokenId = determineOutcome();
        _mint(msg.sender, tokenId, 1, "");

        bool isWinner = (tokenId == WINNING_TOKEN_ID);
        emit TiketPurchased(msg.sender, tokenId, isWinner);

        payable (owner()).transfer(fee);

        if(isWinner) {
            uint prize = ticketPrice * PRIZE_MULTIPLIER;
            require(address(this).balance >= prize, "Not enough balance in the prize pool. Please contact support on Discord.");
            payable(msg.sender).transfer(prize);
        }
        
    }

    function random() private view returns (uint) {
        address Binance15_balance = 0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549;
        address Binance16_balance = 0xDFd5293D8e347dFe59E90eFd55b2956a1343963d;
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender, Binance15_balance.balance, Binance16_balance.balance, address(this).balance)));
    }




    function determineOutcome() private view returns (uint){
        uint rand = random()%2;
        if (rand ==0) {

        }
        
    }

}