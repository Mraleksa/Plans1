var client = require('http-api-client');
var sqlite3 = require("sqlite3").verbose();

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
		if (p<3){piv ();}		
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
					
					///////////////////////////////
					var db2 = new sqlite3.Database("data2.sqlite");
					
					db.each("SELECT rowid AS id, nameId FROM data", function(err, row) {
      						console.log(row.id + ": " + row.nameId);
							
						db2.serialize(function() {

							db2.run("CREATE TABLE IF NOT EXISTS data2 (id TEXT,nameId TEXT)");

							var statement2 = db2.prepare("INSERT INTO data2 VALUES (?,?)");

							statement2.run(row.id,row.nameId);
  
							statement2.finalize();
						});



							  
  					});
					
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
 
   

