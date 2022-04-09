/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config();
 require("@nomiclabs/hardhat-ethers");
 const { REACT_APP_ALCHEMY_KEY, REACT_APP_METAMASK_KEY } = process.env;
 module.exports = {
    solidity: "0.7.0",
    defaultNetwork: "rinkeby",
    networks: {
       hardhat: {},
       rinkeby: {
          url: REACT_APP_ALCHEMY_KEY,
          accounts: [`0x${REACT_APP_METAMASK_KEY}`]
       }
    },
 }