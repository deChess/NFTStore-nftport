import React, { useEffect, useState, useContext } from 'react'
import {DefaultButton, PrimaryButton, DangerButton, BrandButton} from 'pivotal-ui/react/buttons';
import moralis from "moralis";
import { ethers } from 'ethers'
import axios from 'axios';
import {Panel} from 'pivotal-ui/react/panels';
import {Grid, FlexCol} from 'pivotal-ui/react/flex-grids';
import {Input} from 'pivotal-ui/react/inputs';
import {Checkbox} from 'pivotal-ui/react/checkbox';

import o2x from 'object-to-xml';
import Web3 from 'web3';


moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

const MintNFT = () => {
  // ----- useState
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile,   setImageFile]   = useState(null)
  const [account,     setAccount]     = useState('')
  const [imageHash,   setImageHash]   = useState('');
  const [imageUrl,    setImageUrl]    = useState('upload-image.png')
  const [message,     setMessage]     = useState('') 
  const [address,     setAddress]     = useState('Connect')
  
  const NFTItem = moralis.Object.extend( "NFTItem", { /* Instance methods*/ }, {  
    newNFTItem: function(fileHash,ContractAddress,txHash,fileName, title,description,uri,metadata) { 
      const nft = new NFTItem();
      nft.set( "fileHash",        fileHash                );
      nft.set( "title",           title                   );
      nft.set( "description",     description             );
      nft.set( "contractAddress",  ContractAddress        );
      nft.set( "txHash",          txHash                  );
      nft.set( "fileName",        fileName                );
      nft.set( "uri",             uri                     );
      nft.set( "metadata",         metadata                );
      return nft; 
    }
   });        

  const checkMintable = async () => { 
      if ( title != '' && description != '' && address != 'Connect' ){
          doMint();
      }else{
        alert( 'not mintable, need more info' );        //TODO
      }
  }

  const onFileChange = event => {
    var reader;
	setImageFile(event.target.files[0]);
    reader = new FileReader();
    reader.onload = function(e) { setImageUrl( e.target.result ); }
    reader.readAsDataURL(event.target.files[0]);
  };

  const doMint = async () => {   
    setMessage( 'Uploading to IPFS!' );
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let   data = new FormData();
    let fileName = '';
    data.append("file", imageFile, imageFile.name );
    fileName = imageFile.name;
    const res = await axios.post(   url, data, {  maxContentLength: "Infinity", 
      headers: { "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: process.env.REACT_APP_PINATA_PUBLIC,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_PRIVATE,
        },
      });
    console.log(res.data);
    setImageHash( res.data.IpfsHash );
    setImageUrl( 'https://gateway.pinata.cloud/ipfs/' + res.data.IpfsHash );
    setMessage( 'Successfully uploaded to IPFS. Now Minting NFT! Please Wait!' );
    const fileuri = "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash;
    const metadatajson = '{ "name": "' + title +'", "description": "'+ description + '","file_uri": "' + fileuri + '" }';
    const metadataurl = 'https://api.nftport.xyz/ipfs_upload_metadata';
    const resMetaData = await axios.post( metadataurl, metadatajson, { headers: { "Content-Type": "application/json", "Authorization" : "c0d1ad1d-c062-4e4e-be42-983a11cc044e" },   });
    console.log(resMetaData.data);
    const metadatauri = resMetaData.data.metadata_ipfs_uri;

    const contractAddress = "0x0AEe6e01D4bD12A9D80AA2fa64A2b53093FafDA7";
    const nftporturl = 'https://api.nftport.xyz/mint_nft';
    const mintData = { 
      "chain": "polygon",
      "contract_address": "0x0aee6e01d4bd12a9d80aa2fa64a2b53093fafda7", 
      "metadata_uri": metadatauri,
      "mint_to_address": address };
    const resMint = await axios.post(   nftporturl, mintData, {  maxContentLength: "Infinity", 
    headers: { "Content-Type": "application/json", "Authorization" : "c0d1ad1d-c062-4e4e-be42-983a11cc044e" },   });
    console.log(resMint.data);
    const tokenurl = 'https://api.nftport.xyz/get_minted_nft?chain=polygon&transaction_hash=' + resMint.data.transaction_hash;
    const resToken = await axios.get(   tokenurl, { headers: { "Content-Type": "application/json", "Authorization" : "c0d1ad1d-c062-4e4e-be42-983a11cc044e" },   });
    console.log(resToken.data);
    const item = NFTItem.newNFTItem(res.data.IpfsHash,contractAddress,resMint.data.transaction_hash,fileName,title,description,'https://gateway.pinata.cloud/ipfs/' + res.data.IpfsHash,metadatajson);
    item.save();
    setMessage( 'Minting Complete!' );   
   }
	
	const { ethereum } = window;
	let currentAccount = null;
	function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
    } else if (accounts[0] !== currentAccount) {
      [currentAccount] = accounts;
      setAddress(currentAccount);
    }
  }
	ethereum.on('accountsChanged', handleAccountsChanged);
	
	const connect = async () => {
	  if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' }).then(handleAccountsChanged);
        setAddress(currentAccount);
        // eslint-disable-next-line no-console
      } catch (error) { console.log('error connecting to metamask '); }
    }
  }
	
  return (
    <div className="App" >
     <ul className='menu'>
        <li className='menuitem' ><a href='https://siasky.net/AQA4gHlOmNSiKkSpeGWHf1ellffeB_-LmhSzvxF8Wj9Tjg/#/play' >Play</a></li>
        <li className='menuitem' ><a href='/store' >Store</a></li>
        <li className='menuitem' ><a href='/collection' >Collection</a></li>
        <li className='menuitem' id="mintlink" ><a href='/mint' >Mint</a></li>
        <li id="connect" className='menuitem' ><a id='connect' onClick={connect} >{address}</a></li>
    </ul><br/><br/>

      <div id="imageDiv">
        <img id="preview" src={imageUrl} /><br/><br/>
        
    </div>
    <div id="form">
      <span className="label" >Title</span><br/>
      <input placeholder='Enter Title' type="text" value={title} onChange={(e) => setTitle(e.target.value)} /><br/><br/>
      <span className="label" >Description</span><br/>
        <input placeholder='Enter Description'  type="text" value={description} onChange={(e) => setDescription(e.target.value)} /><br/><br/>
      <input type="file" onChange={onFileChange} /><br/><br/>
      <button onClick={(e) => {checkMintable();} } id="mintButton" >Mint</button><br/>
      <br/><br/>{message}<br/><br/><div id="loading" ><img src="loading.gif" /></div>
    </div>
   </div>
  )
}

export default MintNFT
