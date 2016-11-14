var soap = require('soap');
var fs = require('fs');
var serializer = new (require('xmldom')).XMLSerializer;
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;
var url = 'http://together-webservice-thum.herokuapp.com/wsdl?wsdl';
var args1 = { old_movie_name: "The Dark Knight", new_movie_name: "The Dark Knight2" };
var args2 = { movie_name: "The Dark Knight", director: "Christopher Nolan" };
var args3 = { director: "Christopher Nolan" };
var args4 = { movie_name: "MOVIENAME", director: "DIRECTOR", year: "2016", genre: "GERNE", star: "STAR" };

  soap.createClient(url, function (err, client) {
      /*client.updateMovie(args1, function (err, result) { //change
          console.log(result.xml);
      });
      client.deleteMovie(args2, function (err, result) { //remove
          console.log(result.xml);
      });*/
      client.queryMovie(args3, function (err, result) { //query
          console.log(result.xml);
          var table;
          var xml = result.xml;
          var doc = new dom().parseFromString(xml)
          var nodes = xpath.select("/movielist", doc);
          table = "<html><body><table style=\"width:100%\" ><tr><th>Movie Name</th><th>Director Name</th><th>Year</th><th>Length</th><th>Resolution</th><th>Genres</th><th>Stars</th></tr>";
          x = doc.getElementsByTagName("movie");
          if (nodes[0].getElementsByTagName("movie").length > 0) {
              for (i = 0; i < x.length; i++) {
                  table += "<tr><td>" + x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue + "</td>";
                  table += "<td>" + x[i].getElementsByTagName("director")[0].childNodes[0].nodeValue + "</td>";
                  table += "<td>" + x[i].getElementsByTagName("year")[0].childNodes[0].nodeValue + "</td>";
                  table += "<td>" + x[i].getElementsByTagName("length")[0].childNodes[0].nodeValue + "</td>";
                  table += "<td>" + x[i].getElementsByTagName("resolution")[0].childNodes[0].nodeValue + "</td>";
                  var genres = x[i].getElementsByTagName("genres");
                  var each_genre = genres[0].getElementsByTagName("genre");
                  var genreStr = "<table>";
                  for (k = 0; k < each_genre.length; k++) {
                      genreStr += "<tr><td>"+ each_genre[k].childNodes[0].nodeValue + "</td></tr>";
                  }
                  table += "<td>" + genreStr + "</table></td>";
                  var stars = x[i].getElementsByTagName("stars");
                  var each_star = stars[0].getElementsByTagName("name");
                  var starStr = "<table>";
                  for (k = 0; k < each_star.length; k++) {
                      starStr += "<tr><td>" + each_star[k].childNodes[0].nodeValue + "</td></tr>";
                  }
                  table += "<td>" + starStr + "</table></td>";
                  table += "</tr>";
              }
              table += "</table></body></html>";
          } else {
              table = "<div align='center'><h3>Not Found !!</h3><div></table></body></html>"
          }
          fs.writeFile(
            "movie.html",
            table,
            function (error) {
                if (error) {
                    console.log(error);
                } else {
                   console.log("The file was saved!");
                }
            }
          );
      });
      /*client.addMovie(args4, function (err, result) { //add
         console.log(result.xml);
      });*/
  });
