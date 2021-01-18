import {initializeDataFromLocalStorageOrDataFile, saveDataToLocalStorage, resetDataToSampleFiles, allocateStoryToSprint, calculateBountySplit} from './functions.js';
// import {createSmartContract} from './cashScriptFunctions.js';
let {people, productBacklog, sprints, highestUserStoryId} = initializeDataFromLocalStorageOrDataFile();

let selectedSprint = -1;


$(document).ready(function(){
  // alert(sprints[0].sprintId);

  // initialize all buttons etc.
  $("#acceptSprintBtn").hide();
  $("#failSprintBtn").hide();

  $("#acceptSprintBtn").click(function(){
    // the interesting stuff goes here
    if (selectedSprint > -1) { 
      alert("Pay day!");
    }
  });

  $("#failSprintBtn").click(function(){
    // the interesting stuff goes here
    if (selectedSprint > -1) { 
      alert("Boo - organization gets the contract money back for all contracts");
    }

  });

  $("#saveDataBtn").click(function(){
    // alert("Save data clicked.");
    saveDataToLocalStorage(people, productBacklog, sprints, highestUserStoryId);
  });

  $("#resetDataBtn").click(function(){
    // alert("Reset data clicked.");
    selectedSprint = -1;
    localStorage.clear();
    resetDataToSampleFiles();
    loadSprintsDiv();
    loadSelectedSprintDiv(selectedSprint);
    loadProductBacklogDiv();
  });

  $("#addStoryBtn").click(function(){
    let item = {
      "storyId": -1,
      "storyName": "Use verbs!",
      "priority": 1,
      "storyPoints": 0,
       "status": "not allocated"
    };
    let index = -1;
    
    populateAndLaunchEditUserStoryModalForm(item, index);
  });



  $("#sprintSaveBtn").click(function() {
    let index = $(this).attr("id");
    // alert("el index guays es " + index);
    if (index) {
      sprints[index].sprintId = $("#sprintFormSprintId").val();
      sprints[index].sprintDate = $("#sprintDate").val();
      sprints[index].status = $("#sprintFormStatus").val();
      sprints[index].productOwner = $("#sprintFormProductOwner").val();
      sprints[index].bounty = $("#sprintFormBounty").val();
      sprints[index].sponsorWallet = $("#sprintFormSponsorWallet").val();
    }
    // alert("A VER SI FUNCIONA " + $(this).html());
    $("#editSprintModal").trigger("reset");
    $("#editSprintModal").removeData();
    $('#editSprintModal').modal('toggle');
    loadSprintsDiv();
  });

  $("#backlogStorySaveBtn").click(function(){
    let index = $(this).attr("id");
    // alert("el index guays es " + index);
    // let's assume index is good here - technical debt ahoy!

    let item = {
        "storyId": -1,
        "storyName": "",
        "priority": 0,
        "storyPoints": 0,
         "status": "not allocated"
    };

    item.storyName = $("#backlogFormStoryName").val();
    item.priority = $("#backlogFormPriority").val();
    item.storyPoints = $("#backlogFormStoryPoints").val();
    item.status = $("#backlogFormStatus").val();

    if (index < 0) { 
      item.storyId = ++highestUserStoryId;
      productBacklog.push(item);
    }
    else {
      productBacklog[index].storyName = item.storyName;
      productBacklog[index].priority = item.priority;
      productBacklog[index].storyPoints = item.storyPoints;
      productBacklog[index].status = item.status;
    }
    // and we wish to reload the backlog sidebar when modal save button is clicked
    loadProductBacklogDiv();
    $("#editStoryModal").trigger("reset");
    $("#editStoryModal").removeData();
    $('#editStoryModal').modal('toggle');
  });

  

  $('.modal').on('hidden.bs.modal', function(e)
  { 
      $(this).removeData();
  }) ;
// from https://stackoverflow.com/questions/26863003/how-to-reset-the-bootstrap-modal-when-it-gets-closed-and-open-it-fresh-again

  loadSprintsDiv();
  loadSelectedSprintDiv(selectedSprint);
  loadProductBacklogDiv();
// end of main

 // end of document ready
});



  // end drag and drop stuff

