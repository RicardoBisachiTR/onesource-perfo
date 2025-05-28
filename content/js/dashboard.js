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

    var data = {"OkPercent": 69.23076923076923, "KoPercent": 30.76923076923077};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.775, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2003 - schema_1-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "Consulta CAD2003 -  schema_4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Consulta CAD2003 -  schema_3"], "isController": false}, {"data": [0.8, 500, 1500, "Consulta CAD2003 -  schema_2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Consulta CAD2003 -  schema_1"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4"], "isController": false}, {"data": [0.8, 500, 1500, "Controller Consultas  CAD2003 - schema_2"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_3"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_1"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_4"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26, 8, 30.76923076923077, 873.653846153846, 1, 5179, 75.5, 5138.4, 5174.1, 5179.0, 0.9561284154010222, 1.94292591383812, 0.8089599115581215], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2003 - schema_1-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 794.43359375, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 4.982747980251346, 2.000462859066427], "isController": true}, {"data": ["Consulta CAD2003 -  schema_4", 3, 1, 33.333333333333336, 58.0, 32, 83, 59.0, 83.0, 83.0, 83.0, 0.2947244326554671, 0.516247451861676, 0.2864736835642008], "isController": false}, {"data": ["Consulta CAD2003 -  schema_3", 3, 1, 33.333333333333336, 94.33333333333334, 50, 165, 68.0, 165.0, 165.0, 165.0, 0.28686173264486514, 0.5024749294798241, 0.27883109820233315], "isController": false}, {"data": ["Consulta CAD2003 -  schema_2", 5, 1, 20.0, 78.4, 35, 126, 77.0, 126.0, 126.0, 126.0, 0.23579344494223062, 0.37091414171186043, 0.23081967696298045], "isController": false}, {"data": ["Consulta CAD2003 -  schema_1", 3, 1, 33.333333333333336, 106.0, 35, 178, 105.0, 178.0, 178.0, 178.0, 0.2779579356990642, 0.49674123274344484, 0.2701765611970722], "isController": false}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 44.76436491935484, 17.593876008064516], "isController": true}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 9.436782525510205, 3.730203018707483], "isController": true}, {"data": ["Envio CAD2003 - schema_4", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 44.76436491935484, 17.593876008064516], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 5, 1, 20.0, 1078.6, 35, 5127, 77.0, 5127.0, 5127.0, 5127.0, 0.19078872057083984, 0.30011960067920784, 0.1867642709962987], "isController": true}, {"data": ["Envio CAD2003 - schema_3", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 37.50527871621622, 14.819995777027028], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_3", 3, 1, 33.333333333333336, 1761.0, 50, 5165, 68.0, 5165.0, 5165.0, 5165.0, 0.19404915912031048, 0.3399018636804657, 0.18861679333764553], "isController": true}, {"data": ["Envio CAD2003 - schema_2", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 9.436782525510205, 3.730203018707483], "isController": false}, {"data": ["Envio CAD2003 - schema_1", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 4.982747980251346, 2.000462859066427], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 3, 1, 33.333333333333336, 1773.0, 35, 5179, 105.0, 5179.0, 5179.0, 5179.0, 0.18994554894263646, 0.33945347125490694, 0.1846280628719767], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_4", 3, 1, 33.333333333333336, 1725.0, 32, 5084, 59.0, 5084.0, 5084.0, 5084.0, 0.1976284584980237, 0.3461714632740448, 0.19209589097496707], "isController": true}, {"data": ["Envio CAD2003 - schema_4-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 37.50527871621622, 14.819995777027028], "isController": true}, {"data": ["Envio CAD2003 - schema_3-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_2-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 793.9453125, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 8, 100.0, 30.76923076923077], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 26, 8, "Assertion failed", 8, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2003 -  schema_4", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2003 -  schema_3", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2003 -  schema_2", 5, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2003 -  schema_1", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_3", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_4", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
