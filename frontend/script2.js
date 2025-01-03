const connectWalletMessage = document.querySelector('#connectWalletMessage');
const connectWallet = document.querySelector('#connectWallet');
const votingStation = document.querySelector('#votingStation');
const timerTime = document.querySelector('#timerTime');
const timerMessage = document.querySelector('#timerMessage');
const mainBoard = document.querySelector('#mainBoard');
const voteForm= document.querySelector('#voteForm');
const vote = document.querySelector('#vote');
const voteButton = document.querySelector('#voteButton');
const showResultContainer = document.querySelector('#showResultContainer');
const showResult = document.querySelector('#showResult');
const result = document.querySelector('#result');
const admin = document.querySelector('#admin');
const candidates = document.querySelector('#candidates');
const electionDuration = document.querySelector('#electionDuration');
const startAnElection = document.querySelector('#startAnElection');
const candidate = document.querySelector('#candidate');
const addTheCandidate = document.querySelector('#addTheCandidate');

// configuring Ethers
const contractAddress = '0x52CAE2ad1F5eEA75D59F5F94BE7A5D5e5445451D';
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "numberOfVotes",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkElectionPeriod",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "electionStarted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "electionTimer",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "listOfVoters",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "resetAllVotersStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "retrieveVotes",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "numberOfVotes",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_candidates",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "_votingDuration",
        "type": "uint256"
      }
    ],
    "name": "startElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "voteTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_voter",
        "type": "address"
      }
    ],
    "name": "voterStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingEnd",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingStart",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

  let contract;
  let signer;

const provider = new ethers.providers.Web3Provider(window.ethereum, 80001);
provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts)=> {
        signer = provider.getSigner(accounts[0])
        contract = new ethers.Contract(contractAddress, contractABI, signer)
    });
});

// Functions

const getAllCandidates= async function() {
  if(document.getElementById("candidateBoard")){
    document.getElementById("candidateBoard").remove();
  }

  let board = document.createElement("table");
  board.id = "candidateBoard";
  mainBoard.appendChild(board);

  let tableHeader = document.createElement("tr");
  tableHeader.innerHTML = `<th>ID No.</th>
                            <th>Candidate</th>`;
  board.appendChild(tableHeader);

  let candidates = await contract.retrieveVotes();
  for(let i=0;i < candidates.length; i++){
    let candidate = document.createElement("tr");
    candidate.innerHTML = `<td>${parseInt(candidates[i][0])}</td>
                        <td>${candidates[i][1]}</td>`;
    board.appendChild(candidate);
  }
}

const getResult = async function () {
  result.style.display = "flex";

  if(document.getElementById('resultBoard')){
    document.getElementById('resultBoard').remove();
  }

  let resultBoard = document.createElement("table");
  resultBoard.id = "resultBoard";
  result.appendChild(resultBoard);

  let tableHeader = document.createElement("tr");
  tableHeader.innerHTML = `<th>ID No</th>
                            <th> Candiates</th>
                            <th> Number Of Votes</th>`;
  resultBoard.appendChild(tableHeader);

  let candidates = await contract.retrieveVotes();
  for(let i=0; i < candidates.length; i++){
    let candidate = document.createElement("tr");
    candidate.innerHTML = `<td>${parseInt(candidates[i][0])}</td>
                            <td>${candidates[i][1]}</td>
                            <td>${parseInt(candidates[i][2])}</td>`;
    resultBoard.appendChild(candidate);
  }
}

const refreshPage = function() {
  setInterval(async() => {
    let time = await contract.electionTimer();

    if(time > 0){
      timerMessage.innerHTML = `<span id="time">${time}</span> second/s left.`;
      voteForm.style.display = 'flex';
      showResultContainer.style.display = 'none';
    } else{
      timerMessage.textContent = "Either ther's no election yet or the election already ended";
      voteForm.style.display = 'none';
      showResultContainer.style.display = 'block';
    }
  }, 10000);

  setInterval(async() => {
    getAllCandidates();
  }, 10000);
}

const sendVote = async function() {
  await contract.voteTo(vote.value);
  vote.value = "";
}

const startElection= async function() {
  if(!candidates.value){
    alert('list of candidates is empty');
  }
  if(electionDuration.value){
    alert("please set the election duration");
  }

  const _candidates = candidates.value.split(",");
  const _votingDuration = electionDuration.value;

  await contract.startElection(_candidates, _votingDuration);
  refreshPage();

  candidates.value = "";
  electionDuration.value = "";

  voteForm.style.display = "flex";
  showResultContainer.style.display = "none";
}

const addCandidate = async function() {
  if(!candidate.value){
    alert('please provide the cadidate name first');
  }

  await contract.addCandidate(candidate.value);
  refreshPage();
  candidate.value = "";
}

const getAccount = async function() {
    try {
      console.log("getAccount function is being called");
  
      // Ensure that Ethereum provider is available
      if (!window.ethereum) {
        throw new Error("MetaMask or other Ethereum provider not found.");
      }
  
      // Request user accounts
      const ethAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = ethAccounts[0];
  
      // Ensure that at least one account is available
      if (!account) {
        throw new Error("No Ethereum account available.");
      }
  
      // Set up signer and contract
      signer = provider.getSigner(account);
      contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      // Update UI
      connectWallet.textContent = account.slice(0, 10) + "...";
      connectWalletMessage.textContent = "You are currently connected...";
      connectWallet.disabled = true;
  
      // Check if the user is the owner
      const owner = await contract.owner();
      if (owner == account) {
        admin.style.display = "flex";
  
        // Check election status
        const time = await contract.electionTimer();
        if (time == 0) {
          contract.checkElectionPeriod();
        }
      }
  
      // Display the voting station
      votingStation.style.display = "block";
  
      // Refresh UI
      refreshPage();
      getAllCandidates();
    } catch (error) {
      console.error("Error in getAccount:", error.message || error);
    }
  };

//Add event listeners
connectWallet.addEventListener('click', getAccount);
showResult.addEventListener('click', getResult);
voteButton.addEventListener('click', sendVote);
addTheCandidate.addEventListener('click', addCandidate);
startAnElection.addEventListener('click', startElection);

