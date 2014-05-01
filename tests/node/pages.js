describe('APIs',function(){
    describe('/', function () {
        it('returns home page', function (done) {
            api.get('/')
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function(err, res){
                    if (err) throw err;
                    done();
                });
        });
    });
});