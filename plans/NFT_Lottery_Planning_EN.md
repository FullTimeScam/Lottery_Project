
# NFT Lottery Service Frontend Planning Document

## Main Page Definition
1. **Main Page**: Wallet connection and lottery ticket purchase

## User Flow
1. Main Page
   - User clicks the wallet connect button
   - Once the wallet is connected, the button changes to a ticket purchase button
   - User clicks the ticket purchase button
   - The button changes to a loading button while the MetaMask payment window opens
   - After the payment is completed and the transaction is finished, a modal window displays the purchased NFT
   - The modal window shows either "Won" or "Not Won"

## UI Design
### Main Page
--------------------------------
| Logo        Service Title    |
|-----------------------------|
| Wallet Connect Button        |
|-----------------------------|
| Ticket Purchase Button       |
|-----------------------------|
| Loading Button               |
|-----------------------------|
| Result Modal (Won/Not Won)   |
--------------------------------

## Technology Stack
- TypeScript
- React
- Redux
- Tailwind CSS
- Chakra UI
- Vite
- ethers.js

## Smart Contract Integration
The smart contract used for this service is `Lottery.sol`, which implements the ERC1155 standard and includes the necessary logic for purchasing tickets, determining winners, and handling payments.

## Feature Implementation

### 1. Project Setup and Initial Structure

- Create and configure the project using **Vite**.
- Ensure type safety by using **TypeScript**.
- Use **Tailwind CSS** and **Chakra UI** for styling.
- Manage state using **Redux**.

### 2. Wallet Connection Feature

- Use **ethers.js** to connect to the MetaMask wallet.
- When the user clicks the wallet connect button, initiate the MetaMask wallet connection.
- Upon successful connection, update the Redux state to store the connection status.
- Change the wallet connect button to a ticket purchase button after the connection is successful.

### 3. Ticket Purchase Feature

- When the user clicks the ticket purchase button, open the MetaMask payment window.
- Use **ethers.js** to create the payment transaction, invoking the `purchaseTicket` function from the smart contract.
- While the payment is processing, display a loading button to inform the user.
- Ensure that the payment includes the ticket price plus a 2.3% fee.
- After the payment is completed, verify the transaction and update the Redux state.
- Emit the `TicketPurchased` event and listen for it to update the UI.
- Display a modal window showing the purchased NFT once the transaction is successfully completed.

### 4. Result Modal

- After the payment and transaction are completed, display a modal window showing the purchased NFT.
- Implement the modal window using **Chakra UI** components.
- The modal window will show either "Won" or "Not Won" based on the transaction result.
- If the result is "Won," additional payment processing for prize distribution can be handled.

### 5. State Management

- Use **Redux** to manage the wallet connection status, payment status, transaction results, and other relevant states.
- Ensure that UI components are updated appropriately based on state changes.

### 6. Styling

- Apply efficient and fast styling using **Tailwind CSS**.
- Style modal windows and buttons using **Chakra UI** components for a polished look.

### 7. Final Integration and Testing

- Integrate all features to ensure a seamless user flow.
- Conduct unit tests and integration tests for each feature to identify and fix bugs.

## Smart Contract Details
The `Lottery.sol` contract includes the following key features:
- ERC1155 token implementation for lottery tickets.
- Functions for purchasing tickets and determining winners.
- A `TicketPurchased` event to notify the frontend of ticket purchases.
- Logic to handle payments and distribute prizes, including a 2.3% fee and double prize payout for winners.
- Utility functions to generate random outcomes and assign ticket IDs.

---

This planning document focuses on the critical features for rapid development. All functionalities are implemented within `App.tsx`, without separating into multiple components. The integration with the smart contract `Lottery.sol` is handled using `ethers.js` to facilitate wallet connections, transactions, and event listening.
