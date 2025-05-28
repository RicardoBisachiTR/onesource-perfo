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

    var data = {"OkPercent": 76.47058823529412, "KoPercent": 23.529411764705884};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2003 - schema_1-0"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_4"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Consultas  CAD2003 - schema_2"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_3"], "isController": false}, {"data": [0.5, 500, 1500, "Consulta PAR2101 schema_2"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Consulta PAR2101 schema_1"], "isController": false}, {"data": [0.0, 500, 1500, "Envio CAD2003 - schema_1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "Controller Consultas  CAD2003 - schema_1"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17, 4, 23.529411764705884, 1557.5294117647059, 0, 5220, 218.0, 5175.2, 5220.0, 5220.0, 1.309001309001309, 2.75410626973127, 0.9965644731269732], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2003 - schema_1-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 794.43359375, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 1696.0, 1696, 1696, 1696.0, 1696.0, 1696.0, 1696.0, 0.5896226415094339, 1.6364331515330188, 0.6500819943985849], "isController": true}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 842.0, 842, 842, 842.0, 842.0, 842.0, 842.0, 1.187648456057007, 3.2961883907363423, 1.309428815320665], "isController": true}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 1435.0, 1435, 1435, 1435.0, 1435.0, 1435.0, 1435.0, 0.6968641114982579, 1.9333895905923344, 0.7601535278745645], "isController": true}, {"data": ["Envio CAD2003 - schema_4", 1, 0, 0.0, 842.0, 842, 842, 842.0, 842.0, 842.0, 842.0, 1.187648456057007, 3.2961883907363423, 1.309428815320665], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 2, 1, 50.0, 5171.5, 5123, 5220, 5171.5, 5220.0, 5220.0, 5220.0, 0.3601656762110571, 0.7776624122096164, 0.33765532144786603], "isController": false}, {"data": ["Envio CAD2003 - schema_3", 1, 0, 0.0, 1167.0, 1167, 1167, 1167.0, 1167.0, 1167.0, 1167.0, 0.8568980291345331, 2.37822675664096, 0.9472739931448158], "isController": false}, {"data": ["Consulta PAR2101 schema_2", 2, 1, 50.0, 170.0, 122, 218, 170.0, 218.0, 218.0, 218.0, 3.6231884057971016, 7.823114809782608, 3.3967391304347823], "isController": false}, {"data": ["Envio CAD2003 - schema_2", 1, 0, 0.0, 1435.0, 1435, 1435, 1435.0, 1435.0, 1435.0, 1435.0, 0.6968641114982579, 1.9333895905923344, 0.7601535278745645], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 3, 1, 33.333333333333336, 126.66666666666667, 104, 163, 113.0, 163.0, 163.0, 163.0, 0.4806151874399231, 0.8753391841557193, 0.4588686018103172], "isController": false}, {"data": ["Envio CAD2003 - schema_1", 1, 0, 0.0, 1696.0, 1696, 1696, 1696.0, 1696.0, 1696.0, 1696.0, 0.5896226415094339, 1.6364331515330188, 0.6500819943985849], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 3, 1, 33.333333333333336, 3460.6666666666665, 113, 5164, 5105.0, 5164.0, 5164.0, 5164.0, 0.2668326958996709, 0.4859794705594592, 0.254759211287023], "isController": false}, {"data": ["Envio CAD2003 - schema_4-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 1167.0, 1167, 1167, 1167.0, 1167.0, 1167.0, 1167.0, 0.8568980291345331, 2.37822675664096, 0.9472739931448158], "isController": true}, {"data": ["Envio CAD2003 - schema_3-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_2-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.296875, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 4, 100.0, 23.529411764705884], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17, 4, "Assertion failed", 4, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 2, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_2", 2, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 2, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
