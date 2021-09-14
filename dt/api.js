const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: true}))


app.use('/data', function (req, res, next) {
    const data = [{
        id: 1,
        name: "apple",
        title: "this is iphone se"
    },
    {
        id: 2,
        name: "apple2",
        title: "this is iphone se"

    },
    {
        id: 3,
        name: "milk",
        title: "this is iphone se"

    },
    {
        id: 4,
        name: "kiwi",
        title: "this is iphone se"

    },
    {
        id: 5,
        name: "lemon",
        title: "this is iphone se"

    },
    {
        id: 6,
        name: "applepen",
        title: "this is iphone se"

    },
    {
        id: 7,
        name: "applepie",
        title: "this is iphone se"

    },
    {
        id: 8,
        name: "greentean",
        title: "this is iphone se"

    },
    {
        id: 9,
        name: "redtea",
        title: "this is iphone se"

    },
    {
        id: 10,
        name: "icecream",
        title: "this is iphone se"

    },
    {
        id: 11,
        name: "apple2099",
        title: "this is iphone se"

    }
    ]

    var newData=[]
    data.forEach(e => {
        newData.push([e.id,e.name])
        
    });



    const metaData={
        draw:1,
        recordsTotal:data.length,
        recordsFiltered:0,
        data:newData
    }


    console.log('/data  req.query',req.query)
    server(req.query,res)

})
var cache_data = {};
var aColumns = [];

/**
* Get the names for the table columns
* The names are used for the sql-statement
*/
getColumnNamesForTable();
function getColumnNamesForTable()
{
 connection.query('SHOW COLUMNS FROM ' + sTable,
   function selectCb(err, results, fields){
     if(err){
       console.log(err);
     }
     for(var i in results)
     {
       aColumns.push(results[i]['Field']);
     }
   });
}

function server(request, res) { 
    /**
     * Paging
     */
     var sLimit = "";
     if(request['iDisplayStart'] && request['iDisplayLength'] != -1) {
      sLimit = 'LIMIT ' +request['iDisplayStart']+ ', ' +request['iDisplayLength']
    }
    
    /**
     * Ordering
     */
     var sOrder = "";
     if(request['iSortCol_0']) {
      sOrder = 'ORDER BY ';
  
      for(var i = 0 ; i < request['iSortingCols']; i++) {
        if(request['bSortable_'+parseInt(request['iSortCol_'+i])] == "true") {
          sOrder += aColumns[parseInt(request['iSortCol_'+i])] +" "+ request['sSortDir_'+i] +", ";
        }
      }
      
      sOrder = sOrder.substring(0, sOrder.length -2)
      if(sOrder == 'ORDER BY') {
        console.log("sOrder == ORDER BY");
        sOrder = "";
      }
    }
  
    /**
     * Filtering
     */
     var sWhere = "";
     if(request['sSearch'] && request['sSearch'] != "") {
      sWhere = "WHERE (";
        for(var i=0 ; i<aColumns.length; i++) {
          sWhere += aColumns[i]+ " LIKE " +"\'%"+request['sSearch']+"%\'"+" OR ";
        }
  
        sWhere = sWhere.substring(0, sWhere.length -4);
        sWhere += ')';
    }
  
    /**
     * column filtering
     */
     for(var i=0 ; i<aColumns.length; i++) {
      if(request['bSearchable_'+i] && request['bSearchable_'+i] == "true" && request['sSearch_'+i] != '') {
        if(sWhere == "") {
          sWhere = "WHERE ";
        } else {
          sWhere += " AND ";
        }
        sWhere += " "+aColumns[i]+ " LIKE " +"\'%"+request['sSearch_'+i]+"%\'"+" ";
      }
    }
    
    /**
     * Queries
     */
     var sQuery = "SELECT SQL_CALC_FOUND_ROWS " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+" "+sLimit +"";
  
     var rResult = {};
     var rResultFilterTotal = {};
     var aResultFilterTotal = {};
     var iFilteredTotal = {};
     var iTotal = {};
     var rResultTotal = {};
     var aResultTotal = {};
  
    //Log the query for debugging
    console.log(sQuery);
  
    connection.query(sQuery, function selectCb(err, results, fields) {
      if(err) {
        console.log(err);
      }
      
      rResult = results;
  
      /**
       * Data set length after filtering
       */
       sQuery = "SELECT FOUND_ROWS()";
  
       connection.query(sQuery, function selectCb(err, results, fields) {
        if(err) {
          console.log(err);
        }
        rResultFilterTotal = results;
        aResultFilterTotal = rResultFilterTotal;
        iFilteredTotal = aResultFilterTotal[0]['FOUND_ROWS()'];
  
        /**
         * Total data set length
         */
         sQuery = "SELECT COUNT("+sIndexColumn+") FROM " +sTable;
  
         connection.query(sQuery, function selectCb(err, results, fields){
          if(err){
            console.log(err);
          }
          rResultTotal = results;
          aResultTotal = rResultTotal;
          iTotal = aResultTotal[0]['COUNT(*)'];
  
          /**
           * Create Output
           */
           var output = {};
           var temp = [];
  
           output.sEcho = parseInt(request['sEcho']);
           output.iTotalRecords = iTotal;
           output.iTotalDisplayRecords = iFilteredTotal;
           output.aaData = [];
  
           var aRow = rResult;
           var row = [];
  
           for(var i in aRow)
           {
            for(Field in aRow[i])
            {
              if(!aRow[i].hasOwnProperty(Field)) continue; 
              temp.push(aRow[i][Field]);
            }
            output.aaData.push(temp);
            temp = [];
          }
          
          /**
           * Send respons as json
           */
           res.json(200, output);
         });
       });
  }); 
  }

module.exports = app 