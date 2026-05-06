// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PredictToken.sol";
import "./PredictionMarket.sol";

contract PredictPumpFactory {
    struct TokenInfo {
        address token;
        address market;
        address creator;
        string name;
        string symbol;
        uint256 createdAt;
    }

    TokenInfo[] public tokens;
    mapping(address => TokenInfo[]) public userTokens;

    event TokenCreated(
        address indexed token,
        address indexed market,
        address indexed creator,
        string name,
        string symbol
    );

    address public feeRecipient;
    uint256 public creationFee = 0.005 ether;

    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    function createToken(
        string calldata name,
        string calldata symbol,
        uint8 decimals_,
        uint256 initialSupply,
        string calldata question,
        uint256 marketDuration
    ) external payable returns (address, address) {
        require(msg.value >= creationFee, "Insufficient fee");

        // Create token
        PredictToken token = new PredictToken(name, symbol, decimals_, initialSupply);

        // Create prediction market for this token
        PredictionMarket market = new PredictionMarket(feeRecipient);
        market.createMarket(address(token), question, marketDuration);

        // Record
        TokenInfo memory info = TokenInfo({
            token: address(token),
            market: address(market),
            creator: msg.sender,
            name: name,
            symbol: symbol,
            createdAt: block.timestamp
        });

        tokens.push(info);
        userTokens[msg.sender].push(info);

        // Transfer fee
        payable(feeRecipient).transfer(msg.value);

        emit TokenCreated(address(token), address(market), msg.sender, name, symbol);

        return (address(token), address(market));
    }

    function getTokenCount() external view returns (uint256) {
        return tokens.length;
    }

    function getUserTokenCount(address user) external view returns (uint256) {
        return userTokens[user].length;
    }
}
