import React from 'react';
import "../App.css";

export default function FactoryPage() {
    return (
        <header className="header factory">
        <div className="card">
          <h1 className="header-title">BrainStore MarketPlace Factory</h1>
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
            <div className='input-field'>
            <label className="input-label" htmlFor='title'>
              Title:
            </label>
            <input type="text" className="input title" id='title' />
            </div>
            <div className='input-field'>
            
            <label className="input-label" htmlFor='fee'>
              Default Fee:
            </label>
            <input type="text" className="input fee" id='fee' defaultValue='5%' />
            </div>
            <button className='button factory'>Deploy</button>
          </form>
        </div>
      </header>
    )
}