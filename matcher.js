var groupSize = 3;
var dataFile  = "./data.csv";
var h = require("helpers-js");

// Yup, just one big long script

require("fs").readFile(dataFile, "utf8", function(err, raw){

  // Parse the CSV, and record all of the names in it
  var csv = [];
  var names = {};
  var allValues = [];
  h.forEach(raw.trim().split(/[\n\r]/), function(line){
    var line = line.trim().split(/\s*,\s*/);
    csv.push(line);
    allValues = allValues.concat(line);
    h.forEach(line, function(datum){
      if(!names[datum]) names[datum] = true;
    });
  });

  // Can use this to check for misspellings
  // console.log(allValues.sort().join("\n\r"));

  // Create a person object for each person mentioned in the CSV
  var people = {};
  h.forEach(names, function(i, name){
    people[name] = {
      name: name,
      choices: {}
    }
  });

  // The first item in each CSV line is the person who submitted the choices
  // The other items in the line are their choices
  h.forEach(csv, function(line){
    var chooser = people[line[0]];
    var choices = {};
    h.forEach(line, function(choiceName){
      if(chooser.name !== choiceName){
        chooser.choices[choiceName] = true;
      }
    });
  });

  // Calculate all possible combinations
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

  // Make sure all groups have N people
  var groups = [];
  h.forEach(combos, function(combo){
    if(combo.length === groupSize){
      groups.push({members: combo});
    }
  });

  // Calculate a "score" for each group based on how many times a member chose another member
  h.forEach(groups, function(group){
    group.score = 0;
    h.forEach(group.members, function(name){
      var person = people[name];
      h.forEach(group.members, function(otherName){
        if(person.choices[otherName]) group.score += 1;
      });
    });
  });

  // Sort by score
  groups.sort(function(a, b){
    return(b.score - a.score);
  });

  // Strip duplicates
  var used = [];
  var final = [];
  h.forEach(groups, function(group){
    var isDupe = false;
    h.forEach(group.members, function(name){
      if(used.indexOf(name) > -1) isDupe = true;
    });
    if(!isDupe){
      used = used.concat(group.members);
      final.push(group);
    }
  });

  // Find who's left over
  var remainder = [];
  h.forEach(names, function(name){
    if(used.indexOf(name) < 0) remainder.push(name);
  });

  console.log("*** Groups ***");

  h.forEach(final, function(group){
    // console.log(group.members.join(", "));
    console.log(group)
  });

  console.log("\n*** Unassigned ***");

  console.log(remainder.join(", "));

});
