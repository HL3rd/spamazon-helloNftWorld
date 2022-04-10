//SPDX-License-Identifier: MIT

pragma solidity >=0.7.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./Math.sol";

contract Barter is IERC721Receiver {
    using Math for uint256;

    // struct for what each person owes, specific to what they bought
    struct userBorrow {
        uint256 amountOwed;
        address buyer;
        address seller;
    }

    mapping(address => uint256) totalborrowedETH;

    // mapping: buyer -> NFT Contract => tokenID -> struct(money owed, buyer, seller)
    mapping(address => mapping(address => mapping(uint256 => userBorrow)))
        public loanTracker;
    // will have to handle multiple purchases

    address public constant WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;

    address owner;

    constructor() {
        owner = msg.sender;
    }

    ///@notice function transfers ownership from buyer to seller
    ///@dev the calling contract/function must approve the transfer to the seller's address
    function exchangeNFT(
        address _buyer,
        address _seller,
        address _collection,        // TODO: Instead of _collection, I think you mean _nftContract or _contract
        uint256 _tokenID
    ) public {
        IERC721(_collection).safeTransferFrom(_buyer, _seller, _tokenID);
    }

    ///@notice function transfers ownership from buyer to this contract to be held as collateral
    ///@notice buyer will automaticall receive thier NFT back once they repay the item value
    ///@dev the calling contract/function must approve the transfer to this contract address

    // backend should check to see if there is enough collateral value, it will also allow user to buy multiple items against one NFT
    function collateralizedPurchase(
        address _buyer,
        address _seller,
        address _collection,
        uint256 _tokenID,
        uint256 _itemValue
    ) public {
        //if they purchsed from new seller with same NFT, they must have payed off thier old debts
        if (loanTracker[_buyer][_collection][_tokenID].seller != _seller) {
            require(loanTracker[_buyer][_collection][_tokenID].amountOwed == 0);
        }

        IERC721(_collection).safeTransferFrom(_buyer, address(this), _tokenID);

        loanTracker[_buyer][_collection][_tokenID].amountOwed += _itemValue;
        totalborrowedETH[_buyer] += _itemValue;
        loanTracker[_buyer][_collection][_tokenID].seller = _seller;
        //redundant?
        loanTracker[_buyer][_collection][_tokenID].buyer = _buyer;
    }

    ///@notice buyer pays back what they owe in WETH only
    ///@dev the calling contract/function must approve the transfer of ERC20 to the seller address
    function repay(
        address _collection,
        uint256 _tokenID,
        uint256 _amount
    ) public {
        //require(msg.sender == loanTracker[msg.sender][_collection][_tokenID].buyer);
        //make sure user has enough WETH
        require(
            IERC20(WETH).balanceOf(msg.sender) >= _amount,
            "not enough WETH to repay"
        );
        ///could use address _buyer
        require(
            loanTracker[msg.sender][_collection][_tokenID].amountOwed >=
                _amount,
            "Cannot pay back more than you owe"
        );

        IERC20(WETH).transferFrom(
            msg.sender,
            (loanTracker[msg.sender][_collection][_tokenID].seller),
            _amount
        );

        loanTracker[msg.sender][_collection][_tokenID].amountOwed -= _amount; //minimum( _amount, loanTracker[_buyer][_collection][_tokenID].amountOwed)
        totalborrowedETH[msg.sender] -= _amount;

        //send NFT if debt is paid
        if (loanTracker[msg.sender][_collection][_tokenID].amountOwed == 0) {
            IERC721(_collection).safeTransferFrom(
                address(this),
                msg.sender,
                _tokenID
            );
        }
    }

    ///@notice upon defualt, the store gets th NFT, and the user no longer owes money.
    function handleDefault(
        address _buyer,
        address _collection,
        uint256 _tokenID
    ) public {
        IERC721(_collection).safeTransferFrom(
            address(this),
            loanTracker[_buyer][_collection][_tokenID].seller,
            _tokenID
        );
        loanTracker[_buyer][_collection][_tokenID].amountOwed = 0;
        //delete mapping? or set buyer/seller to zero address?

        //take after 30 days
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    //_____________________________Helper Functions Begin Here_____________________________//

    function minimum(uint256 a, uint256 b) internal pure returns (uint256) {
        return a.min(b);
    }

    ///@notice returns the total eth quantity owed by a user
    function totalValueBorrowed(address _buyer) public view returns (uint256) {
        return totalborrowedETH[_buyer];
    }

    ///@notice returns value owed on 1 NFT used as collateral
    function valueBorrowedOneNFT(
        address _buyer,
        address _collection,
        uint256 _tokenID
    ) public view returns (uint256) {
        return loanTracker[_buyer][_collection][_tokenID].amountOwed;
    }

    ///@notice returns address of seller who has an NFT as collateral
    function sellerCollateralNFT(
        address _buyer,
        address _collection,
        uint256 _tokenID
    ) public view returns (address) {
        return loanTracker[_buyer][_collection][_tokenID].seller;
    }

    function emergencyExit(address nft, uint256 _tokenID) public {
        IERC721(nft).safeTransferFrom(address(this), msg.sender, _tokenID);
    }
}