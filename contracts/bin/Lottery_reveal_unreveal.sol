// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LotteryNFT is ERC1155, Ownable {
    using Strings for uint;

    string public name;
    string public symbol;
    string public unrevealedUri = "https://lavender-neat-porcupine-347.mypinata.cloud/ipfs/QmPtCgs7RU6k8ea4QjtXhGY6bobDpwQNhkiT7sQMg4uEEu";

    uint public ticketPrice;
    uint private constant MAX_TOKENS = 8;
    uint private constant WINNING_TOKEN_ID = 7;
    uint private constant PRIZE_MULTIPLIER = 2;
    uint private constant FEE_RATE_BY_1000 = 23;

    mapping(uint => bool) public isRevealed;
    mapping(uint => uint) private _balances;

    event TicketPurchased(address indexed buyer, uint indexed tokenId, bool isWinner);
    event NFTRevealed(uint indexed tokenId, bool isWinner);

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

    function purchaseTicket() external payable {
        require(msg.value >= ticketPrice, "Insufficient payment");
        require(_balances[WINNING_TOKEN_ID] < MAX_TOKENS, "All tickets have been sold");

        uint tokenId = determineOutcome();
        bool isWinner = (tokenId == WINNING_TOKEN_ID);

        _mint(msg.sender, tokenId, 1, "");
        _balances[tokenId] += 1;

        emit TicketPurchased(msg.sender, tokenId, isWinner);

        uint fee = (ticketPrice * FEE_RATE_BY_1000) / 1000;
        payable(owner()).transfer(fee);

        if (isWinner) {
            uint prize = ticketPrice * PRIZE_MULTIPLIER;
            require(address(this).balance >= prize, "Not enough balance for the prize. Please contact support on Discord.");
            payable(msg.sender).transfer(prize);
        }
    }

    function random() private view returns (uint) {
        address Binance15_balance = 0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549;
        address Binance16_balance = 0xDFd5293D8e347dFe59E90eFd55b2956a1343963d;
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender, Binance15_balance.balance, Binance16_balance.balance, address(this).balance)));
    }

    function determineOutcome() private view returns (uint) {
        uint rand = random() % 2;
        if (rand == 0) {
            return WINNING_TOKEN_ID;
        } else {
            return (random() % 7);
        }
    }

    function uri(uint _tokenId) public view override returns (string memory) {
        if (isRevealed[_tokenId]) {
            if (_tokenId == WINNING_TOKEN_ID) {
                return "https://lavender-neat-porcupine-347.mypinata.cloud/ipfs/QmZNtNaxhyz4n3PXW71RXUhsg8jR3PrpmQYjmfY3bXfVJx/WIN.json";
            } else {
                return string(abi.encodePacked("https://lavender-neat-porcupine-347.mypinata.cloud/ipfs/QmZNtNaxhyz4n3PXW71RXUhsg8jR3PrpmQYjmfY3bXfVJx/rugged_", _tokenId.toString(), ".json"));
            }
        } else {
            return unrevealedUri;
        }
    }

    function revealNFT(uint _tokenId) public {
        require(balanceOf(msg.sender, _tokenId) > 0, "Not token owner.");
        require(!isRevealed[_tokenId], "Already revealed.");

        isRevealed[_tokenId] = true;
        bool isWinner = (_tokenId == WINNING_TOKEN_ID);

        emit NFTRevealed(_tokenId, isWinner);
    }

    function Harvest() external onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No balance to Harvest");
        payable(owner()).transfer(balance);
    }
}
