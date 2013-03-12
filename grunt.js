module.exports = function(grunt){
  
 grunt.initConfig({
   min : {
     
     start : {
       src : ['zcml.js'], 
       dest : 'zcml.min.js'
     },

     uglify : {
       mangle : {}, 
       squeeze : {}
     }
   }


 });
 
 grunt.registerTask('default', 'min:start');

};