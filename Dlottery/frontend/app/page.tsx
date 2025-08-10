'use client'
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ContractAddress from "@/contratcs/contract-address.json";
import lotteryABI from "@/contratcs/Lottery.json";

interface StateType {
  provider: ethers.BrowserProvider | null;
  signer: any | null;
  contract: ethers.Contract | null;
}

const lotteryContractAddress = ContractAddress.Lottery;
const contractABI = lotteryABI.abi;
const HARDHAT_NETWORK_ID = "31337"; // Use your network ID here

export default function LotteryApp() {
  const [state, setState] = useState<StateType>({
    provider: null,
    signer: null,
    contract: null,
  });
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [inputAmount, setInputAmount] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [previousWinners, setPreviousWinners] = useState<string[]>([]);
  const [totalBalance, setTotalBalance] = useState<string | null>(null);
  const [roomActive, setRoomActive] = useState<boolean>(false);
  const [roomCreated, setRoomCreated] = useState<boolean>(false); // Track if a room has been created

  useEffect(() => {
    const connectWallet = async () => {
      const { ethereum } = window;

      if (ethereum) {
        try {
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          if (ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            const account = await ethereum.request({
              method: "eth_requestAccounts",
            });

            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
              lotteryContractAddress,
              contractABI,
              signer
            );

            setUserAddress(account[0]);
            setState({ provider, signer, contract });
          } else {
            setUserAddress("Other Network");
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Please install Metamask");
      }
    };

    connectWallet();
  }, []);

  const handleCreateRoom = async () => {
    try {
      const tx = await state.contract!.createRoom();
      await tx.wait();
      // Fetch room details
      const playersList = await state.contract!.getPlayers(roomId);
      const balance = await state.contract!.getTotalBalance(roomId);
      const currentWinner = await state.contract!.getWinner(roomId);
      const previousWinnersList = await state.contract!.getPreviousWinners(roomId);
      alert("Room created/joined successfully!");
      setRoomCreated(true); // Set roomCreated to true after creating a room


           // Update state with room details
           setPlayers(playersList);
           setTotalBalance(ethers.formatEther(balance));
           setWinner(currentWinner);
           setPreviousWinners(previousWinnersList);
           setRoomActive(true); // Set room as active
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };



  const handleStartLottery = async () => {
    if (roomId === null) return alert("Please enter a room ID");
    try {
      const tx = await state.contract!.startLottery(roomId);
      await tx.wait();
      alert("Lottery has started!");
      setRoomActive(true);
    } catch (error) {
      console.error("Error starting lottery:", error);
    }
  };

  const handleEnterLottery = async () => {
    if (!inputAmount || !userAddress || roomId === null) return alert("Please enter an amount and room ID");
    try {
      const tx = await state.contract!.enterLottery(roomId, {
        value: ethers.parseEther(inputAmount),
      });
      await tx.wait();
      alert("You have entered the lottery!");

      // Update players list and total balance
      const playersList = await state.contract!.getPlayers(roomId);
      const balance = await state.contract!.getTotalBalance(roomId);
      setPlayers(playersList);
      setTotalBalance(ethers.formatEther(balance));
    } catch (error: any) {
      if (error.message.includes("You have already entered the lottery")) {
        alert("You have already joined the current lottery.");
      } else {
        console.error("Error entering lottery:", error);
      }
    }
  };

  const handleEndLottery = async () => {
    if (roomId === null) return alert("Please enter a room ID");
    try {
      const tx = await state.contract!.endLottery(roomId);
      await tx.wait();
      alert("Lottery has ended!");
  
      // Fetch new players list, winner, and previous winners
      const playersList = await state.contract!.getPlayers(roomId);
      const currentWinner = await state.contract!.getWinner(roomId);
      const previousWinnersList = await state.contract!.getPreviousWinners(roomId);
      const balance = await state.contract!.getTotalBalance(roomId);

      setPlayers(playersList);
      setWinner(currentWinner);
      setPreviousWinners(previousWinnersList);
      setTotalBalance(ethers.formatEther(balance));
      setRoomActive(false); // Set room as inactive after ending
    } catch (error) {
      console.error("Error ending lottery:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-126">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Room-Based Lottery DApp</h1>
        <h1 className="text-sm font-bold mb-6 text-center text-black">
          Your Address: {userAddress}
        </h1>

        {/* Room Creation and Joining Section */}
        {!roomCreated && (
          <div className="mb-4">
            <button
              onClick={handleCreateRoom}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
            >
              Create/join Room
            </button>
            <input
              type="number"
              className="w-full p-2 border rounded text-black mb-2"
              placeholder="Enter Room ID to Join/create"
              value={roomId || ""}
              onChange={(e) => setRoomId(Number(e.target.value))}
            />
          </div>
        )}


      {/* Display Room ID after joining */}

      {roomActive && roomId !== null && (
        <div className="mb-4">
        <p className="text-black">You are currently in Room ID: {roomId}</p>
        </div>
      )}


        {/* Lottery Functionality Section */}
        {roomCreated && (
          <div>
            <div className="mb-4">
              <input
                type="number"
                className="w-full p-2 border rounded text-black"
                placeholder="Enter amount (0.1) to join lottery (ETH)"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
              />
            </div>

            <div className="flex justify-around mb-4">
              <button
                onClick={handleStartLottery}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Start Lottery
              </button>
              <button
                onClick={handleEnterLottery}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Enter Lottery
              </button>
              <button
                onClick={handleEndLottery}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                End Lottery
              </button>
            </div>

            {/* Displaying Lottery Information */}
            <div className="mt-4">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-black">Current Winner:</h2>
                <p className="text-black">{winner ? winner : "No winner yet."}</p>
              </div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-black">Previous Winners:</h2>
                {previousWinners.length > 0 ? (
                  <ul className="list-disc ml-5 text-black">
                    {previousWinners.map((prevWinner, index) => (
                      <li key={index}>{prevWinner}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-black">No previous winners.</p>
                )}
              </div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-black">Players:</h2>
                {players.length > 0 ? (
                  <ul className="list-disc ml-5 text-black">
                    {players.map((player, index) => (
                      <li key={index}>{player}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-black">No players have entered the lottery yet.</p>
                )}
              </div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-black">Total Balance:</h2>
                <p className="text-black">{totalBalance ? totalBalance + " ETH" : "0 ETH"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}