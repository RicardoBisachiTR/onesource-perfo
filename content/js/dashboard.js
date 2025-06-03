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

    var data = {"OkPercent": 99.7713632466419, "KoPercent": 0.22863675335810232};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9979235285693828, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2002 - schema_2-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_4-0"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_6-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_8-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  10 - schema_10"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [0.9985935302390999, 500, 1500, "Controller Consultas  CAD2002 - schema_10"], "isController": true}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  9 - schema_9"], "isController": true}, {"data": [0.9985935302390999, 500, 1500, "Controller Consultas  CAD2002 - schema_7"], "isController": true}, {"data": [0.9985935302390999, 500, 1500, "Consulta CAD2002 -  schema_6"], "isController": false}, {"data": [0.9984375, 500, 1500, "Controller Consultas  CAD2002 - schema_8"], "isController": true}, {"data": [0.9985935302390999, 500, 1500, "Consulta CAD2002 -  schema_7"], "isController": false}, {"data": [0.9984375, 500, 1500, "Consulta CAD2002 -  schema_8"], "isController": false}, {"data": [0.9985935302390999, 500, 1500, "Controller Consultas  CAD2002 - schema_9"], "isController": true}, {"data": [0.9985935302390999, 500, 1500, "Consulta CAD2002 -  schema_9"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_1-0"], "isController": false}, {"data": [0.9985935302390999, 500, 1500, "Controller Consultas  CAD2002 - schema_1"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_3-0"], "isController": false}, {"data": [0.9985935302390999, 500, 1500, "Consulta CAD2002 -  schema_1"], "isController": false}, {"data": [0.9985935302390999, 500, 1500, "Controller Consultas  CAD2002 - schema_2"], "isController": true}, {"data": [0.9985935302390999, 500, 1500, "Controller Consultas  CAD2002 - schema_3"], "isController": true}, {"data": [0.9985935302390999, 500, 1500, "Consulta CAD2002 -  schema_2"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_5-0"], "isController": false}, {"data": [0.9985935302390999, 500, 1500, "Consulta CAD2002 -  schema_3"], "isController": false}, {"data": [0.9985935302390999, 500, 1500, "Controller Consultas  CAD2002 - schema_4"], "isController": true}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  8 - schema_8"], "isController": true}, {"data": [0.9985935302390999, 500, 1500, "Consulta CAD2002 -  schema_4"], "isController": false}, {"data": [0.9984375, 500, 1500, "Controller Consultas  CAD2002 - schema_5"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_7-0"], "isController": false}, {"data": [0.9985935302390999, 500, 1500, "Controller Consultas  CAD2002 - schema_6"], "isController": true}, {"data": [0.9984375, 500, 1500, "Consulta CAD2002 -  schema_5"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_9-0"], "isController": false}, {"data": [0.9985935302390999, 500, 1500, "Consulta CAD2002 -  schema_10"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_10"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  5 - schema_5"], "isController": true}, {"data": [0.0, 500, 1500, "Envio CAD2002 - schema_2"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2002 - schema_3"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_10-0"], "isController": false}, {"data": [0.0, 500, 1500, "Envio CAD2002 - schema_1"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  6 - schema_6"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  7 - schema_7"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_8"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_9"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2002 - schema_6"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2002 - schema_7"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2002 - schema_4"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2002 - schema_5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6998, 16, 0.22863675335810232, 68.98899685624463, 0, 19073, 44.0, 85.0, 96.04999999999927, 191.01000000000022, 1.9457676356393008, 2.3465085771880014, 2.011868786361498], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2002 - schema_2-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 531.5755208333334, 0.0], "isController": false}, {"data": ["Envio CAD2002 - schema_4-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 797.8515625, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 1953.0, 1953, 1953, 1953.0, 1953.0, 1953.0, 1953.0, 0.5120327700972862, 1.4290914618535586, 17.068092357910906], "isController": true}, {"data": ["Envio CAD2002 - schema_6-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1595.703125, 0.0], "isController": false}, {"data": ["Envio CAD2002 - schema_8-0", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 398.92578125, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  10 - schema_10", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 9.535649530716723, 113.68787329351537], "isController": true}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 1246.0, 1246, 1246, 1246.0, 1246.0, 1246.0, 1246.0, 0.8025682182985554, 2.239980437399679, 26.748093900481543], "isController": true}, {"data": ["Controller Consultas  CAD2002 - schema_10", 711, 1, 0.14064697609001406, 58.31082981715897, 31, 5039, 44.0, 82.0, 94.0, 144.88, 0.19794840813008355, 0.23824993448701157, 0.19580759940225706], "isController": true}, {"data": ["Controller Envios - Thread  9 - schema_9", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 7.951611467236468, 94.91853632478633], "isController": true}, {"data": ["Controller Consultas  CAD2002 - schema_7", 711, 1, 0.14064697609001406, 59.691983122362885, 27, 5036, 40.0, 86.0, 106.79999999999995, 245.43999999999994, 0.19789507552995383, 0.23780058880743304, 0.19575484359330697], "isController": true}, {"data": ["Consulta CAD2002 -  schema_6", 711, 1, 0.14064697609001406, 52.75386779184243, 31, 250, 45.0, 85.0, 96.0, 120.75999999999999, 0.19816539536086727, 0.23857043499464314, 0.19602223991976392], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_8", 640, 0, 0.0, 83.4328125, 33, 19073, 45.0, 85.89999999999998, 95.94999999999993, 144.7700000000001, 0.1969470135601096, 0.23657833269351197, 0.19481544439631893], "isController": true}, {"data": ["Consulta CAD2002 -  schema_7", 711, 1, 0.14064697609001406, 52.65963431786218, 27, 392, 40.0, 86.0, 106.0, 233.88, 0.19817091865460065, 0.238132055658156, 0.19602770347916781], "isController": false}, {"data": ["Consulta CAD2002 -  schema_8", 640, 0, 0.0, 75.6203125, 33, 14073, 45.0, 85.89999999999998, 95.94999999999993, 144.7700000000001, 0.19725063436112214, 0.2369430506020305, 0.19511577909146358], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_9", 711, 1, 0.14064697609001406, 58.67510548523209, 31, 5053, 44.0, 83.0, 92.0, 135.31999999999994, 0.19793496207916897, 0.23841155044112214, 0.19579429877015853], "isController": true}, {"data": ["Consulta CAD2002 -  schema_9", 711, 1, 0.14064697609001406, 51.64275668073139, 31, 279, 44.0, 83.0, 92.0, 122.88, 0.19821091648713388, 0.23874393597606192, 0.1960672687358102], "isController": false}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 1475.0, 1475, 1475, 1475.0, 1475.0, 1475.0, 1475.0, 0.6779661016949153, 1.8922139830508473, 22.58739406779661], "isController": true}, {"data": ["Envio CAD2002 - schema_1-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1595.703125, 0.0], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_1", 711, 1, 0.14064697609001406, 60.35864978902954, 28, 5071, 41.0, 88.0, 104.39999999999998, 218.76, 0.19786137181101596, 0.23808593342354437, 0.19572150437952648], "isController": true}, {"data": ["Envio CAD2002 - schema_3-0", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 398.92578125, 0.0], "isController": false}, {"data": ["Consulta CAD2002 -  schema_1", 711, 1, 0.14064697609001406, 53.324894514767934, 28, 348, 41.0, 88.0, 102.79999999999995, 217.0, 0.19813712091993588, 0.23841774141308272, 0.19599427126643898], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_2", 711, 1, 0.14064697609001406, 59.99578059071735, 27, 5046, 40.0, 88.0, 106.0, 225.51999999999998, 0.1978570220041497, 0.23728091630759282, 0.19571720161574888], "isController": true}, {"data": ["Controller Consultas  CAD2002 - schema_3", 711, 1, 0.14064697609001406, 60.37552742616039, 31, 5148, 45.0, 86.0, 96.39999999999998, 138.79999999999995, 0.19784771736326595, 0.2386322868691726, 0.19570799760440086], "isController": true}, {"data": ["Consulta CAD2002 -  schema_2", 711, 1, 0.14064697609001406, 52.963431786216645, 27, 380, 40.0, 87.80000000000007, 104.19999999999993, 220.07999999999993, 0.1981328141937778, 0.23761166132135358, 0.19599001111745235], "isController": false}, {"data": ["Envio CAD2002 - schema_5-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Consulta CAD2002 -  schema_3", 711, 1, 0.14064697609001406, 53.34317862165969, 31, 248, 45.0, 86.0, 96.39999999999998, 138.79999999999995, 0.19812359401215324, 0.23896503306657707, 0.1959808906519381], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_4", 711, 1, 0.14064697609001406, 60.26863572433194, 31, 5038, 45.0, 85.0, 94.0, 134.64, 0.19782630349726857, 0.23878416068643224, 0.19568681532900659], "isController": true}, {"data": ["Controller Envios - Thread  8 - schema_8", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 7.709987914364641, 92.01808529005525], "isController": true}, {"data": ["Consulta CAD2002 -  schema_4", 711, 1, 0.14064697609001406, 53.236286919831244, 31, 254, 45.0, 84.80000000000007, 94.0, 131.27999999999997, 0.19810200999704658, 0.239116949319599, 0.1959595400675943], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_5", 640, 0, 0.0, 80.6515625, 33, 18568, 45.0, 77.0, 91.94999999999993, 116.54000000000019, 0.19710769101891126, 0.2366074274643697, 0.1949743828334908], "isController": true}, {"data": ["Envio CAD2002 - schema_7-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_6", 711, 1, 0.14064697609001406, 59.78621659634314, 31, 5042, 45.0, 85.0, 96.0, 121.88, 0.19788956760155338, 0.2382383671863193, 0.1957493952330602], "isController": true}, {"data": ["Consulta CAD2002 -  schema_5", 640, 0, 0.0, 72.8390625, 33, 13568, 45.0, 77.0, 91.94999999999993, 116.54000000000019, 0.19741180781713744, 0.23697248827404707, 0.19527520815764196], "isController": false}, {"data": ["Envio CAD2002 - schema_9-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Consulta CAD2002 -  schema_10", 711, 1, 0.14064697609001406, 51.27848101265827, 31, 249, 44.0, 82.0, 93.39999999999998, 142.19999999999993, 0.1982244000575436, 0.23858211729796444, 0.1960806064816312], "isController": false}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 1699.0, 1699, 1699, 1699.0, 1699.0, 1699.0, 1699.0, 0.5885815185403178, 1.6421654281930547, 19.61459406268393], "isController": true}, {"data": ["Envio CAD2002 - schema_10", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 9.535649530716723, 113.68787329351537], "isController": false}, {"data": ["Controller Envios - Thread  5 - schema_5", 1, 0, 0.0, 1153.0, 1153, 1153, 1153.0, 1153.0, 1153.0, 1153.0, 0.8673026886383347, 2.419808380312229, 28.90811334562012], "isController": true}, {"data": ["Envio CAD2002 - schema_2", 1, 0, 0.0, 1699.0, 1699, 1699, 1699.0, 1699.0, 1699.0, 1699.0, 0.5885815185403178, 1.6421654281930547, 19.61459406268393], "isController": false}, {"data": ["Envio CAD2002 - schema_3", 1, 0, 0.0, 1475.0, 1475, 1475, 1475.0, 1475.0, 1475.0, 1475.0, 0.6779661016949153, 1.8922139830508473, 22.58739406779661], "isController": false}, {"data": ["Envio CAD2002 - schema_10-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2002 - schema_1", 1, 0, 0.0, 1953.0, 1953, 1953, 1953.0, 1953.0, 1953.0, 1953.0, 0.5120327700972862, 1.4290914618535586, 17.068092357910906], "isController": false}, {"data": ["Controller Envios - Thread  6 - schema_6", 1, 0, 0.0, 928.0, 928, 928, 928.0, 928.0, 928.0, 928.0, 1.0775862068965516, 3.0075599407327585, 35.901299838362064], "isController": true}, {"data": ["Controller Envios - Thread  7 - schema_7", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 3.947688295615276, 47.13191743281471], "isController": true}, {"data": ["Envio CAD2002 - schema_8", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 7.709987914364641, 92.01808529005525], "isController": false}, {"data": ["Envio CAD2002 - schema_9", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 7.951611467236468, 94.91853632478633], "isController": false}, {"data": ["Envio CAD2002 - schema_6", 1, 0, 0.0, 928.0, 928, 928, 928.0, 928.0, 928.0, 928.0, 1.0775862068965516, 3.0075599407327585, 35.901299838362064], "isController": false}, {"data": ["Envio CAD2002 - schema_7", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 3.947688295615276, 47.13191743281471], "isController": false}, {"data": ["Envio CAD2002 - schema_4", 1, 0, 0.0, 1246.0, 1246, 1246, 1246.0, 1246.0, 1246.0, 1246.0, 0.8025682182985554, 2.239980437399679, 26.748093900481543], "isController": false}, {"data": ["Envio CAD2002 - schema_5", 1, 0, 0.0, 1153.0, 1153, 1153, 1153.0, 1153.0, 1153.0, 1153.0, 0.8673026886383347, 2.419808380312229, 28.90811334562012], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 16, 100.0, 0.22863675335810232], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6998, 16, "Assertion failed", 16, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_10", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_7", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2002 -  schema_6", 711, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2002 -  schema_7", 711, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_9", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2002 -  schema_9", 711, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_1", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2002 -  schema_1", 711, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_2", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_3", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2002 -  schema_2", 711, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2002 -  schema_3", 711, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_4", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2002 -  schema_4", 711, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_6", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2002 -  schema_10", 711, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
