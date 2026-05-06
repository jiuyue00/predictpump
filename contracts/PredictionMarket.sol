// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PredictionMarket {
    struct Market {
        address token;
        string question;
        uint256 upPool;
        uint256 downPool;
        uint256 endTime;
        bool resolved;
        bool outcome; // true = up, false = down
        address creator;
    }

    struct Bet {
        bool direction; // true = up, false = down
        uint256 amount;
        bool claimed;
    }

    Market[] public markets;
    mapping(uint256 => mapping(address => Bet)) public bets;
    uint256 public platformFee = 20; // 2% in basis points
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
            endTime: block.timestamp + duration,
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

        bets[marketId][msg.sender] = Bet({
            direction: direction,
            amount: msg.value,
            claimed: false
        });

        if (direction) {
            market.upPool += msg.value;
        } else {
            market.downPool += msg.value;
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

        uint256 payout = 0;

        if (bet.direction == market.outcome) {
            uint256 winningPool = market.outcome ? market.upPool : market.downPool;
            uint256 losingPool = market.outcome ? market.downPool : market.upPool;
            uint256 totalPool = winningPool + losingPool;

            // User's share of winning pool
            uint256 userShare = (bet.amount * totalPool) / winningPool;
            uint256 fee = (userShare * platformFee) / 1000;
            payout = userShare - fee;
        }

        bet.claimed = true;

        if (payout > 0) {
            payable(msg.sender).transfer(payout);
            payable(feeRecipient).transfer(payout * platformFee / 1000);
        }

        emit Claimed(marketId, msg.sender, payout);
    }

    function getMarketCount() external view returns (uint256) {
        return markets.length;
    }
}
