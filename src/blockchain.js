/**
 *                          Blockchain Class
 *  The Blockchain class contain the basics functions to create your own private blockchain
 *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message` 
 *  to verify a message signature. The chain is stored in the array
 *  `this.chain = [];`. Of course each time you run the application the chain will be empty because and array
 *  isn't a persisten storage method.
 *  
 */
 const SHA256 = require('crypto-js/sha256');
 const BlockClass = require('./block.js');
 const bitcoinMessage = require('bitcoinjs-message');
 class Blockchain {
     /**
      * Constructor of the class, you will need to setup your chain array and the height
      * of your chain (the length of your chain array).
      * Also everytime you create a Blockchain class you will need to initialized the chain creating
      * the Genesis Block.
      * The methods in this class will always return a Promise to allow client applications or
      * other backends to call asynchronous functions.
      */
     constructor() {
         this.chain = [];
         this.height = -1;
         this.initializeChain();
     }
     /**
      * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
      * You should use the `addBlock(block)` to create the Genesis Block
      * Passing as a data `{data: 'Genesis Block'}`
      */
      async initializeChain() {
         if( this.height === -1){
             let block = new BlockClass.Block({data: 'Genesis Block'});
             await this._addBlock(block);
         }
     }
  getChainHeight() {
         return new Promise((resolve, reject) => {
             resolve(this.height);
         });
     }
  _addBlock(block) {
         let self = this;
         return new Promise(async (resolve, reject) => {
             block.height=this.chain.length;
             block.time=new Date().getTime().toString().slice(0,-3);
             if(this.chain.length>0){
             block.previousBlockHash=this.chain[this.chain.length-1].hash;
             
             }
             block.hash=SHA256(JSON.stringify(block)).toString();
           this.chain.push(block)
           resolve(block)
         });
        
     }
 requestMessageOwnershipVerification(address) {
         return new Promise(async (resolve) => {
             resolve(`${address}:${new Date().getTime().toString().slice(0,-3)}:starRegistry`)
         })
     }
 submitStar(address, message, signature, star) {
         let self = this;
         return new Promise(async (resolve, reject) => {
             const time = parseInt(message.split(':')[1]);
             let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
             if (currentTime - time > 300) {         
                 //make sure the message is signed first
                 if (!bitcoinMessage.verify(message, address, signature)) {               
                          return reject(new Error('Bitcoin message unverified.'));                }
                 //Now add send the object into the blocks
                 const data = { owner: address, star: star     } 
                 //create star object
                 const block = new BlockClass.Block(data);     
                             resolve(await self._addBlock(block));
                 }         
                   return reject(new Error('Block must be added in less than 5 minutes.'));                })
                 
         
     }
 getBlockByHash(hash) {
         let self = this;
         return new Promise((resolve, reject) => {
             
                 let block = self.chain.filter(theblock => theblock.hash === hash)[0];
                 if (block) {
                    resolve(block);
                 }
             });
         
     }
  getBlockByHeight(height) {
         let self = this;
         return new Promise((resolve, reject) => {
             let block = self.chain.filter(p => p.height === height)[0];
             if(block){
                 resolve(block);
             } else {
                 resolve(null);
             }
         });
     }
  getStarsByWalletAddress (address) {
         let self = this;
         let stars = [];
         return new Promise((resolve, reject) => {
             for (const block in self.chain) {
                 const blockData=block.getBData()
                 if(blockData.owner===address){[...stars,blockData]}
               }
               resolve(stars)
         });
     }
        validateChain() {
         let self = this;
         let errorLog = [];
         return new Promise(async (resolve, reject) => {
             let blockChain=self.chain;
             for (const block in blockChain) {
                 console.log(blockChain)
                 if(block.validate===false){
                     console.log("Data didn't get validated");
                 }else if(block.previousBlockHash =this.chain[this.chain.length-1].hash){
                     console.log("error with previous blockhash");
                     errorLog.push(`Invalid check previousBlockHash: ${this.chain[this.chain.length-1] }`)
                     console.log(errorLog)
                 }
               }
         });
     }
 }
     
 module.exports.Blockchain = Blockchain;