function loadProductBacklogDiv() {

  productBacklog.sort((a, b) => (a.priority > b.priority) ? 1 : -1)
  $("#backlogUserStoriesList").empty();

    /*productBacklog.forEach((item,index) => {
      renderProductBacklogItem(item, index);
    });*/

    productBacklog.forEach(renderProductBacklogItem);

    $("#productBacklogDiv").droppable({
      drop: function(event, ui) {
            $(this).css('background', 'white');
            var drag = ui.draggable;
            let storyId = drag.children().attr('id');
            storyId = storyId.replace("indexInSprint", "");
            // add story to product backlog
            let productBacklogUserStory = {
              "storyId": sprints[selectedSprint].userStories[storyId].storyId,
              "storyName": sprints[selectedSprint].userStories[storyId].storyName,
              "priority": sprints[selectedSprint].userStories[storyId].priority,
              "storyPoints": sprints[selectedSprint].userStories[storyId].storyPoints,
               "status": "not allocated"
            };
            productBacklog.push(productBacklogUserStory);
            // remove story from sprint
            sprints[selectedSprint].userStories.splice(storyId, 1);
            // refresh selected sprint, list of sprints and product backlog
            loadProductBacklogDiv();
            loadSelectedSprintDiv(selectedSprint);
            loadSprintsDiv();
        },
        over: function(event, ui) {
            $(this).css('background', 'pink');
        },
        out: function(event, ui) {
            $(this).css('background', 'white');
        }
    });

}

function renderProductBacklogItem(item, index) {
  let selector = "#storyNum" + index;
  let htmlCode = '<div class="card-deck draggableUserStory">';
  htmlCode += '<div class="card bg-warning mt-4" id="storyNum' + index + '"><div class="card-body">';
  htmlCode += '<h5 class="card-title">'+ item.storyId + '-' + item.storyName + '</h5>';
  htmlCode += '<ul class="list-group list-group-flush"><li class="list-group-item">Priority: '+ item.priority + '</li>';
  htmlCode += '<li class="list-group-item">Story Points: '+ item.storyPoints +'</li>';
  htmlCode += '<li class="list-group-item">Status: '+ item.status +'</li>';
  htmlCode += '</ul></div></div></div>';
  
  $("#backlogUserStoriesList").append(htmlCode);
  $(".draggableUserStory").draggable({
    stack: ".draggableUserStory"
  });
  // add double click functionality for each card
  $(selector).dblclick(function(event) {
    populateAndLaunchEditUserStoryModalForm(item, index);
  // add drag and drop functionality here
  });
}

function populateAndLaunchEditUserStoryModalForm(item, index) {
  $("#backlogFormStoryName").attr("value",item.storyName); 
  $("#backlogFormPriority").attr("value",item.priority);
  $("#backlogFormStoryPoints").attr("value",item.storyPoints);
  $("#backlogFormStatus").val(item.status); // para select así funciona bien


  $("#backlogStorySaveBtn").removeAttr("style");
  $("#backlogStorySaveBtn").attr('id', index); // id will be the sprints array index

  $('#editStoryModal').modal({
    keyboard: true
  });

}


