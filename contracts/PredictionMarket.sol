// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PredictionMarket {
    struct Market {
        address token;
        string question;
        uint128 upPool;     // Use uint128 to save gas
        uint128 downPool;
        uint40 endTime;     // uint40 enough until year 36812
        bool resolved;
        bool outcome;
        address creator;
    }

    struct Bet {
        bool direction;
        bool claimed;
        uint128 amount;     // Pack with bools for one slot
    }

    Market[] public markets;
    mapping(uint256 => mapping(address => Bet)) public bets;
    uint16 public platformFee = 20; // 2% in basis points
    address public feeRecipient;

    event MarketCreated(uint256 indexed marketId, address token, string question, uint256 endTime);
    event BetPlaced(uint256 indexed marketId, address indexed user, bool direction, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event Claimed(uint256 indexed marketId, address indexed user, uint256 payout);

    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    function createMarket(
        address token,
        string calldata question,
        uint256 duration
    ) external returns (uint256) {
        uint256 marketId = markets.length;
        markets.push(Market({
            token: token,
            question: question,
            upPool: 0,
            downPool: 0,
            endTime: uint40(block.timestamp + duration),
            resolved: false,
            outcome: false,
            creator: msg.sender
        }));
        emit MarketCreated(marketId, token, question, block.timestamp + duration);
        return marketId;
    }

    function placeBet(uint256 marketId, bool direction) external payable {
        Market storage market = markets[marketId];
        require(block.timestamp < market.endTime, "Market ended");
        require(!market.resolved, "Market resolved");
        require(msg.value > 0, "Amount must be > 0");
        require(msg.value <= type(uint128).max, "Amount too large");

        bets[marketId][msg.sender] = Bet({
            direction: direction,
            claimed: false,
            amount: uint128(msg.value)
        });

        if (direction) {
            market.upPool += uint128(msg.value);
        } else {
            market.downPool += uint128(msg.value);
        }

        emit BetPlaced(marketId, msg.sender, direction, msg.value);
    }

    function resolveMarket(uint256 marketId, bool outcome) external {
        Market storage market = markets[marketId];
        require(msg.sender == market.creator, "Only creator");
        require(block.timestamp >= market.endTime, "Not ended yet");
        require(!market.resolved, "Already resolved");

        market.resolved = true;
        market.outcome = outcome;
        emit MarketResolved(marketId, outcome);
    }

    function claim(uint256 marketId) external {
        Market storage market = markets[marketId];
        require(market.resolved, "Not resolved");
        Bet storage bet = bets[marketId][msg.sender];
        require(!bet.claimed, "Already claimed");
        require(bet.amount > 0, "No bet");

        bet.claimed = true;

        if (bet.direction == market.outcome) {
            // Calculate payout without division overflow
            uint256 totalPool = uint256(market.upPool) + uint256(market.downPool);
            uint256 payout = (uint256(bet.amount) * totalPool) / (market.outcome ? market.upPool : market.downPool);
            uint256 fee = (payout * platformFee) / 1000;
            payout -= fee;

            if (payout > 0) {
                payable(msg.sender).transfer(payout);
            }
        }

        emit Claimed(marketId, msg.sender, bet.amount);
    }

    function getMarketCount() external view returns (uint256) {
        return markets.length;
    }
}
