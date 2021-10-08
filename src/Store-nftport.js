import React, { useEffect, useState, useContext } from 'react'
import moralis from "moralis";
import { ethers } from 'ethers'
import axios from 'axios';
import Web3 from 'web3';

moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

const Store = () => {

  const NFTItem = moralis.Object.extend( "NFTItem", { /* Instance methods*/ }, {  
      newNFTItem: function(fileHash,ContractAddress,txHash,fileName, title,description) { 
      const nft = new NFTItem();
      nft.set( "fileHash",        fileHash                );
      nft.set( "title",           title                   );
      nft.set( "description",     description             );
      nft.set( "contractAddress",  ContractAddress        );
      nft.set( "txHash",          txHash                  );
      nft.set( "fileName",        fileName                );
      return nft; 
      }
   });

  return (
    <div className="App" >
      <ul className='menu'>
        <li className='menuitem' ><a href='https://siasky.net/AQA4gHlOmNSiKkSpeGWHf1ellffeB_-LmhSzvxF8Wj9Tjg/#/play' >Play</a></li>
        <li className='menuitem' id="storelink" ><a href='/store' >Store</a></li>
        <li className='menuitem' ><a href='/collection' >Collection</a></li>
        <li className='menuitem' ><a href='/mint' >Mint</a></li>
     </ul><br/><br/>
     <div id="saleitems">
      <a target="_blank" href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/53665472744807235249791170310948394177752375446118270685819935613848435818497"><img src='knight-opensea.png' /></a>
      <a target="_blank" href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/53665472744807235249791170310948394177752375446118270685819935614947947446273"><img src='king-opensea.png' /></a>
      <a target="_blank" href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/53665472744807235249791170310948394177752375446118270685819935616047459074049"><img src='queen-opensea.png' /></a>
      <br/>
      <a target="_blank" href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/53665472744807235249791170310948394177752375446118270685819935617146970701825"><img src='knight--white-opensea.png' /></a>
      <a target="_blank" href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/53665472744807235249791170310948394177752375446118270685819935619345993957377"><img src='king-white-opensea.png' /></a>
      <a target="_blank" href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/53665472744807235249791170310948394177752375446118270685819935618246482329601"><img src='queen-white-opensea.png' /></a></div>
      </div>
  )

}

export default Store
