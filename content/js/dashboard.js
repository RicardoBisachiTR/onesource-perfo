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

    var data = {"OkPercent": 68.75, "KoPercent": 31.25};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7346938775510204, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2003 - schema_1-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "Consulta PAR2101 schema_3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Consulta PAR2101 schema_2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Consulta PAR2101 schema_1"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_5-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  5 - schema_5"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Consulta PAR2101 schema_5"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_5"], "isController": false}, {"data": [0.8, 500, 1500, "Consulta PAR2101 schema_4"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_2"], "isController": true}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_3"], "isController": true}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_2"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_1"], "isController": true}, {"data": [0.8, 500, 1500, "Controller Consultas  CAD2003 - schema_4"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_5"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32, 10, 31.25, 959.4999999999999, 0, 5172, 98.0, 5137.5, 5154.45, 5172.0, 1.1659683002368373, 2.3948465112042268, 0.9833587629805065], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2003 - schema_1-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.296875, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 1126.0, 1126, 1126, 1126.0, 1126.0, 1126.0, 1126.0, 0.8880994671403197, 2.46395565053286, 0.9635532304618118], "isController": true}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 5.557990981963928, 2.2212393537074147], "isController": true}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 998.0, 998, 998, 998.0, 998.0, 998.0, 998.0, 1.002004008016032, 2.779974010521042, 1.0930063251503006], "isController": true}, {"data": ["Consulta PAR2101 schema_3", 3, 1, 33.333333333333336, 101.33333333333333, 52, 141, 111.0, 141.0, 141.0, 141.0, 0.26778541462108363, 0.4880633256716951, 0.2602888177273945], "isController": false}, {"data": ["Consulta PAR2101 schema_2", 3, 1, 33.333333333333336, 87.66666666666667, 50, 144, 69.0, 144.0, 144.0, 144.0, 0.28694404591104733, 0.5128003945480631, 0.27891110712577716], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 3, 1, 33.333333333333336, 106.33333333333334, 40, 171, 108.0, 171.0, 171.0, 171.0, 0.27344818156959255, 0.4983842345729651, 0.265793056694923], "isController": false}, {"data": ["Envio CAD2003 - schema_5-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_4-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Envios - Thread  5 - schema_5", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 10.629938936781608, 4.190613026819923], "isController": true}, {"data": ["Envio CAD2003 - schema_3-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.296875, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_2-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1587.890625, 0.0], "isController": false}, {"data": ["Consulta PAR2101 schema_5", 3, 1, 33.333333333333336, 76.66666666666667, 32, 127, 71.0, 127.0, 127.0, 127.0, 0.2931691586045148, 0.5135231909019837, 0.28496194908628947], "isController": false}, {"data": ["Envio CAD2003 - schema_5", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 10.629938936781608, 4.190613026819923], "isController": false}, {"data": ["Consulta PAR2101 schema_4", 5, 1, 20.0, 63.0, 33, 88, 68.0, 88.0, 88.0, 88.0, 0.24082458337347076, 0.36857449908486656, 0.23574468981793661], "isController": false}, {"data": ["Envio CAD2003 - schema_4", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 5.557990981963928, 2.2212393537074147], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 3, 1, 33.333333333333336, 1754.6666666666667, 50, 5145, 69.0, 5145.0, 5145.0, 5145.0, 0.19411193788417985, 0.34689926399223553, 0.18867781462309932], "isController": true}, {"data": ["Envio CAD2003 - schema_3", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 3.913136900564175, 1.5591942877291962], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_3", 3, 1, 33.333333333333336, 1768.3333333333333, 52, 5142, 111.0, 5142.0, 5142.0, 5142.0, 0.18513947173537398, 0.3374335619291533, 0.17995653079486545], "isController": true}, {"data": ["Envio CAD2003 - schema_2", 1, 0, 0.0, 998.0, 998, 998, 998.0, 998.0, 998.0, 998.0, 1.002004008016032, 2.779974010521042, 1.0930063251503006], "isController": false}, {"data": ["Envio CAD2003 - schema_1", 1, 0, 0.0, 1126.0, 1126, 1126, 1126.0, 1126.0, 1126.0, 1126.0, 0.8880994671403197, 2.46395565053286, 0.9635532304618118], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 3, 1, 33.333333333333336, 1773.3333333333333, 40, 5172, 108.0, 5172.0, 5172.0, 5172.0, 0.18784046083526393, 0.34235636074760506, 0.18258190626761003], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_4", 5, 1, 20.0, 1063.0, 33, 5087, 68.0, 5087.0, 5087.0, 5087.0, 0.19407677677289134, 0.297028441951636, 0.18998296976283816], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_5", 3, 1, 33.333333333333336, 1743.3333333333333, 32, 5127, 71.0, 5127.0, 5127.0, 5127.0, 0.19692792437967704, 0.3449443883746882, 0.1914149681633189], "isController": true}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 3.913136900564175, 1.5591942877291962], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 10, 100.0, 31.25], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32, 10, "Assertion failed", 10, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_3", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta PAR2101 schema_2", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_5", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_4", 5, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_3", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_4", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_5", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
