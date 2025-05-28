/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 73.33333333333333, "KoPercent": 26.666666666666668};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7083333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_1-0"], "isController": false}, {"data": [0.8, 500, 1500, "Consultas PAR2101 - schema_2"], "isController": true}, {"data": [0.8, 500, 1500, "Consulta PAR2101 schema_2"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_2"], "isController": false}, {"data": [0.75, 500, 1500, "Consulta PAR2101 schema_1"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [0.0, 500, 1500, "Envio CAD2003 - schema_1"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2-0"], "isController": false}, {"data": [0.75, 500, 1500, "Consultas PAR2101 - schema_1"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15, 4, 26.666666666666668, 980.9333333333334, 3, 5222, 162.0, 5186.6, 5222.0, 5222.0, 0.5236881611563035, 0.9985192171734804, 0.45399945012743076], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 918.0, 918, 918, 918.0, 918.0, 918.0, 918.0, 1.0893246187363836, 3.022237540849673, 1.2137884667755992], "isController": true}, {"data": ["Envio CAD2003 - schema_1-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.6223958333334, 0.0], "isController": false}, {"data": ["Consultas PAR2101 - schema_2", 5, 1, 20.0, 1181.6, 90, 5222, 132.0, 5222.0, 5222.0, 5222.0, 0.1920860545524395, 0.29398170380330385, 0.18803423933922397], "isController": true}, {"data": ["Consulta PAR2101 schema_2", 5, 1, 20.0, 181.4, 90, 371, 132.0, 371.0, 371.0, 371.0, 0.23778950872687496, 0.3639294121843344, 0.23277363627716743], "isController": false}, {"data": ["Envio CAD2003 - schema_2", 1, 0, 0.0, 918.0, 918, 918, 918.0, 918.0, 918.0, 918.0, 1.0893246187363836, 3.022237540849673, 1.2137884667755992], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 4, 1, 25.0, 168.5, 91, 329, 127.0, 329.0, 329.0, 329.0, 0.2550207204335352, 0.4148444971310169, 0.24898141138029964], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 1824.0, 1824, 1824, 1824.0, 1824.0, 1824.0, 1824.0, 0.5482456140350876, 1.5215957373903508, 0.6092807702850876], "isController": true}, {"data": ["Envio CAD2003 - schema_1", 1, 0, 0.0, 1824.0, 1824, 1824, 1824.0, 1824.0, 1824.0, 1824.0, 0.5482456140350876, 1.5215957373903508, 0.6092807702850876], "isController": false}, {"data": ["Envio CAD2003 - schema_2-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.296875, 0.0], "isController": false}, {"data": ["Consultas PAR2101 - schema_1", 4, 1, 25.0, 1418.75, 91, 5163, 210.5, 5163.0, 5163.0, 5163.0, 0.1933581476289457, 0.3145374359501136, 0.18877910946488133], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 4, 100.0, 26.666666666666668], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15, 4, "Assertion failed", 4, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consultas PAR2101 - schema_2", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta PAR2101 schema_2", 5, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 4, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consultas PAR2101 - schema_1", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
