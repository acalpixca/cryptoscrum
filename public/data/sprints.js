/*

Sprint statuses:

not started
planning
in progress
successful
failed

User story statuses:

not started
in progress
approved
failed

*/
let sprints = [
 {
    "sprintId": "sprint1",
    "sprintDate": "2021-01-18",
    "status": "in progress",
    "productOwner": "Eva",
    "bounty": 500,
    "sponsorWallet": "bitcoincash:pqx5ej6z9cvxc2c7nw5p4s5kf8nzmzc5cqapu8xprq",
    "userStories": [
      {
        "storyId": 1,
        "storyName": "Add login button",
        "priority": 1,
        "storyPoints": 3,
        "teamMember": "Carla",
  	     "status": "approved"
      },
      {
        "storyId": 2,
        "storyName": "Check password constraints",
        "priority": 1,
        "storyPoints": 5,
        "teamMember": "Luis",
  	     "status": "in progress"
      }
    ]
  },
  {
     "sprintId": "sprint2",
     "sprintDate": "2021-02-01",
     "status": "planning",
     "productOwner": "Eva",
     "bounty": 500,
     "sponsorWallet": "bitcoincash:pqx5ej6z9cvxc2c7nw5p4s5kf8nzmzc5cqapu8xprq",
     "userStories": [
       {
         "storyId": 3,
         "storyName": "Add avatar for user",
         "priority": 1,
         "storyPoints": 5,
         "teamMember": "Lola",
   	     "status": "not started"
       },
       {
         "storyId": 4,
         "storyName": "Fetch user information",
         "priority": 1,
         "storyPoints": 6,
         "teamMember": "Pedro",
   	     "status": "not started"
       },
       {
         "storyId": 5,
         "storyName": "Beautify user information",
         "priority": 1,
         "storyPoints": 7,
         "teamMember": "Carla",
   	     "status": "not started"
       }
     ]
   } // sprint2
];

export {sprints};
