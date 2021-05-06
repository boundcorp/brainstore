import React, { useEffect, useState } from "react";
import "../App.css";
import { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { StoreBuilderContext } from '../hardhat/SymfoniContext';
import {ethers} from "ethers";
import {StoreBuilder} from "../hardhat/typechain/StoreBuilder";

interface RouteParams {
  address: string
}

export default function BuilderPage() {
  let Builder = useContext(StoreBuilderContext)

  const [builder, setBuilder] = useState<StoreBuilder>()

  const history = useHistory();
  const params = useParams<RouteParams>();
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState("");
  const [storeTitle, setStoreTitle] = useState("")

  useEffect(() => {
      const doAsync = async () => {
          if (!Builder.factory || !Builder.instance) return
          if (!builder) {
            console.log("DO AN ATTACH")
            setBuilder(await Builder.factory.attach(params.address))
          } else {
            console.log("Builder is deployed at ", builder.address)
            setReady(builder.address)
            setStoreTitle(await builder.getTitle())
          }
      };
      doAsync();
  }, [Builder, builder])

  if(!ready)
    return <>Loading...</>

  return (
    <header className="header builder">
      <div className="card">
        <h1 className="header-title">StoreBuilder: {storeTitle}</h1>
        
        <table className="table">
          <caption>
            <h2 className="subheader-title">2 BrainStores Deployed</h2>
            <button className="button builder">Withdraw ~17.4Ξ</button>
            <br />
          </caption>
          <thead>
            <tr>
              <th>Title</th>
              <th>Fee</th>
              <th>Lifetime Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>LeeTV</td>
              <td>5%</td>
              <td>32.7Ξ</td>
            </tr>
            <tr>
              <td>GamePray</td>
              <td>1%</td>
              <td>2.2Ξ</td>
            </tr>
          </tbody>
        </table>
        <hr className="rounded-divider builder" />
        <h2 className="subheader-title">Build a New BrainStore:</h2>
        <form>
          <div className="input-field">
            <label className="input-label" htmlFor="title">
              BrainStore Title:
            </label>
            <input type="text" className="input title" id="title" />
          </div>
          <div className="input-field">
            <label className="input-label" htmlFor="fee">
              Default Fee:
            </label>
            <input
              type="text"
              className="input fee"
              id="fee"
              defaultValue="5%"
            />
          </div>
          <button className="button builder">Deploy</button>
        </form>
      </div>
    </header>
  );
}
