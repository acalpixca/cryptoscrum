import {people as peopleFromFile} from '../data/people.js';
import {productBacklog as productBacklogFromFile} from '../data/productBacklog.js';
import {highestUserStoryId as highestUserStoryIdFromFile} from '../data/productBacklog.js';
import {sprints as sprintsFromFile} from '../data/sprints.js';

function allocateStoryToSprint(storyId, sprintId) {
  // remove storyId from product backlog
  // add storyId to sprintId
}

function calculateBountySplit(sprintId) {
  // TB: fetch total bounty
  // TSP: calculate total story points in the sprint
  // MPP: calculate maximum number of points by one team member
  // (TSP - MPP) / TB is the money corresponding to one story point
  // cuando puedas pensar, piensa cómo calcular el dinero para el product owner
}

function initializeDataFromLocalStorageOrDataFile() {
  let people = (localStorage.people) ? JSON.parse(localStorage.people) : peopleFromFile;
  let productBacklog = (localStorage.productBacklog) ? JSON.parse(localStorage.productBacklog) : productBacklogFromFile;
  let sprints = (localStorage.sprints) ? JSON.parse(localStorage.sprints) : sprintsFromFile;
  let highestUserStoryId = (localStorage.highestUserStoryId) ? localStorage.highestUserStoryId : highestUserStoryIdFromFile;
  return ({people, productBacklog, sprints, highestUserStoryId});
}

function saveDataToLocalStorage(people, productBacklog, sprints, highestUserStoryId) {
  localStorage.people = JSON.stringify(people);
  localStorage.productBacklog = JSON.stringify(productBacklog);
  localStorage.sprints = JSON.stringify(sprints);
  localStorage.highestUserStoryId = highestUserStoryId;
}

function resetDataToSampleFiles() {
  let people = peopleFromFile;
  let productBacklog = productBacklogFromFile;
  let sprints = sprintsFromFile;
  let highestUserStoryId = highestUserStoryIdFromFile;

}


// The fun starts here

function createSmartContract() {
  let contractStr = "pragma cashscript ^0.5.6;\n";
  contractStr +="";
  contractStr += "contract RewardSuccessfulUserStory(pubkey sender, pubkey recipient, int timeout) {\n";
  contractStr +="\tfunction transferStorySuccess(sig recipientSig) {\n";
  contractStr +="\t\trequire(checkSig(recipientSig, recipient));\n";
  contractStr +="\t}\n";
  contractStr +="\tfunction reclaimStoryFailure(sig senderSig) {\n";
  contractStr +="\t\trequire(checkSig(senderSig, sender));\n";
  contractStr +="\t}\n";
  contractStr +="}\n";
  return(contractStr);
}


export {createSmartContract, initializeDataFromLocalStorageOrDataFile, saveDataToLocalStorage, resetDataToSampleFiles, allocateStoryToSprint, calculateBountySplit};
