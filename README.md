# Spamazon
**Buy anything with anything**

### Deployed Site: https://spamazon-nft.netlify.app/
**Must use Rinkeby network and have > 0 WETH in wallet to user properly**

This project won the **Most Hilarious** category and **2nd overall** in the [OpenSea x Replit HelloNFTWorld Hackathon](https://dorahacks.io/hackathon/19/detail)

[OpenSea Leaderboard](https://dorahacks.io/grant/opensea/top)

[Project BUILD Link](https://dorahacks.io/buidl/2677)

### Team
[Horacio Lopez](https://github.com/HL3rd) - Full Stack
[Matteo Cosentino](https://github.com/Matteocos40) - Solidity
[Collin Haney](https://github.com/chaney13) - HTML & CSS

## Idea

At the time of this project, there was a recent vacuum in the one-click checkout space so we though to ourselves, "Wouldn't it be funny if someone built a one-click checkout for web3? How funny would it be to barter your $300k BAYC NFT for a $3000 Macbook?"

We got to work and eventually created Spamazon, the home of Spamazon Checkout and a store where you can buy anything with anything.

## Functionality

### Instant Barter

Checkout with **One-click Barter** and if your NFT collection's floor price is >= the price of the item, then you will instantly trade your NFT to the store.

**CAREFUL!!! YOU WILL NOT BE ABLE TO GET YOUR NFT BACK WITH THIS OPTION**

### Collateralized Barter

Checkout with **Dump now, pay later** and if your NFT collection's floor price is >= 50% of price of the item, then Barter.sol will hold your NFT as collateral until you pay back the full item price.

### Repayment

Repayments can only be done in WETH. The intention behind this is to make it easier to allow payments with other ERC20 coins in the future.
