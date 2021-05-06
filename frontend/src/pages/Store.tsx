import React, { useEffect, useState } from 'react';

import "../App.css";

export default function StorePage() {
  
    return (
        <header className="header store">
        <div className="card">
          <h1 className="header-title">My BrainStore: LeeTV</h1>
          <button className='button store'>Withdraw ~17.4Ξ</button><br />
          <a className='external-link' href='#'>View on Etherscan</a>
        </div>
      </header>
    )
}