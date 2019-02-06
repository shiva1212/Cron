const CronJob = require('cron').CronJob;  
const MongoClient = require('mongodb').MongoClient;

new CronJob('*/10 * * * * *', function() {
MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
if(err) { return console.dir(err); }
    const RXClaimsTest = db.collection('RXClaimsTest');
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); var day = currentDate.getDate();
    const oldDate = new Date(year - 11, month, day).toISOString();
    RXClaimsTest.deleteMany({ 'originalDate' : {'$lt' : new Date(oldDate) }},function(err, response) {
        console.log('Deleted Count', response.deletedCount);
    });    
});
}, null, true, ''); 