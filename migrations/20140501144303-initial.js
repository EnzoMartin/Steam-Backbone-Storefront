var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
    async.series([
        db.createTable.bind(db, 'achievements', {
            id: {type: 'char(36)', primaryKey:true, notNull:true},
            gameId: {type:'int',notNull:true},
            total: {type:'int',notNull:true,defaultValue:0}
        }),
        db.createTable.bind(db, 'categories', {
            id: {type: 'int', primaryKey:true, notNull:true},
            description: {type: 'varchar(255)', notNull:true}
        }),
        db.createTable.bind(db, 'categoriesMap', {
            id: {type: 'char(36)', primaryKey:true, notNull:true},
            gameId: {type: 'int', notNull:true},
            categoryId: {type: 'int', notNull:true}
        }),
        db.createTable.bind(db, 'genres', {
            id: {type: 'int', primaryKey:true, notNull:true},
            description: {type: 'varchar(255)', notNull:true}
        }),
        db.createTable.bind(db, 'genresMap', {
            id: {type: 'char(36)', primaryKey:true, notNull:true},
            gameId: {type: 'int', notNull:true},
            genreId: {type: 'int', notNull:true}
        }),
        db.createTable.bind(db, 'demos', {
            id: {type: 'int', primaryKey:true, notNull:true},
            gameId: {type: 'int', notNull:true}
        }),
        db.createTable.bind(db, 'developers', {
            id: {type: 'char(36)', primaryKey:true, notNull:true},
            name: {type: 'varchar(255)', notNull:true}
        }),
        db.createTable.bind(db, 'developersMap', {
            id: {type: 'char(36)', primaryKey:true, notNull:true},
            gameId: {type: 'int', notNull:true},
            developerId: {type: 'char(36)', notNull:true}
        }),
        db.createTable.bind(db, 'languages', {
            id: {type: 'char(36)', primaryKey:true, notNull:true},
            name: {type: 'varchar(255)', notNull:true}
        }),
        db.createTable.bind(db, 'languagesMap', {
            id: {type: 'char(36)', primaryKey:true, notNull:true},
            gameId: {type: 'int', notNull:true},
            languageId: {type: 'char(36)', notNull:true},
            interface: {type:'tinyint(1)',defaultValue:0},
            audio: {type:'tinyint(1)',defaultValue:0},
            subtitles: {type:'tinyint(1)',defaultValue:0}
        }),
        db.createTable.bind(db, 'metacritic', {
            id: {type: 'int', primaryKey:true, notNull:true},
            score: {type: 'tinyint(2)', defaultValue: 0}
        }),
        db.createTable.bind(db, 'platforms', {
            id: {type: 'char(36)', primaryKey:true, notNull:true},
            name: {type: 'varchar(255)', notNull:true}
        }),
        db.createTable.bind(db, 'platformsMap', {
            id: {type: 'char(36)', primaryKey:true, notNull:true},
            gameId: {type: 'int', notNull:true},
            platformId: {type: 'char(36)', notNull:true}
        }),
        db.createTable.bind(db, 'publishers', {
            id: {type: 'char(36)', primaryKey:true, notNull:true},
            name: {type: 'varchar(255)', notNull:true}
        }),
        db.createTable.bind(db, 'publishersMap', {
            id: {type: 'char(36)', primaryKey:true, notNull:true},
            gameId: {type: 'int', notNull:true},
            pusblisherId: {type: 'char(36)', notNull:true}
        }),
        db.createTable.bind(db, 'recommendations', {
            id: {type: 'int', primaryKey:true, notNull:true},
            total: {type: 'int', notNull:true}
        }),
        db.createTable.bind(db, 'controllerSupport', {
            id: {type: 'int', primaryKey:true, notNull:true},
            support: {type: 'varchar(100)', notNull:true}
        })
    ],createIndexes);

    function createIndexes(err){
        if(err){callback(err); return;}
        async.series([
            db.addIndex.bind(db, 'achievements','gameId','gameId'),
            db.addIndex.bind(db, 'achievements','total','total'),
            db.addIndex.bind(db, 'categoriesMap','gameId','gameId'),
            db.addIndex.bind(db, 'categoriesMap','categoryId','categoryId'),
            db.addIndex.bind(db, 'genresMap','gameId','gameId'),
            db.addIndex.bind(db, 'genresMap','genreId','genreId'),
            db.addIndex.bind(db, 'demos','gameId','gameId'),
            db.addIndex.bind(db, 'developersMap','gameId','gameId'),
            db.addIndex.bind(db, 'developersMap','developerId','developerId'),
            db.addIndex.bind(db, 'languagesMap','gameId','gameId'),
            db.addIndex.bind(db, 'languagesMap','languageId','languageId'),
            db.addIndex.bind(db, 'metacritic','score','score'),
            db.addIndex.bind(db, 'platformsMap','gameId','gameId'),
            db.addIndex.bind(db, 'platformsMap','platformId','platformId'),
            db.addIndex.bind(db, 'publishersMap','gameId','gameId'),
            db.addIndex.bind(db, 'publishersMap','pusblisherId','pusblisherId'),
            db.addIndex.bind(db, 'recommendations','total','total'),
            db.addIndex.bind(db, 'controllerSupport','support','support')
        ],callback);
    }
};

exports.down = function(db, callback) {
    async.series([
        db.removeIndex.bind(db, 'achievements','gameId'),
        db.removeIndex.bind(db, 'achievements','total'),
        db.removeIndex.bind(db, 'categoriesMap','gameId'),
        db.removeIndex.bind(db, 'categoriesMap','categoryId'),
        db.removeIndex.bind(db, 'genresMap','gameId'),
        db.removeIndex.bind(db, 'genresMap','genreId'),
        db.removeIndex.bind(db, 'demos','gameId'),
        db.removeIndex.bind(db, 'developersMap','gameId'),
        db.removeIndex.bind(db, 'developersMap','developerId'),
        db.removeIndex.bind(db, 'languagesMap','gameId'),
        db.removeIndex.bind(db, 'languagesMap','languageId'),
        db.removeIndex.bind(db, 'metacritic','score'),
        db.removeIndex.bind(db, 'platformsMap','gameId'),
        db.removeIndex.bind(db, 'platformsMap','platformId'),
        db.removeIndex.bind(db, 'publishersMap','gameId'),
        db.removeIndex.bind(db, 'publishersMap','pusblisherId'),
        db.removeIndex.bind(db, 'recommendations','total'),
        db.removeIndex.bind(db, 'controllerSupport','support')
    ],deleteTables);

    function deleteTables(err){
        if(err){callback(err); return;}
        async.series([
            db.dropTable.bind(db, 'achievements'),
            db.dropTable.bind(db, 'categories'),
            db.dropTable.bind(db, 'categoriesMap'),
            db.dropTable.bind(db, 'genres'),
            db.dropTable.bind(db, 'genresMap'),
            db.dropTable.bind(db, 'demos'),
            db.dropTable.bind(db, 'developers'),
            db.dropTable.bind(db, 'developersMap'),
            db.dropTable.bind(db, 'languages'),
            db.dropTable.bind(db, 'languagesMap'),
            db.dropTable.bind(db, 'metacritic'),
            db.dropTable.bind(db, 'platforms'),
            db.dropTable.bind(db, 'platformsMap'),
            db.dropTable.bind(db, 'publishers'),
            db.dropTable.bind(db, 'publishersMap'),
            db.dropTable.bind(db, 'recommendations'),
            db.dropTable.bind(db, 'controllerSupport')
        ],callback);
    }
};