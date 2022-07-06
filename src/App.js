import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';
import TokenECR20 from './artifacts/contracts/TokenECR20.sol/TokenECR20.json';

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const tokenEcr20Address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function App() {
  const [greeting, setGreetingValue] = useState('Click button to fetch greeting');
  const [userAccount, setUserAccount] = useState();
  const [balanceVanilla, setBalanceVanilla] = useState('Click button to get balances');
  const [balanceEcr20, setBalanceEcr20] = useState('Click button to get balances');
  const [amountToken, setAmountToken] = useState();
  const [amountEcr20, setAmountEcr20] = useState();

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        setGreetingValue(data);
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
    }
  }

  async function getBalances() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractVanilla = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balanceVanilla = await contractVanilla.balanceOf(account);
      const contractEcr20 = new ethers.Contract(tokenEcr20Address, Token.abi, provider);
      const balanceEcr20 = await contractEcr20.balanceOf(account);

      setBalanceVanilla(balanceVanilla.toString());
      setBalanceEcr20(balanceEcr20.toString());

    }
    return "Could not fetch balance.";
  }

  async function sendTokens() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amountToken);
      await transaction.wait();
      console.log(`${amountToken} Tokens successfully sent to ${userAccount}`);
    }
  }

  async function sendTokensEcr20() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenEcr20Address, TokenECR20.abi, signer);
      const transaction = await contract.transfer(userAccount, amountEcr20);
      await transaction.wait();
      console.log(`${amountEcr20} ECR20 Tokens successfully sent to ${userAccount}`);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Greeting</h1>
        <div>Greeter address: {greeterAddress}</div>
        <br />
        <div>Greeting: {greeting}</div>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <br />
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
        <button onClick={setGreeting}>Set Greeting</button>



        <h1>Tokens</h1>

        <div>Vanilla Token address: {tokenAddress}</div>
        <div>ECR20 Token address: {tokenEcr20Address}</div>
        <br />

        <div>Vanilla Token balance: {balanceVanilla}</div>
        <div>ECR20 Token balance: {balanceEcr20}</div>
        <br />

        <button onClick={getBalances}>Get Balances</button>

        <div>Send to:</div><input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <br />


        <input onChange={e => setAmountToken(e.target.value)} placeholder="Amount Vanilla Token" />
        <button onClick={sendTokens}>Send Vanilla Token</button>

        <br />

        <input onChange={e => setAmountEcr20(e.target.value)} placeholder="Amount ECR20 Tokens" />
        <button onClick={sendTokensEcr20}>Send Ecr20 Tokens</button>


      </header>
    </div>
  );
}


// function App() {







// async function setGreeting() {
//  
// }


//   return (
//     <div className="App">
//       <header className="App-header">
//         <Greeting />
//         {/* <div>Greeting: {this.fetchGreeting()}</div>
//         <button onClick={setGreeting}>Set Greeting</button>
//         <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />

//       </header>
//     </div>
//   );
// }

export default App;
