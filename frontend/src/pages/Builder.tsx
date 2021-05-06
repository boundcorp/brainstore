import React, { useEffect, useState } from "react";
import "../App.css";
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { StoreBuilderContext } from '../hardhat/SymfoniContext';

export default function BuilderPage() {
  const builder = useContext(StoreBuilderContext)
  const history = useHistory();
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState("");
  const [storeTitle, setStoreTitle] = useState("")
  
  useEffect(() => {
      const doAsync = async () => {
          if (!builder.instance) return
          console.log("Builder is deployed at ", builder.instance.address)
          setReady(builder.instance.address)
          setStoreTitle(await builder.instance.getTitle())
      };
      doAsync();
  }, [builder])

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
