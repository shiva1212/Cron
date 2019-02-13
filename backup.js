MongoClient.connect("mongodb://localhost:27017/", function(err, dbClint) {
if(err) { return console.dir(err); }
    const db = dbClint.db("test");
    const RXClaimsTest = db.collection('RXClaimsTest');
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); var day = currentDate.getDate();
    const oldDate = new Date(year - 11, month, day).toISOString();


    db.createCollection("customers", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();   //close method has also been moved to client obj
    });

    // const _backupRXClaims = db.listCollections().toArray().indexOf("_backupRXClaims");
    // var items = db.listCollections({name: "_backupRXClaims"}).toArray();
    let _backupRXClaimsLength;
    db.listCollections({name: "_backupRXClaims"}).toArray().then(function(items) {
        if( items.length &&  items.length !==0 ){
            db._backupRXClaims.drop();
        }
        console.log(items.length);
      }).catch(function(err) {
        console.dir(err)
      });

    if (_backupRXClaimsLength !==0 && _backupRXClaimsLength !== undefined) {
        console.log(_backupRXClaimsLength);
        console.log('_backupRXClaims Dropped')
    }

    db.createCollection( "_backupRXClaims");
    db.RXClaimsTest.find().forEach( function(x){db._backupRXClaims.insert(x)} ).then( (res) => {
        RXClaimsTest.deleteMany({ 'originalDate' : {'$lt' : new Date(oldDate) }},function(err, response) {
            console.log('Deleted Count', response.deletedCount);
        }); 
    });
});