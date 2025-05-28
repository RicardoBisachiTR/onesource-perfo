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

    var data = {"OkPercent": 72.09302325581395, "KoPercent": 27.906976744186046};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7941176470588235, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2003 - schema_1-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [0.75, 500, 1500, "Consulta PAR2101 schema_3"], "isController": false}, {"data": [0.75, 500, 1500, "Consulta PAR2101 schema_2"], "isController": false}, {"data": [0.75, 500, 1500, "Consulta PAR2101 schema_1"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_6-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_5-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  5 - schema_5"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  6 - schema_6"], "isController": true}, {"data": [0.75, 500, 1500, "Consulta PAR2101 schema_6"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_6"], "isController": false}, {"data": [0.8, 500, 1500, "Consulta PAR2101 schema_5"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_5"], "isController": false}, {"data": [0.75, 500, 1500, "Consulta PAR2101 schema_4"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4"], "isController": false}, {"data": [0.75, 500, 1500, "Controller Consultas  CAD2003 - schema_2"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3"], "isController": false}, {"data": [0.75, 500, 1500, "Controller Consultas  CAD2003 - schema_3"], "isController": true}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_2"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_1"], "isController": false}, {"data": [0.75, 500, 1500, "Controller Consultas  CAD2003 - schema_1"], "isController": true}, {"data": [0.75, 500, 1500, "Controller Consultas  CAD2003 - schema_6"], "isController": true}, {"data": [0.75, 500, 1500, "Controller Consultas  CAD2003 - schema_4"], "isController": true}, {"data": [0.8, 500, 1500, "Controller Consultas  CAD2003 - schema_5"], "isController": true}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 43, 12, 27.906976744186046, 970.0697674418604, 0, 5504, 304.0, 5373.8, 5410.6, 5504.0, 1.519273575239374, 2.9879990084973325, 1.3043145823764264], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2003 - schema_1-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.296875, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 743.0, 743, 743, 743.0, 743.0, 743.0, 743.0, 1.3458950201884252, 3.7340700706594885, 1.4641865746971736], "isController": true}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 8.949722782258064, 3.5471270161290325], "isController": true}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 4.41083316772655, 1.7248981518282989], "isController": true}, {"data": ["Consulta PAR2101 schema_3", 4, 1, 25.0, 279.25, 140, 503, 237.0, 503.0, 503.0, 503.0, 0.24140012070006034, 0.3991117229933615, 0.2356833697948099], "isController": false}, {"data": ["Consulta PAR2101 schema_2", 4, 1, 25.0, 267.75, 164, 380, 263.5, 380.0, 380.0, 380.0, 0.23960704444710676, 0.39614719360249195, 0.23393275652929196], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 4, 1, 25.0, 266.0, 147, 363, 277.0, 363.0, 363.0, 363.0, 0.23693875133278047, 0.39173565039687236, 0.23132765297358132], "isController": false}, {"data": ["Envio CAD2003 - schema_6-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1587.890625, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_5-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_4-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Envios - Thread  5 - schema_5", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 9.126362047697368, 3.6267732319078947], "isController": true}, {"data": ["Envio CAD2003 - schema_3-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.296875, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_2-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Envios - Thread  6 - schema_6", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 9.248046875, 3.6263020833333335], "isController": true}, {"data": ["Consulta PAR2101 schema_6", 4, 1, 25.0, 257.75, 118, 411, 251.0, 411.0, 411.0, 411.0, 0.24942320882958158, 0.41237645756687663, 0.24351645803454514], "isController": false}, {"data": ["Envio CAD2003 - schema_6", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 9.248046875, 3.6263020833333335], "isController": false}, {"data": ["Consulta PAR2101 schema_5", 5, 1, 20.0, 242.0, 169, 309, 259.0, 309.0, 309.0, 309.0, 0.23501762632197415, 0.3696937426556992, 0.23006022326674502], "isController": false}, {"data": ["Envio CAD2003 - schema_5", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 9.126362047697368, 3.6267732319078947], "isController": false}, {"data": ["Consulta PAR2101 schema_4", 4, 1, 25.0, 292.25, 228, 404, 268.5, 404.0, 404.0, 404.0, 0.24339783375927954, 0.40241458257271506, 0.23763377373128877], "isController": false}, {"data": ["Envio CAD2003 - schema_4", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 8.949722782258064, 3.5471270161290325], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 4, 1, 25.0, 1518.0, 164, 5381, 263.5, 5381.0, 5381.0, 5381.0, 0.18437427978796958, 0.3048297418760083, 0.18000799435353768], "isController": true}, {"data": ["Envio CAD2003 - schema_3", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 6.407422777136259, 2.5327475461893765], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_3", 4, 1, 25.0, 1529.5, 140, 5504, 237.0, 5504.0, 5504.0, 5504.0, 0.18543414769829863, 0.30658204302072223, 0.18104276285290435], "isController": true}, {"data": ["Envio CAD2003 - schema_2", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 4.41083316772655, 1.7248981518282989], "isController": false}, {"data": ["Envio CAD2003 - schema_1", 1, 0, 0.0, 743.0, 743, 743, 743.0, 743.0, 743.0, 743.0, 1.3458950201884252, 3.7340700706594885, 1.4641865746971736], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 4, 1, 25.0, 1516.0, 147, 5363, 277.0, 5363.0, 5363.0, 5363.0, 0.18279029383539735, 0.302210905725906, 0.17846151978704933], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_6", 4, 1, 25.0, 1508.0, 118, 5412, 251.0, 5412.0, 5412.0, 5412.0, 0.1901321418385778, 0.3143493321608518, 0.18562950078429508], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_4", 4, 1, 25.0, 1542.5, 228, 5405, 268.5, 5405.0, 5405.0, 5405.0, 0.18661068346162818, 0.3085272334966177, 0.18219143631910428], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_5", 5, 1, 20.0, 1242.2, 169, 5260, 273.0, 5260.0, 5260.0, 5260.0, 0.19029495718363462, 0.2993428877259753, 0.18628092293054235], "isController": true}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 6.407422777136259, 2.5327475461893765], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 12, 100.0, 27.906976744186046], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 43, 12, "Assertion failed", 12, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_3", 4, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta PAR2101 schema_2", 4, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 4, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_6", 4, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_5", 5, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_4", 4, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_3", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_6", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_4", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_5", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
