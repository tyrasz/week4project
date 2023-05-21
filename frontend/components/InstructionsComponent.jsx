import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { useSigner, useNetwork, useBalance } from "wagmi";
import { useState, useEffect } from "react";
import * as contractJson from "./assets/TokenizedBallot.json";
import { ethers } from "ethers";
// import dotenv from "dotenv";
// dotenv.config();

// const mnemonic = process.env.MNEMONIC;
// const mnemonic1 = process.env.MNEMONIC1;

// if (!mnemonic) {
//   throw new Error("Mnemonic phrase not defined");
// }
// const wallet = ethers.Wallet.fromMnemonic(mnemonic);

// if (!mnemonic1) {
//   throw new Error("Mnemonic phrase not defined");
// }
// const wallet1 = ethers.Wallet.fromMnemonic(mnemonic1);
// const privateKey = wallet.privateKey;
// const privateKey1 = wallet1.privateKey;

export default function InstructionsComponent() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <h1>Voting dApp</h1>
      </header>

      <div className={styles.buttons_container}>
        <PageBody></PageBody>
        1. Vote 2. Delegate 3. Query results
        <WinningProposal></WinningProposal> Request tokens via API
      </div>
      <div className={styles.footer}>Footer</div>
    </div>
  );
}

function PageBody() {
  return (
    <div>
      <WalletInfo></WalletInfo>
    </div>
  );
}

function WalletInfo() {
  const { data: signer, isError, isLoading } = useSigner();
  const { chain, chains } = useNetwork();
  if (signer)
    return (
      <>
        <p>Your account addres is {signer._address}</p>
        <p>Connected to the {chain.name} network</p>
        <button onClick={() => signTransaction(signer)}>Sign</button>
        <WalletBalance></WalletBalance>
        <ApiInfo></ApiInfo>
      </>
    );
  else if (isLoading)
    return (
      <>
        <p>Loading.....</p>
      </>
    );
  else
    return (
      <>
        <p>Connect account to continue, ser</p>
      </>
    );
}

function WalletBalance() {
  const { data: signer } = useSigner();
  const { data, isError, isLoading } = useBalance({
    address: signer._address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}

function ApiInfo() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://random-data-api.com/api/v2/users")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <h1>{data.username}</h1>
      <p>{data.email}</p>
    </div>
  );
}

function WinningProposal() {
  const { data: signer } = useSigner();
  return (
    <button
      onClick={() => {
        getProposals(signer);
      }}
    >
      Get Winning Proposal
    </button>
  );
}

function getProposals(signer) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  fetch("http://localhost:3001/getProposals", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      getProposals(data);
    });
}
