import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useEthers } from "@usedapp/core"
import { Button, makeStyles } from "@material-ui/core"
import NFTContainer from './NFTContainer';
import { ChainId, DAppProvider, useTokenBalance } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { constants } from "ethers"
import helperConfig from "./helper-config.json"
import brownieConfig from "./brownie-config.json"





const Checkout: React.FC = () => {

  // NOTE: THIS IS THE TEST WALLET ADDRESS FROM THIS DOCUMENTATION:
  // https://api.rarible.org/v0.1/doc#operation/getItemsByOwner
  const testWalletAddress = "0x60f80121c31a0d46b5279700f9df786054aa5ee5"

  const [errorMessage, setErrorMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [userBalance, setUserBalance] = useState('');
  const [nfts, setNfts] = useState([]);

  const connectWallet = () => {
    if ((window as any).ethereum) {
      (window as any).ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts: any) => {
          accountChangedHandler(accounts[0]);
        })
    } else {
      setErrorMessage('Please install Metamask');
    }
  }

  //const { account, activateBrowserWallet, deactivate } = useEthers()
  // console.log(account)
  // const isConnected = account !== undefined
  const { chainId } = useEthers()
  console.log(chainId)

  const accountChangedHandler = (newAccount: any) => {
    console.log(newAccount)
    setWalletAddress(newAccount);
    getUserBalance(newAccount.toString());
    getNFTData(newAccount);
  }

  const getUserBalance = (address: any) => {
    (window as any).ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] })
      .then((balance: any) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
  }

  const getNFTData = async (address: any) => {

    const response = await fetch(`https://api.rarible.org/v0.1/items/byOwner/?owner=ETHEREUM:${address}`);

    const data = await response.json();

    setNfts(data.items);
  }

  const chainChangedHandler = (newChain: any) => {
    window.location.reload();
  }

  // Check if user changes their connected account
  (window as any).ethereum.on('accountChanged', accountChangedHandler);

  // If user changes testnets or test to devnet, reload site
  (window as any).ethereum.on('chainChanged', chainChangedHandler);

  return (

    <div>
      <DAppProvider config={{
        supportedChains: [ChainId.Rinkeby],
        notifications: {
          expirationPeriod: 1000,
          checkInterval: 1000
        },
        multicallVersion: 2
      }}></DAppProvider>
      <h1>Checkout product</h1>

      <div>
        {/* {isConnected ? (
        <Button color="primary" variant='contained' onClick={deactivate}>

          Disconnect

        </Button>
      ) : (
        <Button color="primary" variant='contained'
          onClick={() => activateBrowserWallet()}>
          Connect
        </Button>
      )
      } */}
      </div>
      <button onClick={connectWallet}>One-click barter</button>
      <div>
        <h3>Address: { }</h3>
      </div>
      <div>
        <h3>Balance: {userBalance}</h3>
        <p>{errorMessage}</p>
      </div>
      <NFTContainer nfts={nfts} />
    </div>
  );
}

export default Checkout;






// const useStyles = makeStyles((theme) => ({
//   container: {
//     padding: theme.spacing(4),
//     display: 'flex',
//     justifyContent: 'flex-end',
//     gap: theme.spacing(1)
//   }
// }))

// const Checkout = () => {
//   const classes = useStyles()
//   const { account, activateBrowserWallet, deactivate } = useEthers()

//   const isConnected = account !== undefined

//   return (
//     <div className={classes.container}>
//       <div>
//         {isConnected ? (
//           <Button color="primary" variant='contained' onClick={deactivate}>

//             Disconnect

//           </Button>
//         ) : (
//           <Button color="primary" variant='contained'
//             onClick={() => activateBrowserWallet()}>
//             Connect
//           </Button>
//         )
//         }

//       </div>
//       <div>
//         <h3>Address: {account}</h3>
//       </div>
//       <div>
//         <h3>Balance: {WalletBalance()}</h3>
//       </div>
//     </div>

//   )
// }


// const WalletBalance = () => {
//   const wethTokenAddress = brownieConfig["networks"]['rinkeby']["weth_token"]

//   const { account } = useEthers()
//   const tokenBalance = useTokenBalance(wethTokenAddress, account)
//   const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
//   return (formattedTokenBalance)
// }


// // export default Checkout;

// function App() {
//   return (
//     <DAppProvider config={{
//       supportedChains: [ChainId.Rinkeby],
//       notifications: {
//         expirationPeriod: 1000,
//         checkInterval: 1000
//       },
//       multicallVersion: 2
//     }}>
//       <Checkout />
//     </DAppProvider>
//   )
// }

// export default App