var groupSize = 3;
var dataFile  = "./data.csv";
var h = require("helpers-js");

// Yup, just one big long script.

require("fs").readFile(dataFile, "utf8", function(err, raw){

  var csv = [];
  var names = {};
  raw.trim().split(/[\n\r]/).forEach(function(line){
    var line = line.trim().split(/\s*,\s*/);
    csv.push(line);
    line.forEach(function(datum){
      if(!names[datum]) names[datum] = true;
    });
  });

  var byChooser = {};
  h.forEach(csv, function(line){
    var chooser = line[0];
    var choices = [];
    line.forEach(function(name){
      if(name !== chooser) choices.push(name);
    });
    byChooser[chooser] = choices;
  });

  var people = {};
  h.forEach(names, function(i, name){
    people[name] = {
      name: name,
      choices: (byChooser[name] || []),
      chosenBy: [],
      mutuals: [],
      group: null
    }
  });

  h.forEach(people, function(person){
    person.choices.forEach(function(choice){
      people[choice].chosenBy.push(person.name);
    });
  });

  var names       = Object.keys(names);
  var base        = names.length;
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

  var groups = [];
  h.forEach(combos, function(combo){
    if(combo.length === groupSize) groups.push({members: combo, score: 0});
  });

  h.forEach(groups, function(group){
    h.forEach(group.members, function(name){
      h.forEach(group.members, function(otherName){
        if(people[name].choices.indexOf(otherName) > -1){
          group.score += 1;
        }else{
          group.score -= 1;
        }
      });
    });
  });

  groups.sort(function(a, b){
    return(b.score - a.score);
  });

  var used = [];
  var final = [];
  h.forEach(groups, function(group){
    var memberString = group.members.sort().join(", ");
    var isDupe = false;
    h.forEach(group.members, function(name){
      if(used.indexOf(name) > -1) isDupe = true;
    });
    if(!isDupe){
      used = used.concat(group.members);
      final.push(memberString);
    }
  });

  var remainder = [];
  h.forEach(names, function(name){
    if(used.indexOf(name) < 0) remainder.push(name);
  });

  console.log("*** Groups ***");

  h.forEach(final, function(group){
    console.log(group);
  });

  console.log("\n*** Unassigned ***");

  console.log(remainder.join(", "));

});
