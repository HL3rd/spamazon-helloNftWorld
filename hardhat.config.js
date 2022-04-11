/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config();
 require("@nomiclabs/hardhat-ethers");
 
 const { REACT_APP_ALCHEMY_URL, REACT_APP_PRIVATE_KEY } = process.env;

 module.exports = {
    solidity: "0.7.0",
    defaultNetwork: "rinkeby",
    networks: {
       hardhat: {},
       rinkeby: {
          url: REACT_APP_ALCHEMY_URL,
          accounts: [`0x${REACT_APP_PRIVATE_KEY}`]
       }
    },
 }