function loadSprintsDiv() {

  sprints.sort((a, b) => (a.sprintDate > b.sprintDate) ? 1 : -1)

  $("#sprintsList").empty();
  sprints.forEach(
    (item,index) => {
      let selector = "#sprintNum" + index;
      let htmlCode = '<div class="card-deck">';
      htmlCode += '<div class="card mt-4" id="sprintNum'+ index +'"><div class="card-body">';
      htmlCode += '<h5 class="card-title">'+ item.sprintId + '</h5>';
      htmlCode += '<ul class="list-group list-group-flush"><li class="list-group-item">Date: '+ item.sprintDate +'</li>';
      htmlCode += '<li class="list-group-item">Status: '+ item.status +'</li>';
      htmlCode += '<li class="list-group-item">Product Owner :'+ item.productOwner +'</li>';
      htmlCode += '<li class="list-group-item">Bounty: '+ item.bounty +'</li>';
      htmlCode += '</ul></div></div></div>';

      $("#sprintsList").append(htmlCode);

      $(selector).dblclick(function(event) {
        // populate modal fields and open it
        $("#sprintFormSprintId").val(item.sprintId);
        $("#sprintDate").val(item.sprintDate);
        $("#sprintFormStatus").val(item.status);
        $("#sprintFormProductOwner").val(item.productOwner);
        $("#sprintFormBounty").val(item.bounty);
        $("#sprintFormSponsorWallet").val(item.sponsorWallet);
        $('#editSprintModal').modal({
          keyboard: true
        });
        $("#sprintSaveBtn").removeAttr("style");
        $("#sprintSaveBtn").attr('id', index); // id will be the sprints array index
        // thus we have personalized the button. We can define the click event response once, will work for all
      });

      $(selector).click(function(event) {
        // alert("You clicked sprint " + index);
        selectedSprint = index;
        // remove all highlights
        for (let i=0;i<sprints.length;i++) {
          let selec = "#sprintNum"+i;
          $(selec).removeClass("bg-success");
        }
        // highlight clicked sprint card
        $(selector).addClass("bg-success");
        // load sprint content into selectedSprintDiv
        loadSelectedSprintDiv(index);
      });
  });

  if (selectedSprint > -1) { 
    let selector = "#sprintNum" + selectedSprint;
    $(selector).addClass("bg-success");
  }
}


function loadSelectedSprintDiv(index) {
  // alert("will load sprint " + index + "onto the selectedSprintDiv div");
  $("#selectedSprintDivItems").empty();
  let htmlCode ="";
  if (index>-1) {
    if(sprints[index].status == "in progress") {
      $("#acceptSprintBtn").show();
      $("#failSprintBtn").show();
    }
    else {
      $("#acceptSprintBtn").hide();
      $("#failSprintBtn").hide();
    }

    htmlCode += '<div class="card-columns py-4">';
    sprints[index].userStories.forEach(
      (item, index) => {
        htmlCode += '<div class="card bg-primary draggableSprintUserStory">';
        htmlCode += '<div class="card-body" id="indexInSprint' + index + '">';
        htmlCode += '<h5 class="card-title">' + item.storyId + '-'+ item.storyName + '</h5>';
        htmlCode += '<ul class="list-group list-group-flush">';
        htmlCode += '<li class="list-group-item">Story points: '+ item.storyPoints + '</li>';
        htmlCode += '<li class="list-group-item">Allocated to: '+ item.teamMember + '</li>';
        htmlCode += '<li class="list-group-item">Status: '+ item.status + '</li>';
        htmlCode += '</ul></div></div>';
      }
      ); // end forEach;
    htmlCode += '</div>';
  } // end if;
  else {
    htmlCode="<h5>Click on a sprint to the left to see its user stories here.</h5>";
  }
  $("#selectedSprintDivItems").append(htmlCode);

  $(".draggableSprintUserStory").draggable({
    stack: ".draggableSprintUserStory"
  });

  $("#selectedSprintDiv").droppable({
    drop: function(event, ui) {
          $(this).css('background', 'white');
          var drag = ui.draggable;
          let storyId = drag.children().attr('id');
          storyId = storyId.replace("storyNum", ""); // index on productBacklog

          
          if (selectedSprint > -1) {
            // add productBacklog[storyId] info into the selected sprint
            let sprintUserStory = {
              "storyId": productBacklog[selectedSprint].storyId,
              "storyName": productBacklog[selectedSprint].storyName,
              "priority": productBacklog[selectedSprint].priority,
              "storyPoints": productBacklog[selectedSprint].storyPoints,
              "teamMember": "",
               "status": "not started"
            };
            sprints[selectedSprint].userStories.push(sprintUserStory);
            // remove productBacklog[storyId]  
            productBacklog.splice(storyId, 1);
          }
          // refresh selected sprint, list of sprints and product backlog
          loadProductBacklogDiv();
          loadSelectedSprintDiv(selectedSprint);
          loadSprintsDiv();          
    },
      over: function(event, ui) {
          $(this).css('background', 'pink');
      },
      out: function(event, ui) {
          $(this).css('background', 'white');
      }
  });
}
