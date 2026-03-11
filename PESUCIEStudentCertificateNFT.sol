// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title PESUCIEStudentCertificateNFT
 * @dev ERC721 NFT representing digital badges/certificates issued by PES University CIE
 */
contract PESUCIEStudentCertificateNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct BadgeInfo {
        uint256 minted;
        uint256 cap;
    }

    mapping(string => BadgeInfo) public badgeTypes;

    event BadgeMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        string badgeType,
        string metadataURI
    );

    /**
     * @dev Constructor sets the ERC721 token details and transfers ownership to initialOwner
     * @param initialOwner Address of the CIE department or Program Manager
     */
    constructor(address initialOwner) ERC721("PESUCIE Student Certificate NFT", "PESUCIE") {
        transferOwnership(initialOwner);
    }

    /**
     * @dev Creates a new badge type with a cap
     * @param badgeType Name of the badge
     * @param cap Maximum number of this badge type that can be minted
     */
    function createBadgeType(string memory badgeType, uint256 cap) public onlyOwner {
        require(badgeTypes[badgeType].cap == 0, "Badge type already exists");
        badgeTypes[badgeType] = BadgeInfo(0, cap);
    }

    /**
     * @dev Mints a badge NFT of a specific type to the recipient.
     *      Only owner (CIE account) can call this.
     * @param recipient Recipient address
     * @param badgeType Type of badge
     * @param tokenURI Metadata URI of the badge
     */
    function mintBadge(
        address recipient,
        string memory badgeType,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        require(badgeTypes[badgeType].cap > 0, "Badge type not defined");
        require(badgeTypes[badgeType].minted < badgeTypes[badgeType].cap, "Badge cap reached");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        badgeTypes[badgeType].minted += 1;

        emit BadgeMinted(recipient, newItemId, badgeType, tokenURI);
        return newItemId;
    }

    /** 
     * @dev Returns total NFTs minted so far
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Returns how many badges of a particular type have been minted
     */
    function badgeMintedCount(string memory badgeType) public view returns (uint256) {
        return badgeTypes[badgeType].minted;
    }

    /**
     * @dev Returns the maximum cap for a particular badge type
     */
    function badgeCap(string memory badgeType) public view returns (uint256) {
        return badgeTypes[badgeType].cap;
    }
}