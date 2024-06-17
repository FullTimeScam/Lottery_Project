import React, { useState } from "react";
import { ethers } from "ethers";

const MainPage: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [ticketCount, setTicketCount] = useState<number>(1);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User rejected the request.");
      }
    } else {
      console.error("MetaMask is not installed.");
    }
  };

  const purchaseTickets = async () => {
    if (!account) {
      console.error("Wallet not connected.");
      return;
    }

    // Implement the logic to purchase lottery tickets
    console.log(`Purchasing ${ticketCount} tickets...`);
    // Add blockchain interaction code here
  };

  return (
    <div>
      <header>
        <h1>NFT Lottery Service</h1>
      </header>
      <section>
        <h2>Introduction</h2>
        <p>
          Welcome to the NFT Lottery Service. Purchase your tickets and try your
          luck!
        </p>
      </section>
      <section>
        <button onClick={connectWallet}>
          {account ? `Connected: ${account}` : "Connect Wallet"}
        </button>
      </section>
      <section>
        <h2>Purchase Lottery Tickets</h2>
        <div>
          <label htmlFor="ticketCount">Number of Tickets:</label>
          <input
            type="number"
            id="ticketCount"
            value={ticketCount}
            onChange={(e) => setTicketCount(Number(e.target.value))}
            min="1"
          />
        </div>
        <button onClick={purchaseTickets}>Purchase</button>
      </section>
      <section>
        <h2>Recent Winners</h2>
        {/* Placeholder for recent winners */}
        <ul>
          <li>Winner 1</li>
          <li>Winner 2</li>
          <li>Winner 3</li>
        </ul>
      </section>
    </div>
  );
};

export default MainPage;
