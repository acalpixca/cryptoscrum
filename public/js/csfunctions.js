// import {vault} from '../data/vault.js';

let vault = new Map();

vault.set("Eva", {
    "address": "bchtest:tb1qzmu6ukqt9g06jwvwmm7lhsx639t2cft06tjaq7",
    "privKey": "cUsFLWSywC1sxmp1bxXcyGnH2gxfQ4Pmdu15mommLC1Akipw54gM",
    "pubKey": "vpub5W5bFm7LnA49VmpSo2dndt7bVLKMbSdcNSnC9rnuWbzNxExAYVJmunXpm8q4tjm1TaF5e9uWHyLy16vjkebnDqqBbzq4qGeR1nxiuSCxJ1h"
    });

vault.set("Carla", {
    "address": "bchtest:tb1qqkasag0vwzl3czp2nxye8v8wmg6xuchtc38hah",
    "privKey": "cPfydUSeBzCzeQ3YZrTwC1FVrNFzZTwnJq2j3uor9pdUzyqp63T9",
    "pubKey": "02bd541ddc73c8609a55da865cebac0a152662eb0808373766348866040c37cd7e"
},);

vault.set("Luis", { 
    "address": "bchtest:tb1qpfesznn7p2sgltwnvh6ljlvj8xdmandt4udmyk",
    "privKey": "",
    "pubKey": "034342672454839044bc55adfa527742380a1f612d423c8a21162e3ad37abd817b"
});

vault.set("Pedro", {
    "address": "bchtest:tb1q4fadtkezuqdjzvkyagtzty8tq3tguf9grqqj47",
    "privKey": "",
    "pubKey": "0362e100c7408b3fcc0515ef8296d85dc545ac69707b43906a641c591ae2873282"
});

vault.set("Lola", {
    "address": "bchtest:tb1qzrpmnc6u73kepy99vmecx8t948v89hsepnkrwj",
    "privKey": "",
    "pubKey": "03b496a1047ec7f0f1569907c244f7cb1ee2e08d6724dc2bcb1398405b96b14253"
});

vault.set("Management", {
    "address": "bchtest:tb1qpyqjcqmdprnvp8n5dtu2zqpmu3l8dnfang5g6t",
    "privKey": "cNU1KVFyj83c17DpgasQdZWPUiCV4PR35qxoEh8NY29XwP3kfYDx",
    "pubKey": "0315e87f9b6a177c2185fa482794bd14c39178e51fd99fd91955555edf2b7b00fb"
});


const {
  CashCompiler,
  ElectrumNetworkProvider,
  Contract,
  SignatureTemplate,
} = require('cashscript');

function createSmartContractString() {
  let contractStr = "pragma cashscript ^0.5.6;\n\n";
  contractStr +="";
  contractStr += "contract RewardSuccessfulUserStory(pubkey sender, pubkey recipient) {\n";
  contractStr +="\tfunction transferStorySuccess(sig recipientSig) {\n";
  contractStr +="\t\trequire(checkSig(recipientSig, recipient));\n";
  contractStr +="\t}\n\n";
  contractStr +="\tfunction reclaimStoryFailure(sig senderSig) {\n";
  contractStr +="\t\trequire(checkSig(senderSig, sender));\n";
  contractStr +="\t}\n";
  contractStr +="}\n";
  return(contractStr);
}

console.log("I'm generating the contract string");
console.log(createSmartContractString());

async function createSmartContract(senderPub, receiverPub) {
  // Compile the TransferWithTimeout contract
  // sender.pubKey, sender.privKey
  const artifact = CashCompiler.compileString(createSmartContractString());
  const provider = new ElectrumNetworkProvider('testnet');
// eva mgr sends, carla receives

  const contract = new Contract(artifact, [senderPub, receiverPub] , provider);
  console.log('contract address:', contract.address);
  console.log('contract balance:', await contract.getBalance());
  return(contract);
}

async function payOutSprintSuccessful(contract, receiverAddress, receiverPriv, amount) {
  const txDetails = await contract.functions
  .transferStorySuccess(new SignatureTemplate(receiverPriv))
  .to(receiverAddress, amount)
  .send();
  console.log(txDetails);
}

async function recoverFundsSprintFailed(contract, senderAddress, senderPriv, amount) {
  const txDetails = await contract.functions
  .reclaimStoryFailure(new SignatureTemplate(senderPriv))
  .to(senderAddress, amount)
  .send();
  console.log(txDetails);
}

async function run() {
  console.log("Now let's create the contract.");
  let contract = await createSmartContract(vault.get("Management").pubKey, vault.get("Carla").pubKey);
  console.log("Now the sprint has been successful. Carla to get 1 mBTC");


  
  try {
    await payOutSprintSuccessful(contract, vault.get("Carla").address, vault.get("Carla").privKey, 1);
  }
  catch(error) {
    console.log(error);
  }
  finally {
    console.log("\nMaybe it's time to find another job...\nGood night!");
  }
}

run();


