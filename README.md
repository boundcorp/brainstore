# BrainStore

![cover photo](https://github.com/boundcorp/brainstore/blob/master/docs/cover-photo.png)

This project is a simple solidity SmartContract of a 3-layer self-service Factory pattern, with a hardhat + react frontend; the initial Factory contract is deployed to allow anyone to create a Marketplace ("Store Builder") - the owner of that Marketplace is then a self-service interface for content creators to deploy a new BrainStore, which is just a direct payments gateway with fee splitting logic.

Crucially, the content creator is the actor who deploys and controls the BrainStore contract; the content creator can transfer ownership, update the title, withdraw funds, and perform all control functions on the BrainStore, except for adjusting the feeBasis quantity and feeProvider address.

# Before BrainStore
![before brainstore](https://github.com/boundcorp/brainstore/blob/master/docs/traditional-saas-marketplace.png)

# After BrainStore
![with brainstore](https://github.com/boundcorp/brainstore/blob/master/docs/brainstore-marketplace.png)
