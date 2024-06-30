// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import './libs/SignerVerifiation.sol';
contract PetNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIdCounter;

    enum Rarity {
        Common,
        Uncommon,
        Rare,
        Legendary
    }

    struct PetInfo {
        uint32 level;
        Rarity rarity;
    }

    mapping(uint256 => PetInfo) public petInfos;
     address private constant signer = 0x1b8529889149F882f00a65597467026669f5b29C;

    uint256 public constant MAX_SUPPLY = 50000;
    uint256 public constant MAX_COMMON = 30000;
    uint256 public constant MAX_UNCOMMON = 12500;
    uint256 public constant MAX_RARE = 5000;
    uint256 public constant MAX_LEGENDARY = 2500;

    uint256 public commonCount;
    uint256 public uncommonCount;
    uint256 public rareCount;
    uint256 public legendaryCount;

    uint256 public constant MINT_PRICE_USD = 2 * 10**18; 
    uint256 public ethUsdRate = 2000 * 10**18;

    constructor() ERC721("PetNFT", "PNFT") {}

    function mint(uint random) public payable {
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= getMintPriceInETH(), "Insufficient ETH for minting");

        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);

        Rarity rarity = _randomRarity(random);
        petInfos[tokenId] = PetInfo(1, rarity);

        _tokenIdCounter.increment();
    }

    function levelUp(uint256 tokenId, uint256 validTill, bytes calldata signature) public {
          string memory message = string(abi.encodePacked(_addressToString(msg.sender), Strings.toString(petInfos[tokenId].level + 1), Strings.toString(validTill)));

        require(
			SignerVerification.isMessageVerified(signer, signature, message),
			'Signature is wrong'
		);
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "You do not own this token");

        petInfos[tokenId].level += 1;
    }

    function _randomRarity(uint random) private returns (Rarity) {
        uint256 rand = random;
        if (rand < 60 && commonCount < MAX_COMMON) {
            commonCount += 1;
            return Rarity.Common;
        } else if (rand < 85 && uncommonCount < MAX_UNCOMMON) {
            uncommonCount += 1;
            return Rarity.Uncommon;
        } else if (rand < 95 && rareCount < MAX_RARE) {
            rareCount += 1;
            return Rarity.Rare;
        } else if (legendaryCount < MAX_LEGENDARY) {
            legendaryCount += 1;
            return Rarity.Legendary;
        } else {
            return _fallbackRarity();
        }
    }

    function _fallbackRarity() private returns (Rarity) {
        if (commonCount < MAX_COMMON) {
            commonCount += 1;
            return Rarity.Common;
        } else if (uncommonCount < MAX_UNCOMMON) {
            uncommonCount += 1;
            return Rarity.Uncommon;
        } else if (rareCount < MAX_RARE) {
            rareCount += 1;
            return Rarity.Rare;
        } else {
            legendaryCount += 1;
            return Rarity.Legendary;
        }
    }

    function _random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, _tokenIdCounter.current())));
    }

    function getMintPriceInETH() public view returns (uint256) {
        return MINT_PRICE_USD.mul(10**18).div(ethUsdRate);
    }

    function setEthUsdRate(uint256 _rate) public onlyOwner {
        ethUsdRate = _rate;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }
   function _addressToString(address _addr) internal pure returns (string memory) {
    bytes memory addressBytes = abi.encodePacked(_addr);

    bytes memory stringBytes = new bytes(40); 

    for (uint256 i = 0; i < 20; ) {
        uint8 leftValue = uint8(addressBytes[i]) / 16;
        uint8 rightValue = uint8(addressBytes[i]) - 16 * leftValue;

        bytes1 leftChar = leftValue < 10 ? bytes1(leftValue + 48) : bytes1(leftValue + 87);
        bytes1 rightChar = rightValue < 10 ? bytes1(rightValue + 48) : bytes1(rightValue + 87);

        stringBytes[2 * i] = leftChar;
        stringBytes[2 * i + 1] = rightChar;

        unchecked {
            i++;
        }
    }

    return string(stringBytes);
}
}
