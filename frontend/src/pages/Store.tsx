import React, { useContext, useEffect, useState } from "react";
import { BrainStore } from "../hardhat/typechain/BrainStore";

import "../App.css";
import { useParams } from "react-router-dom";
import { BrainStoreContext } from "../hardhat/SymfoniContext";

interface RouteParams {
  address: string;
}

export default function StorePage() {
  let Store = useContext(BrainStoreContext);
  const [store, setStore] = useState<BrainStore>();
  const [storeTitle, setStoreTitle] = useState("");
  const [balance, setBalance] = useState<string>();

  const params = useParams<RouteParams>();

  useEffect(() => {
    const doAsync = async () => {
      if (!Store.instance) return;
      if (!store) {
        setStore(await Store.instance.attach(params.address));
      } else {
        console.debug("Store is deployed at ", store.address);
        setStoreTitle(await store.getTitle());
        setBalance(await (await store.getBalance()).toString());
      }
    };
    doAsync();
  }, [Store, store]);

  if (!store) return <>Loading...</>

  return (
    <header className="header store">
      <div className="card">
        <h1 className="header-title">My BrainStore: {storeTitle}</h1>
        <button className="button store">Withdraw {balance} Ξ</button>
        <br />
        <a
          className="external-link"
          href={`http://www.etherscan.io/address/${store.address}`}
        >
          View on Etherscan
        </a>
      </div>
    </header>
  );
}
