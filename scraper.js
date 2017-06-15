var client = require('http-api-client');
var sqlite3 = require("sqlite3").verbose();
const sqliteJSON = require('sqlite-json');
var d3 = require("d3");

// Open a database handle
var db = new sqlite3.Database("data.sqlite");
var p=0; var p2=0;



var currentCount =  "2017-01-01T00:00:00.008329+03:00"

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

  // Create new table
  db.run("CREATE TABLE IF NOT EXISTS data (id TEXT,dateModified TEXT,name TEXT,amount INT,procurementMethod TEXT)");

  
  // Insert a new record
  var statement = db.prepare("INSERT INTO data VALUES (?,?,?,?,?)");

statement.run(item.id,item.dateModified,data.getJSON().data.procuringEntity.name,data.getJSON().data.budget.amount,data.getJSON().data.tender.procurementMethod);
  //else none;
   //console.log(item.dateModified)
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
		if (p<1){piv ();}		
		else {
			console.log("stop")
				p=0;
				p2++;
				console.log(p2)
			setTimeout(function() {
			
				if (p2 < 1) {
					piv ();
				}
				else {
					
///////////////////////////////		

					
//db.run("DELETE FROM data2");					
						
const exporter = sqliteJSON(db);
					
exporter.json('SELECT name,procurementMethod FROM data', function (err, json) {
						
						var nest=d3.nest()
  						  .key(function(d) {return d.name;})
						  .key(function(d) {return d.procurementMethod;})
  						  .sortKeys(d3.ascending)
  						  .rollup(function(v) { return {
    							 count: v.length, 
							total: d3.sum(v, function(d) { return d.amount; })
  						   }; })
  						  .entries(JSON.parse(json.replace(/limited/g, "open")));
						


console.log(JSON.stringify(nest[0]))	
					
nest.forEach(function(item) {


	
	
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS data1 (item TEXT,countNo INT,countOpen INT,totalNo INT,totalOpen INT)");
		var statement = db.prepare("INSERT INTO data1 VALUES (?,?,?,?,?)");


if(item.values.length==2){
	statement.run(item.key,item.values[0].value.count,item.values[1].value.count,item.values[0].value.total,item.values[1].value.total); 
	//console.log(2)
}
else {	
	if(item.values[0].key==""){
		//console.log("nathing")
		statement.run(item.key,item.values[0].value.count,0,item.values[0].value.total,0);
	}
	if(item.values[0].key=="open"){
		//console.log("open")
		statement.run(item.key,0,item.values[0].value.count,0,item.values[0].value.total);
	}
}
		
	
		statement.finalize();
	});
	
})						

						

						
						
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
 
//});
