//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";

contract StoreBuilder {
  address owner;
  string title;
  uint8 defaultFeePoints;
  BrainStore[] stores;

  constructor(string memory _title, uint8 _defaultFeePoints) {
    console.log("Deploying a StoreBuilder");
    owner = msg.sender;
    title = _title;
    defaultFeePoints = _defaultFeePoints;
  }

  function createStore(string memory _title) public returns (address) {
    BrainStore store = new BrainStore(_title, defaultFeePoints);
    stores.push(store);
    return address(store);
  }

}

contract BrainStore {
  address owner;
  string title;
  uint8 feePoints;
  address feeProvider;

  constructor(string memory _title, uint8 _feePoints) {
    console.log("Deploying a BrainStore", _title, _feePoints);
    owner = msg.sender;
    title = _title;
    feePoints = _feePoints;
  }

  function setFee(uint8 _feePoints) public {
    require(msg.sender == feeProvider, "only the feeProvider can change the fee");

    console.log("Setting Store Fee:", title, _feePoints);
    feePoints = _feePoints;
  }

  function getFee() public view returns (uint8 _feePoints) {
      return feePoints;
  }

  function getTitle() public view returns (string memory _title) {
      return title;
  }

}

contract StoreBuilderFactory {
  string greeting;
  StoreBuilder[] builders;

  constructor() {
    console.log("Deploying a StoreBuilderFactory");
  }

  event StoreBuilderCreated(address builderAddress, uint8 feePoints);

  function createStoreBuilder(string memory _title, uint8 _feePoints) public returns (address) {
    StoreBuilder builder = new StoreBuilder(_title, _feePoints);
    builders.push(builder);
    emit StoreBuilderCreated(address(builder), _feePoints);
    return address(builder);
  }


 function getStoreBuilders() public view returns (StoreBuilder[] memory _builders) {
   _builders = new StoreBuilder[](builders.length);
   uint count;
   for(uint i=0;i<builders.length; i++){
      _builders[count] = builders[i];
      count++;
    }
  }
}
