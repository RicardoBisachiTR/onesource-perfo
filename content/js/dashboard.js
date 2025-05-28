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

    var data = {"OkPercent": 68.88888888888889, "KoPercent": 31.11111111111111};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6666666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2003 - schema_1-0"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [0.8, 500, 1500, "Consulta PAR2101 schema_3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Consulta PAR2101 schema_2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Consulta PAR2101 schema_1"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_7-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_6-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_5-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  5 - schema_5"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  6 - schema_6"], "isController": true}, {"data": [0.75, 500, 1500, "Consulta PAR2101 schema_7"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Consulta PAR2101 schema_6"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Consulta PAR2101 schema_5"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Consulta PAR2101 schema_4"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_2"], "isController": true}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_3"], "isController": false}, {"data": [0.8, 500, 1500, "Controller Consultas  CAD2003 - schema_3"], "isController": true}, {"data": [0.0, 500, 1500, "Envio CAD2003 - schema_2"], "isController": false}, {"data": [0.0, 500, 1500, "Envio CAD2003 - schema_1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_1"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_6"], "isController": true}, {"data": [0.75, 500, 1500, "Controller Consultas  CAD2003 - schema_7"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_4"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_5"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  7 - schema_7"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 45, 14, 31.11111111111111, 1073.5555555555554, 0, 5249, 143.0, 5195.8, 5222.4, 5249.0, 1.5951224699585267, 3.259062289532452, 1.34758078630676], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2003 - schema_1-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.6223958333334, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 1672.0, 1672, 1672, 1672.0, 1672.0, 1672.0, 1672.0, 0.5980861244019139, 1.6599226226076556, 0.6506522876794258], "isController": true}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 1287.0, 1287, 1287, 1287.0, 1287.0, 1287.0, 1287.0, 0.777000777000777, 2.156480672105672, 0.8589500777000778], "isController": true}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 1622.0, 1622, 1622, 1622.0, 1622.0, 1622.0, 1622.0, 0.6165228113440198, 1.7110916307028359, 0.6815467016029593], "isController": true}, {"data": ["Consulta PAR2101 schema_3", 5, 1, 20.0, 109.0, 55, 172, 117.0, 172.0, 172.0, 172.0, 0.23983115886415962, 0.37215987444838833, 0.2347722203568688], "isController": false}, {"data": ["Consulta PAR2101 schema_2", 3, 1, 33.333333333333336, 146.0, 69, 249, 120.0, 249.0, 249.0, 249.0, 0.27520410971470505, 0.49181984450967803, 0.26749982799743144], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 3, 1, 33.333333333333336, 124.33333333333334, 51, 206, 116.0, 206.0, 206.0, 206.0, 0.2891008962127783, 0.5063971101956249, 0.2810075768526549], "isController": false}, {"data": ["Envio CAD2003 - schema_7-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_6-0", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 264.8111979166667, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_5-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_4-0", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 397.216796875, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  5 - schema_5", 1, 0, 0.0, 1126.0, 1126, 1126, 1126.0, 1126.0, 1126.0, 1126.0, 0.8880994671403197, 2.464822935168739, 0.9765625000000001], "isController": true}, {"data": ["Envio CAD2003 - schema_3-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 793.9453125, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_2-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.6223958333334, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  6 - schema_6", 1, 0, 0.0, 959.0, 959, 959, 959.0, 959.0, 959.0, 959.0, 1.0427528675703859, 2.8940465328467155, 1.1466208289885298], "isController": true}, {"data": ["Consulta PAR2101 schema_7", 4, 1, 25.0, 95.0, 69, 113, 99.0, 113.0, 113.0, 113.0, 0.24709661477637757, 0.3953787141709909, 0.24124496154558933], "isController": false}, {"data": ["Envio CAD2003 - schema_7", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 3.3928980745721273, 1.3550103147921762], "isController": false}, {"data": ["Consulta PAR2101 schema_6", 3, 1, 33.333333333333336, 145.0, 69, 197, 169.0, 197.0, 197.0, 197.0, 0.27240533914464726, 0.48681813538545354, 0.2647794084264052], "isController": false}, {"data": ["Envio CAD2003 - schema_6", 1, 0, 0.0, 959.0, 959, 959, 959.0, 959.0, 959.0, 959.0, 1.0427528675703859, 2.8940465328467155, 1.1466208289885298], "isController": false}, {"data": ["Consulta PAR2101 schema_5", 3, 1, 33.333333333333336, 136.0, 67, 229, 112.0, 229.0, 229.0, 229.0, 0.2844141069397042, 0.5082791168941979, 0.27645199326886616], "isController": false}, {"data": ["Envio CAD2003 - schema_5", 1, 0, 0.0, 1126.0, 1126, 1126, 1126.0, 1126.0, 1126.0, 1126.0, 0.8880994671403197, 2.464822935168739, 0.9765625000000001], "isController": false}, {"data": ["Consulta PAR2101 schema_4", 3, 1, 33.333333333333336, 139.33333333333334, 61, 194, 163.0, 194.0, 194.0, 194.0, 0.26457359555516363, 0.4822094926801305, 0.25716691286709586], "isController": false}, {"data": ["Envio CAD2003 - schema_4", 1, 0, 0.0, 1287.0, 1287, 1287, 1287.0, 1287.0, 1287.0, 1287.0, 0.777000777000777, 2.156480672105672, 0.8589500777000778], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 3, 1, 33.333333333333336, 1812.6666666666667, 69, 5249, 120.0, 5249.0, 5249.0, 5249.0, 0.18865551502955602, 0.337148039554773, 0.1833741431895359], "isController": true}, {"data": ["Envio CAD2003 - schema_3", 1, 0, 0.0, 1455.0, 1455, 1455, 1455.0, 1455.0, 1455.0, 1455.0, 0.6872852233676976, 1.9068137886597938, 0.7597723367697594], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_3", 5, 1, 20.0, 1109.0, 55, 5172, 117.0, 5172.0, 5172.0, 5172.0, 0.1934310805060157, 0.3001581903555263, 0.18935089365159194], "isController": true}, {"data": ["Envio CAD2003 - schema_2", 1, 0, 0.0, 1622.0, 1622, 1622, 1622.0, 1622.0, 1622.0, 1622.0, 0.6165228113440198, 1.7110916307028359, 0.6815467016029593], "isController": false}, {"data": ["Envio CAD2003 - schema_1", 1, 0, 0.0, 1672.0, 1672, 1672, 1672.0, 1672.0, 1672.0, 1672.0, 0.5980861244019139, 1.6599226226076556, 0.6506522876794258], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 3, 1, 33.333333333333336, 1791.3333333333333, 51, 5207, 116.0, 5207.0, 5207.0, 5207.0, 0.1950331556364582, 0.3416254591405539, 0.18957324307632298], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_6", 3, 1, 33.333333333333336, 1811.6666666666667, 69, 5197, 169.0, 5197.0, 5197.0, 5197.0, 0.18731268731268733, 0.33474825955294707, 0.18206890765484518], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_7", 4, 1, 25.0, 1345.25, 69, 5107, 102.5, 5107.0, 5107.0, 5107.0, 0.18877719571475765, 0.30206194841663125, 0.1843066420076455], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_4", 3, 1, 33.333333333333336, 1806.3333333333333, 61, 5195, 163.0, 5195.0, 5195.0, 5195.0, 0.1835985312117503, 0.334625057374541, 0.17845872858017137], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_5", 3, 1, 33.333333333333336, 1802.6666666666667, 67, 5229, 112.0, 5229.0, 5229.0, 5229.0, 0.19293845263360987, 0.34480211749951767, 0.18753718084764295], "isController": true}, {"data": ["Controller Envios - Thread  7 - schema_7", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 3.3928980745721273, 1.3550103147921762], "isController": true}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 1455.0, 1455, 1455, 1455.0, 1455.0, 1455.0, 1455.0, 0.6872852233676976, 1.9068137886597938, 0.7597723367697594], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 14, 100.0, 31.11111111111111], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 45, 14, "Assertion failed", 14, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_3", 5, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta PAR2101 schema_2", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_7", 4, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_6", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_5", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_4", 3, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_3", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_6", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_7", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_4", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_5", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
