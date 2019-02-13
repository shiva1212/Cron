const CronJob = require('cron').CronJob;  
const MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";
MongoClient.connect(url, function(err, db) {   //here db is the client obj
    if (err) throw err;
    var dbase = db.db("test"); //Db name here
    const RXClaimsTest = dbase.collection('RXClaimsTest');
    const backupRxclaims = dbase.collection('backupRxclaims');
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); var day = currentDate.getDate();
    const oldDate = new Date(year - 11, month, day).toISOString();
    dbase.dropCollection("backupRxclaims");

    dbase.createCollection("backupRxclaims").then((err, res) => {
            if (err) console.log(err);
            if(res)
                console.log("Collection created!");
    });

    RXClaimsTest.find().forEach( function(x){
        console.log(x);
        backupRxclaims.insert(x)
    })

    RXClaimsTest.deleteMany({ 'originalDate' : {'$lt' : new Date(oldDate) }},function(err, response) {
        console.log('Deleted Count', response.deletedCount);
    }); 
});
