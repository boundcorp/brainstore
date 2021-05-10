import React, { useEffect, useState, FC } from "react";
import "../App.css";
import { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  StoreBuilderContext,
  BrainStoreContext,
} from "../hardhat/SymfoniContext";
import { StoreBuilder } from "../hardhat/typechain/StoreBuilder";
import { BrainStore } from "../hardhat/typechain/BrainStore";
import {ethers} from "ethers";

interface RouteParams {
  address: string;
}

interface RowProps {
  address: string;
  builder: StoreBuilder;
}

const StoreRow: FC<RowProps> = ({ address, builder}) => {
  let Store = useContext(BrainStoreContext);

  const [store, setStore] = useState<BrainStore>();
  const [ready, setReady] = useState("");
  const [status, setStatus] = useState("")
  const [fee, setFee] = useState(0);
  const [title, setTitle] = useState("");
  const [balance, setBalance] = useState<string>();

  useEffect(() => {
    const doAsync = async () => {
      if (!Store.factory) return;
      if (!store) {
        setStore(await Store.factory.attach(address));
      } else {
        console.debug("Store is deployed at ", store.address);
        setReady(store.address);
        setTitle(await store.getTitle());
        setFee((await store.getFee()) / 10000);
        setBalance(await (await store.payments(builder.address)).toString());
      }
    };
    doAsync();
  }, [Store, store, builder]);

  const withdraw = async () => {
    if (!builder) {
      setStatus("Wait for the builder to deploy first!");
    } else {
      const tx = await builder.withdrawPayments(await builder.address);
      console.log("withdrawl success", tx);
    }
  };
  return (
    <>
      <td>{title || address}</td>
      <td>{fee}%</td>
      <td><button onClick={withdraw}>Widthdraw {ethers.utils.formatEther(balance || "0")} Ξ</button>{status}</td>
    </>
  );
};

export default function BuilderPage() {
  let Builder = useContext(StoreBuilderContext);


  const [builder, setBuilder] = useState<StoreBuilder>();

  const history = useHistory();
  const params = useParams<RouteParams>();
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState("");
  const [fee, setFee] = useState(0);
  const [title, setTitle] = useState("");
  const [builderTitle, setBuilderTitle] = useState("");
  const [balance, setBalance] = useState<string>();

  const [stores, setStores] = useState<string[]>();

  document.title = `Builder: ${builderTitle}`;

  useEffect(() => {
    const doAsync = async () => {
      if (!Builder.factory || !Builder.instance) return;
      if (!builder) {
        setBuilder(await Builder.factory.attach(params.address));
      } else {
        console.debug("Builder is deployed at ", builder.address);
        setReady(builder.address);
        setBuilderTitle(await builder.getTitle());
        setStores(await builder.getStores());
        setFee((await builder.getDefaultFee()) / 10000);
        setBalance(
          await (await builder.payments(await builder.owner())).toString()
        );
      }
    };
    doAsync();
  }, [Builder, builder]);

  const deploy = async () => {
    if (!builder) {
      setStatus("Wait for the builder to deploy first!");
    } else {
      setStatus("Transaction Prompt");
      const tx = await builder.createStore(title);
      setStatus("Deploying....");
      const receipt = await tx.wait(0);
      if (receipt.events)
        receipt.events.map((event) => {
          if (event.event === "BrainStoreCreated" && event.args) {
            setStatus(`Deployed to ${event.args.storeAddress}`);
            history.push(`/store/${event.args.storeAddress}`);
          }
        });
    }
  };

  const withdraw = async () => {
    if (!builder) {
      setStatus("Wait for the builder to deploy first!");
    } else {
      const tx = await builder.withdrawPayments(await builder.owner());
      console.log("withdrawl success", tx);
    }
  };

  const collect = async () => {
    if (!builder) {
      setStatus("Wait for the builder to deploy first!");
    } else {
      const tx = await builder.collectFees();
      console.log("collect fees success", tx);
      setBalance(
        await (await builder.payments(await builder.owner())).toString()
      );
    }
  };

  if (!ready || !builder || !stores) return <>Loading...</>;

  const deployedString = `${stores.length} BrainStore${stores.length === 1 ? '' : 's'} Deployed`

  return (
    <header className="header builder">
      <div className="card">
        <h1 className="header-title">StoreBuilder: {builderTitle}</h1>

        <table className="table">
          <caption>
              <h2 className="subheader-title">{deployedString}</h2>
             
            
            <button className="button builder" onClick={collect}>
              Collect Fees
            </button>
            <button className="button builder" onClick={withdraw}>
              Withdraw {ethers.utils.formatEther(balance || "0")} Ξ
            </button>
            <br />
          </caption>
          <thead>
            <tr>
              <th>Title</th>
              <th>Fee</th>
              <th>Holding Balance</th>
            </tr>
          </thead>
          <tbody>
            {stores?.map((address) => (
              <tr key={address}>
                <StoreRow
                  address={address}
                  builder={builder}
                ></StoreRow>
              </tr>
            ))}
          </tbody>
        </table>
        <hr className="rounded-divider builder" />
        <h2 className="subheader-title">Build a New BrainStore:</h2>
        <form>
          <div className="input-field">
            <label className="input-label" htmlFor="title">
              BrainStore Title:
            </label>
            <input
              type="text"
              className="input title"
              id="title"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="fee">
              Vendor Fee:
            </label>
            <input
              type="text"
              className="input fee"
              id="fee"
              value={fee + "%"}
              disabled
            />
          </div>
          <button className="button builder" onClick={deploy}>
            Deploy
          </button>
        </form>
      </div>
    </header>
  );
}
