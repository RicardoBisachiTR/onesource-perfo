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

    var data = {"OkPercent": 68.42105263157895, "KoPercent": 31.57894736842105};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6724137931034483, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2003 - schema_1-0"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [0.5, 500, 1500, "Consulta PAR2101 schema_3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "Consulta PAR2101 schema_2"], "isController": false}, {"data": [0.5, 500, 1500, "Consulta PAR2101 schema_1"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_6-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_5-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  5 - schema_5"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  6 - schema_6"], "isController": true}, {"data": [0.5, 500, 1500, "Consulta PAR2101 schema_6"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_6"], "isController": false}, {"data": [0.5, 500, 1500, "Consulta PAR2101 schema_5"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "Consulta PAR2101 schema_4"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "Controller Consultas  CAD2003 - schema_2"], "isController": true}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_3"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Consultas  CAD2003 - schema_3"], "isController": true}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_2"], "isController": false}, {"data": [0.0, 500, 1500, "Envio CAD2003 - schema_1"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Consultas  CAD2003 - schema_1"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Consultas  CAD2003 - schema_6"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "Controller Consultas  CAD2003 - schema_4"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Consultas  CAD2003 - schema_5"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 38, 12, 31.57894736842105, 1118.7368421052631, 0, 5357, 184.0, 5304.9, 5342.75, 5357.0, 1.135989955457236, 2.318981962422648, 0.9572069968012914], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2003 - schema_1-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 1611.0, 1611, 1611, 1611.0, 1611.0, 1611.0, 1611.0, 0.6207324643078833, 1.7221688780260709, 0.6771075806952204], "isController": true}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 1072.0, 1072, 1072, 1072.0, 1072.0, 1072.0, 1072.0, 0.9328358208955224, 2.5889837919776117, 1.0366866837686566], "isController": true}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 1485.0, 1485, 1485, 1485.0, 1485.0, 1485.0, 1485.0, 0.6734006734006734, 1.8689499158249157, 0.7404776936026936], "isController": true}, {"data": ["Consulta PAR2101 schema_3", 2, 1, 50.0, 240.0, 139, 341, 240.0, 341.0, 341.0, 341.0, 0.34429333792391115, 0.7074152177655362, 0.3316849393182992], "isController": false}, {"data": ["Consulta PAR2101 schema_2", 6, 1, 16.666666666666668, 132.5, 62, 229, 127.0, 229.0, 229.0, 229.0, 0.227859638462707, 0.33815497778368525, 0.22344634142867992], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 2, 1, 50.0, 210.0, 127, 293, 210.0, 293.0, 293.0, 293.0, 0.36893562073418185, 0.7580474082272644, 0.35542479477956096], "isController": false}, {"data": ["Envio CAD2003 - schema_6-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_5-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.296875, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  5 - schema_5", 1, 0, 0.0, 877.0, 877, 877, 877.0, 877.0, 877.0, 877.0, 1.1402508551881414, 3.1635280074116308, 1.2371276368301025], "isController": true}, {"data": ["Envio CAD2003 - schema_4-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 794.43359375, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_3-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_2-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  6 - schema_6", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 3.844031336565097, 1.5392356301939059], "isController": true}, {"data": ["Consulta PAR2101 schema_6", 2, 1, 50.0, 246.0, 136, 356, 246.0, 356.0, 356.0, 356.0, 0.3553028957186001, 0.7300364185468112, 0.3422913150648428], "isController": false}, {"data": ["Envio CAD2003 - schema_6", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 3.844031336565097, 1.5392356301939059], "isController": false}, {"data": ["Consulta PAR2101 schema_5", 2, 1, 50.0, 241.5, 181, 302, 241.5, 302.0, 302.0, 302.0, 0.3137254901960784, 0.6446078431372549, 0.30223651960784315], "isController": false}, {"data": ["Envio CAD2003 - schema_5", 1, 0, 0.0, 877.0, 877, 877, 877.0, 877.0, 877.0, 877.0, 1.1402508551881414, 3.1635280074116308, 1.2371276368301025], "isController": false}, {"data": ["Consulta PAR2101 schema_4", 6, 1, 16.666666666666668, 154.5, 61, 321, 124.0, 321.0, 321.0, 321.0, 0.22536057692307693, 0.3344462468073918, 0.22099568293644833], "isController": false}, {"data": ["Envio CAD2003 - schema_4", 1, 0, 0.0, 1072.0, 1072, 1072, 1072.0, 1072.0, 1072.0, 1072.0, 0.9328358208955224, 2.5889837919776117, 1.0366866837686566], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 6, 1, 16.666666666666668, 965.8333333333334, 62, 5229, 127.0, 5229.0, 5229.0, 5229.0, 0.19147917663954045, 0.28416457236317216, 0.18777051420137225], "isController": true}, {"data": ["Envio CAD2003 - schema_3", 1, 0, 0.0, 1294.0, 1294, 1294, 1294.0, 1294.0, 1294.0, 1294.0, 0.7727975270479134, 2.144815011591963, 0.8588316267387944], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_3", 2, 1, 50.0, 2740.5, 139, 5342, 2740.5, 5342.0, 5342.0, 5342.0, 0.1849112426035503, 0.3799348187869822, 0.17813959065273668], "isController": true}, {"data": ["Envio CAD2003 - schema_2", 1, 0, 0.0, 1485.0, 1485, 1485, 1485.0, 1485.0, 1485.0, 1485.0, 0.6734006734006734, 1.8689499158249157, 0.7404776936026936], "isController": false}, {"data": ["Envio CAD2003 - schema_1", 1, 0, 0.0, 1611.0, 1611, 1611, 1611.0, 1611.0, 1611.0, 1611.0, 0.6207324643078833, 1.7221688780260709, 0.6771075806952204], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 2, 1, 50.0, 2710.0, 127, 5293, 2710.0, 5293.0, 5293.0, 5293.0, 0.19188333493236112, 0.39426028974383576, 0.18485635733474048], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_6", 2, 1, 50.0, 2746.5, 136, 5357, 2746.5, 5357.0, 5357.0, 5357.0, 0.18812905653278147, 0.3865464208446995, 0.18123956471639543], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_4", 6, 1, 16.666666666666668, 988.0000000000001, 61, 5322, 124.0, 5322.0, 5322.0, 5322.0, 0.18972332015810275, 0.28155879446640314, 0.18604866600790515], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_5", 2, 1, 50.0, 2742.0, 181, 5303, 2742.0, 5303.0, 5303.0, 5303.0, 0.17579326711786938, 0.3612002285312472, 0.1693555254021271], "isController": true}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 1294.0, 1294, 1294, 1294.0, 1294.0, 1294.0, 1294.0, 0.7727975270479134, 2.144815011591963, 0.8588316267387944], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 12, 100.0, 31.57894736842105], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 38, 12, "Assertion failed", 12, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_3", 2, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta PAR2101 schema_2", 6, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta PAR2101 schema_1", 2, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_6", 2, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_5", 2, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta PAR2101 schema_4", 6, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_3", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_6", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_4", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_5", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
