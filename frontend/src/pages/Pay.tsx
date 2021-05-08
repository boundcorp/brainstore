import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import { BrainStoreContext } from "../hardhat/SymfoniContext";
import { BrainStore } from "../hardhat/typechain/BrainStore";

interface RouteParams {
  address: string;
  amount: string;
}

export default function PayPage() {
  let Store = useContext(BrainStoreContext);
  const [store, setStore] = useState<BrainStore>();
  const [storeTitle, setStoreTitle] = useState("");
  const params = useParams<RouteParams>();
  const [status, setStatus] = useState("");

  const pay = async () => {
    if (!store) {
      setStatus("Wait for the store to deploy first!");
    } else {
      const tx = await store.makePayment({
        value: ethers.utils.parseEther(params.amount),
      });
    }
  };

  useEffect(() => {
    const doAsync = async () => {
      if (!Store.instance) return;
      if (!store) {
        setStore(await Store.instance.attach(params.address));
      } else {
        console.debug("Store is deployed at ", store.address);
        setStoreTitle(await store.getTitle());
      }
    };
    doAsync();
  }, [Store, store]);

  return (
    <header className="header pay">
      <div className="card">
        <h1 className="header-title">Send Ether</h1>
        <h2 className="subheader">BrainStore: {storeTitle}</h2>
        <button className="button pay" onClick={pay}>
          Pay {params.amount}Ξ
        </button>
      </div>
    </header>
  );
}
