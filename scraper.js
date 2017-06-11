var client = require('http-api-client');
var sqlite3 = require("sqlite3").verbose();
const sqliteJSON = require('sqlite-json');
var d3 = require("d3");
// Open a database handle
var db = new sqlite3.Database("data.sqlite");

	
var currentCount =  "2017-04-20T12:38:09.008329+03:00"
var p=0; var p2=0;
   
   
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
			
				
					
db.serialize(function() {

  // Create new table
  db.run("CREATE TABLE IF NOT EXISTS data (id TEXT,datePublished TEXT,cpv TEXT,nameId TEXT,name TEXT,amount INT,currency TEXT,procurementMethod TEXT,procurementMethodType TEXT,startDate TEXT)");

  
  // Insert a new record
  var statement = db.prepare("INSERT INTO data VALUES (?,?,?,?,?,?,?,?,?,?)");

statement.run(data.getJSON().data.id,data.getJSON().data.datePublished,data.getJSON().data.classification.id,data.getJSON().data.procuringEntity.identifier.id,data.getJSON().data.procuringEntity.name,data.getJSON().data.budget.amount,data.getJSON().data.budget.currency,data.getJSON().data.tender.procurementMethod,data.getJSON().data.tender.procurementMethodType,data.getJSON().data.tender.tenderPeriod.startDate);
  //else none;
   //console.log(item.dateModified)
  statement.finalize();
});

					})
					.catch(function  (error) {
						console.log("error_detale")
						
					});  
				});
		
		})
		.then(function () {	
		if (p<2){piv ();}		
		else {
			console.log("stop")
				p=0;
				p2++;
				console.log(p2)
			setTimeout(function() {
			
				if (p2 < 2) {
					piv ();
				}
				else {
					
					const exporter = sqliteJSON(db);
					exporter.json('SELECT * FROM data', function (err, json) {
						//console.log(json)
						
						
						var nest=d3.nest()
  						  .key(function(d) {return d.name;})
						  .key(function(d) {return d.procurementMethod;})
  						  .sortKeys(d3.ascending)
  						  .rollup(function(v) { return {
    							count: v.length,
							total: d3.sum(v, function(d) { return d.amount; })
  						   }; })
  						  .entries(JSON.parse(json));
						
						console.log(nest)
						//console.log(json.length)
						
					});		
					///////////////////////////////
					//var db2 = new sqlite3.Database("data2.sqlite");
					
					/*
					db.each("SELECT rowid AS id, nameId FROM data", function(err, row) {
      						console.log(row.id + ": " + row.nameId);
						
						//db.run("DELETE FROM data");
						   var nest=d3.nest()
  						  .key(function(d) {return d.date;})
  						  .key(function(d) {return d.final_;})
  						  .sortKeys(d3.ascending)
  						  .rollup(function(v) { return {
    							count: v.length,
  						   }; })
  						  .entries(dataset);
						
						db.serialize(function() {

							db.run("CREATE TABLE IF NOT EXISTS data2 (id TEXT,nameId TEXT)");

							var statement = db.prepare("INSERT INTO data2 VALUES (?,?)");

							statement.run(row.id,row.nameId);
  
							statement.finalize();
						});



							  
  					});
					*/
					///////////////////////////////
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
 
   

