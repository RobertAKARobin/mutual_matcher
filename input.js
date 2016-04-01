var people = {};
var groups = [];

require("fs").readFile("./data.csv", "utf8", function(err, raw){
  var output = [];
  raw.trim().split(/[\n\r]/).forEach(function(line){
    output.push(line.trim().split(/\s*,\s*/));
  });
  getChoices(output);
});

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
      group: null
    }
  });
  getChosenBy();
}

function getChosenBy(){
  Object.keys(people).sort().forEach(function(name){
    var person = people[name];
    person.choices.forEach(function(choice){
      people[choice].chosenBy.push(person.name);
    });
  });
  rankPeople();
}

function rankPeople(){
  var rankedNames = Object.keys(people).sort(function(a, b){
    return(people[b].chosenBy.length - people[a].chosenBy.length);
  });
  rankedNames.forEach(function(name){
    
  });
}
