var path= require('path')

module.exports=function(app){
    app.use('/users',require('./api/users'))
}