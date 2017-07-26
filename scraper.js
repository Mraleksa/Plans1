var client = require('http-api-client');
var sqlite3 = require("sqlite3").verbose();
const sqliteJSON = require('sqlite-json');
var d3 = require("d3");

// Open a database handle
var db = new sqlite3.Database("data.sqlite");
var p=0; var p2=0;

//db.run("DELETE FROM data");

var currentCount =  "2017-01-01T00:00:00.739639+03:00"

//db.each("SELECT dateModified FROM data ORDER BY dateModified DESC LIMIT 1", function(err, timeStart) {
      
	//var currentCount = timeStart.dateModified
	console.log("старт: "+currentCount); 
	//var end  = formatTime(new Date());
	//console.log("конец: "+end);

//db.run("DELETE FROM data");
	
function piv(){  
p++;
client.request({url: 'https://public.api.openprocurement.org/api/2.3/plans?offset='+currentCount})
		.then(function (data) {
						 
		
			var dataset = data.getJSON().data;
			
			currentCount = data.getJSON().next_page.offset;			
			console.log(currentCount)
			
			return dataset;
	
		})	
		.then(function (dataset) {	
		
			dataset.forEach(function(item) {
				client.request({url: 'https://public.api.openprocurement.org/api/0/plans/'+item.id})
					.then(function (data) {
			


if(data.getJSON().data.budget.year =="2017"){
	
db.serialize(function() {
	db.run("CREATE TABLE IF NOT EXISTS data (dateModified TEXT,name TEXT,id TEXT,amount INT,procurementMethod TEXT)");
	var statement = db.prepare("INSERT INTO data VALUES (?,?,?,?,?)");
	var name = data.getJSON().data.procuringEntity.name.toLowerCase();
	statement.run(item.dateModified,name,data.getJSON().data.procuringEntity.identifier.id,data.getJSON().data.budget.amount,data.getJSON().data.tender.procurementMethod);
	statement.finalize();
});

}//year
				
				})
					.catch(function  (error) {
						console.log("error_detale")
						
					});  
				});
		
		})
		.then(function () {	
		if (p<10){piv ();}		
		else {
			console.log("stop")
				p=0;
				p2++;
				console.log(p2)
			setTimeout(function() {
			
				if (p2 < 20) {
					piv ();
				}
				else {
					console.log("STOP");
				     }
				}, 5000);
		}		 
							
		})
		.catch( function (error) {
		console.log("error")
		piv ();
		});   
		
		
			 

}

piv ();	
 
//});
