var people = {};
var groups = [];

require("./loadData")(getChoices);

function getChoices(csv){
  var names = {};
  var byChooser = {};
  csv.forEach(function(line){
    var chooser = line[0];
    var choices = [];
    line.forEach(function(name){
      if(!names[name]) names[name] = true;
      if(name !== chooser) choices.push(name);
    });
    byChooser[chooser] = choices;
  });
  Object.keys(names).forEach(function(name){
    people[name] = {
      name: name,
      choices: (byChooser[name] || []),
      chosenBy: [],
      mutuals: [],
      group: null
    }
  });
  getChosenBy();
}

function getChosenBy(){
  Object.keys(people).forEach(function(name){
    var person = people[name];
    person.choices.forEach(function(choice){
      people[choice].chosenBy.push(person.name);
    });
  });
  getMutuals();
}

function getMutuals(){
  Object.keys(people).forEach(function(name){
    var person = people[name];
    person.choices.forEach(function(choice){
      var choice = people[choice];
      var isMutual = (choice.choices.indexOf(person.name) > -1);
      var isNotLogged = (choice.mutuals.indexOf(person.name) < 0);
      if(isMutual && isNotLogged){
        choice.mutuals.push(person.name);
        person.mutuals.push(choice.name);
      }
    });
  });
  rankPeopleByMutuals();
}

function rankPeopleByMutuals(){
  var rankedNames = Object.keys(people).sort(function(a, b){
    return(people[b].mutuals.length - people[a].mutuals.length);
  });
  rankedNames.forEach(function(name){
    var person = people[name];
    person.mutuals.forEach(function(name){

    });
  });
}
