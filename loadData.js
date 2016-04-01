module.exports = function(doWhat){
  require("fs").readFile("./data.csv", "utf8", function(err, raw){
    var output = [];
    raw.trim().split(/[\n\r]/).forEach(function(line){
      output.push(line.trim().split(/\s*,\s*/));
    });
    doWhat(output);
  });
}
