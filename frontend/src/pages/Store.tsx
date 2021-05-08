import React, { useContext, useEffect, useState } from "react";
import { BrainStore } from "../hardhat/typechain/BrainStore";

import "../App.css";
import { useHistory, useParams } from "react-router-dom";
import { BrainStoreContext } from "../hardhat/SymfoniContext";

interface RouteParams {
  address: string;
}

export default function StorePage() {
  let Store = useContext(BrainStoreContext);
  const [store, setStore] = useState<BrainStore>();
  const [storeTitle, setStoreTitle] = useState("");
  const [balance, setBalance] = useState<string>();
  const [status, setStatus] = useState("");
  const [payAmount, setPayAmount] = useState<string>();
  const params = useParams<RouteParams>();
  const history = useHistory();

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

  const withdraw = async () => {
    if (!store) {
      setStatus("Wait for the store to deploy first!");
    } else {
      const tx = await store.withdrawPayments(await store.owner());
      console.log("withdrawl success", tx);
    }
  };

  const pay = async () => {
    if (!store) {
      setStatus("Wait for the store to deploy first!");
    } else {
      history.push({
        pathname: `/store/${store.address}/pay/${payAmount}`,
      });
    }
  };

  if (!store) return <>Loading...</>;

  return (
    <header className="header store">
      <div className="card">
        <h1 className="header-title">My BrainStore:<br />{storeTitle}</h1>
        <button className="button store" onClick={withdraw}>
          Withdraw {balance} Ξ
        </button>
        <hr className="rounded-divider store" />
        <form>
          <input
            type="number"
            className="input fee"
            id="pay_amount"
            onChange={(e) => setPayAmount(e.target.value)}
          />
          <label className="input-label small-margin" htmlFor="pay_amount">
            Ξ
          </label>
          <button className="button store" onClick={pay}>
            Get Paid
          </button>
        </form>
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
