//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";

uint32 constant FEE_BASIS = 10000;
uint32 constant TOTAL_BASIS = (100 * FEE_BASIS);

contract StoreBuilder is Ownable, PullPayment {
  string title;
  uint32 defaultFeePoints;
  BrainStore[] stores;

  event BrainStoreCreated(address storeAddress);
  event Received(address, uint);

  constructor(string memory _title, uint32 _defaultFeePoints) {
    console.log("Deploying a StoreBuilder");
    title = _title;
    defaultFeePoints = _defaultFeePoints;
  }

  function createStore(string memory _title) public returns (address) {
    BrainStore store = new BrainStore(_title, defaultFeePoints);
    stores.push(store);
    emit BrainStoreCreated(address(store));
    store.transferOwnership(msg.sender);
    return address(store);
  }

  function getStores() public view returns (BrainStore[] memory _stores) {
    _stores = new BrainStore[](stores.length);
    uint count;
    for(uint i=0;i<stores.length; i++){
      _stores[count] = stores[i];
      count++;
    }
  }

function getTitle() public view returns (string memory _title) {
_title = title;
}

  function sweepStores() public {
    for(uint i=0;i<stores.length; i++){
        stores[i].sweep();
    }
  }

  function collectFees() public {
    for(uint i=0;i<stores.length; i++){
      stores[i].withdrawPayments(payable(address(this)));
    }
  }

  function transferFees() public onlyOwner {
    _asyncTransfer(owner(), address(this).balance);
  }

  receive() external payable {
    emit Received(msg.sender, msg.value);
  }
}

contract BrainStore is Ownable, PullPayment {
  string title;
  uint32 feePoints;
  address feeProvider;

  event Received(address, uint);

  constructor(string memory _title, uint32 _feePoints) {
    console.log("Deploying a BrainStore", _title, _feePoints);
    feeProvider = msg.sender;
    title = _title;
    feePoints = _feePoints;
  }

  function setFee(uint32 _feePoints) public {
    require(msg.sender == feeProvider, "only the feeProvider can change the fee");

    console.log("Setting Store Fee:", title, _feePoints);
    feePoints = _feePoints;
  }

  function getFee() public view returns (uint32 _feePoints) {
      return feePoints;
  }

  function getBalance() public view returns (uint256 _inboxBalance) {
    return address(this).balance;
  }
  function getOwnerBalance() public view returns (uint256 _inboxBalance) {
    return getBalance() - getFeeBalance();
  }

  function getFeeBalance() public view returns (uint256 _inboxFees) {
    return getBalance() * feePoints / TOTAL_BASIS;
  }

  function sweep() public returns (uint256 _withdrawAmount) {
    uint256 amount = getBalance();
    _splitTransfer(amount);
    return amount;
  }

  function getTitle() public view returns (string memory _title) {
      return title;
  }

  function makePayment() public payable {
    emit Received(msg.sender, msg.value);
    _splitTransfer(msg.value);
  }

  function _splitTransfer(uint256 amount) internal {
    uint256 feeValue = amount * feePoints / TOTAL_BASIS;
    _asyncTransfer(feeProvider, feeValue);
    _asyncTransfer(owner(), amount - feeValue);
  }

  receive() external payable {
    emit Received(msg.sender, msg.value);
  }
}

contract StoreBuilderFactory {
  string greeting;
  StoreBuilder[] builders;

  constructor() {
    console.log("Deploying a StoreBuilderFactory");
  }

  event StoreBuilderCreated(address builderAddress, uint32 feePoints);

  function createStoreBuilder(string memory _title, uint32 _feePoints) public returns (address) {
    StoreBuilder builder = new StoreBuilder(_title, _feePoints);
    builders.push(builder);
    emit StoreBuilderCreated(address(builder), _feePoints);
    builder.transferOwnership(msg.sender);
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
