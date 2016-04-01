module.exports = function(doWhat){
  require("fs").readFile("./data.csv", "utf8", function(err, raw){
    var output = [];
    var allPossible = {};
    raw.trim().split(/[\n\r]/).forEach(function(line){
      var line = line.trim().split(/\s*,\s*/);
      output.push(line);
      line.forEach(function(datum){
        if(!allPossible[datum]) allPossible[datum] = true;
      });
    });
    doWhat(output, allPossible);
  });
}
