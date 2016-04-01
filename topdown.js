var h = require("./helpers");
require("./loadData")(function(csv, names){

  var people = {};
  h.forEach(names, function(i, name){
    people[name] = {
      name: name,
      choices: [],
      didVote: false
    }
  });

  // Calculate the "scores" for each person's choices
  h.forEach(csv, function(line){
    var chooser = people[line[0]];
    var choices = {};
    var numChoices = (line.length - 1);
    chooser.didVote = true;
    h.forEach(line.slice(0), function(name, index){
      if(name !== chooser.name){
        chooser.choices[name] = (numChoices - index);
      }
    });
  });

  // Calculate all possible combinations
  var names       = Object.keys(names);
  var base        = names.length;
  var groupSize   = 3;
  var combos      = Array(Math.pow(base, groupSize));
  h.forEach(groupSize, function(x, l){
    var i = 0;
    h.forEach(Math.pow(base, l), function(){
      h.forEach(base, function(y, num){
        h.forEach(Math.pow(base, groupSize - l - 1), function(){
          var name = names[num];
          if(combos[i] === undefined) combos[i] = [];
          if(combos[i].indexOf(name) < 0) combos[i].push(name);
          i += 1;
        });
      });
    });
  });

  // Make sure all groups have 3 people
  var groups = [];
  h.forEach(combos, function(combo){
    if(combo.length === groupSize) groups.push({members: combo});
  });

  // Calculate how "satisfied" each person is with that group
  // Then calculate the net satisfaction for each group
  h.forEach(groups, function(group){
    group.satisfaction = 0;
    group.grumpyScore = 0;
    h.forEach(group.members, function(name){
      var person = people[name];
      var personSatisfaction = 0;
      h.forEach(group.members, function(choiceName){
        personSatisfaction += (person.choices[choiceName] || 0);
      });
      if(person.didVote && personSatisfaction < 1){
        group.grumpyScore -= 1;
      }
      group.satisfaction += personSatisfaction;
    });
  });

  groups.sort(function(a, b){
    return(b.satisfaction - a.satisfaction);
  });

  groups.sort(function(a, b){
    return(b.grumpyScore - a.grumpyScore);
  });

  h.forEach(groups, function(group){
    group.badScore = 0;
    h.forEach(group.members, function(name){
      var person = people[name];
       group.badScore -= 1;
    });
  });

  groups.sort(function(a, b){
    return(b.priorityScore - a.priorityScore);
  });

  var usedPeople = [];
  var final = [];
  h.forEach(groups, function(group){
    var isDupe = false;
    h.forEach(group.members, function(name){
      if(usedPeople.indexOf(name) > -1) isDupe = true;
    });
    if(!isDupe){
      usedPeople = usedPeople.concat(group.members);
      final.push(group);
    }
  });

  var remainder = [];
  h.forEach(names, function(name){
    if(usedPeople.indexOf(name) < 0) remainder.push(name);
  });

  h.forEach(final, function(group){
    console.log(group.members);
  });

  console.log(remainder);

});
