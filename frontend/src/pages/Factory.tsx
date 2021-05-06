import React, { useContext, useEffect, useState } from "react";
import "../App.css";
import { StoreBuilderFactoryContext } from "../hardhat/SymfoniContext";
import { useHistory } from "react-router";

export default function FactoryPage() {
  const factory = useContext(StoreBuilderFactoryContext);
  const history = useHistory();
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState("");
  const [fee, setFee] = useState(5);
  const [title, setTitle] = useState("");
  useEffect(() => {
    const doAsync = async () => {
      if (!factory.instance) return;
      console.debug("Factory is deployed at ", factory.instance.address);
      setReady(factory.instance.address);
    };
    doAsync();
  }, [factory]);

  const deploy = async () => {
    if (!factory.instance) {
      setStatus("Wait for the factory to deploy first!");
    } else {
      setStatus("Transaction Prompt");
      const tx = await factory.instance.createStoreBuilder(title, fee * 10000);
      setStatus("Deploying....");
      const receipt = await tx.wait(0);
      if (receipt.events)
        receipt.events.map((event) => {
          if (event.event == "StoreBuilderCreated" && event.args) {
            setStatus(`Deployed to ${event.args.builderAddress}`);
            history.push(`/builder/${event.args.builderAddress}`);
          }
        });
    }
  };
  if (!ready) return <>Loading...</>;

  return (
    <header className="header factory">
      <div className="card">
        <h1 className="header-title">BrainStore MarketPlace Factory</h1>
        {status ? <h2>{status}</h2> : null}
        <h2 className="subheader">
          <div className="subheader-line">
            BrainStore helps <b>content creators</b> run managed storefronts
            with Web3 Payments!
          </div>
          <div className="subheader-line">
            Are you building a <b>Web2-or-3 marketplace</b> for content
            creators?
          </div>
          <div className="subheader-line">
            Use Marketplace Factory to launch a{" "}
            <b>non-custodial Store Builder</b> for your customers.
          </div>
          <div className="subheader-line">
            Each customer deploys a <b>BrainStore</b>, which sells their goods
            or services.
          </div>
          <div className="subheader-line">
            Transaction fees are <b>automatically</b> paid back to the
            Marketplace!
          </div>
        </h2>
        <hr className="rounded-divider factory" />
        <form>
          <div className="input-field">
            <label className="input-label" htmlFor="title">
              Title:
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
              Default Fee %:
            </label>
            <input
              type="number"
              className="input fee"
              id="fee"
              defaultValue={fee}
              onChange={(e) => setFee(parseInt(e.target.value))}
            />
          </div>
          <button className="button factory" onClick={deploy}>
            Deploy
          </button>
        </form>
      </div>
    </header>
  );
}
