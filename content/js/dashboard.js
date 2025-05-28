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

    var data = {"OkPercent": 99.89023051591657, "KoPercent": 0.10976948408342481};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9922523519645822, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2003 - schema_1-0"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_10-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  10 - schema_10"], "isController": true}, {"data": [0.9962406015037594, 500, 1500, "Controller Consultas  CAD2003 - schema_8"], "isController": true}, {"data": [0.9911504424778761, 500, 1500, "Controller Consultas  CAD2003 - schema_9"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [0.9959677419354839, 500, 1500, "Consulta CAD2003 -  schema_10"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  9 - schema_9"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_9-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_7-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_5-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3-0"], "isController": false}, {"data": [0.9959677419354839, 500, 1500, "Controller Consultas  CAD2003 - schema_10"], "isController": true}, {"data": [0.9939759036144579, 500, 1500, "Controller Consultas  CAD2003 - schema_2"], "isController": true}, {"data": [0.9833333333333333, 500, 1500, "Controller Consultas  CAD2003 - schema_3"], "isController": true}, {"data": [0.9950248756218906, 500, 1500, "Controller Consultas  CAD2003 - schema_1"], "isController": true}, {"data": [0.994535519125683, 500, 1500, "Controller Consultas  CAD2003 - schema_6"], "isController": true}, {"data": [0.9894736842105263, 500, 1500, "Controller Consultas  CAD2003 - schema_7"], "isController": true}, {"data": [0.9956521739130435, 500, 1500, "Controller Consultas  CAD2003 - schema_4"], "isController": true}, {"data": [0.9956521739130435, 500, 1500, "Controller Consultas  CAD2003 - schema_5"], "isController": true}, {"data": [0.9962406015037594, 500, 1500, "Consulta CAD2003 -  schema_8"], "isController": false}, {"data": [0.9894736842105263, 500, 1500, "Consulta CAD2003 -  schema_7"], "isController": false}, {"data": [0.994535519125683, 500, 1500, "Consulta CAD2003 -  schema_6"], "isController": false}, {"data": [0.9956521739130435, 500, 1500, "Consulta CAD2003 -  schema_5"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}, {"data": [0.9911504424778761, 500, 1500, "Consulta CAD2003 -  schema_9"], "isController": false}, {"data": [0.9956521739130435, 500, 1500, "Consulta CAD2003 -  schema_4"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Consulta CAD2003 -  schema_3"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  8 - schema_8"], "isController": true}, {"data": [0.9939759036144579, 500, 1500, "Consulta CAD2003 -  schema_2"], "isController": false}, {"data": [0.9950248756218906, 500, 1500, "Consulta CAD2003 -  schema_1"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_8-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_10"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_6-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  5 - schema_5"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  6 - schema_6"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_9"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_8"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_7"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_6"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_5"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_4"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_3"], "isController": false}, {"data": [0.0, 500, 1500, "Envio CAD2003 - schema_2"], "isController": false}, {"data": [0.0, 500, 1500, "Envio CAD2003 - schema_1"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  7 - schema_7"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1822, 2, 0.10976948408342481, 206.67727771679495, 0, 12187, 104.0, 210.0, 279.8499999999999, 3926.119999999999, 1.3308877722677175, 2.077068974199258, 1.4875787840638242], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2003 - schema_1-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 1725.0, 1725, 1725, 1725.0, 1725.0, 1725.0, 1725.0, 0.5797101449275363, 1.6089221014492754, 14.753170289855072], "isController": true}, {"data": ["Envio CAD2003 - schema_10-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Envios - Thread  10 - schema_10", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 8.709468064263323, 79.76893123040752], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_8", 266, 0, 0.0, 150.69172932330832, 82, 8883, 92.5, 162.50000000000017, 271.89999999999986, 369.27999999999975, 0.19483625331349813, 0.23441379786764172, 0.19270537485286565], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_9", 113, 0, 0.0, 204.14159292035401, 83, 8962, 106.0, 191.20000000000044, 284.49999999999994, 7774.239999999995, 0.19377585107039721, 0.231463606258617, 0.19160551866764525], "isController": true}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 1163.0, 1163, 1163, 1163.0, 1163.0, 1163.0, 1163.0, 0.8598452278589854, 2.386406384350817, 21.884908372742906], "isController": true}, {"data": ["Consulta CAD2003 -  schema_10", 248, 0, 0.0, 138.58870967741933, 83, 4058, 100.5, 207.1, 260.65, 375.0799999999999, 0.1953518854607784, 0.23207805838933948, 0.1932126087727963], "isController": false}, {"data": ["Controller Envios - Thread  9 - schema_9", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 8.510472584355828, 77.9931940184049], "isController": true}, {"data": ["Envio CAD2003 - schema_9-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_7-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_5-0", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 397.216796875, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_3-0", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 397.216796875, 0.0], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_10", 248, 0, 0.0, 158.75, 83, 9058, 100.5, 207.1, 260.65, 375.0799999999999, 0.19458534882169942, 0.23116741278967126, 0.1924544663908733], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_2", 166, 0, 0.0, 178.9518072289157, 83, 8939, 104.0, 166.7000000000001, 274.85, 3234.6200000001063, 0.19419974496659997, 0.2326686232875911, 0.19205306456849053], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_3", 60, 0, 0.0, 284.8166666666666, 87, 9280, 111.0, 288.2999999999999, 319.79999999999995, 9280.0, 0.19196252891435592, 0.23283580045175184, 0.18973483875947417], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_1", 201, 1, 0.4975124378109453, 188.3034825870646, 82, 12187, 106.0, 193.80000000000007, 265.9, 429.37999999999965, 0.19351894463817734, 0.5387802322203267, 0.1913902964209586], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_6", 183, 0, 0.0, 177.4043715846994, 84, 8873, 108.0, 176.59999999999988, 277.19999999999993, 1777.519999999971, 0.1939633928543038, 0.232904707136475, 0.1918249431358687], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_7", 95, 0, 0.0, 230.1473684210527, 83, 9567, 106.0, 230.00000000000034, 328.7999999999989, 9567.0, 0.19312122524236713, 0.2305265513732952, 0.19094146470252216], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_4", 230, 0, 0.0, 172.79565217391297, 85, 10574, 106.5, 186.90000000000012, 258.0499999999999, 436.03999999999996, 0.19411019044741554, 0.23448250566084392, 0.19198134099970124], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_5", 230, 0, 0.0, 172.16956521739127, 84, 10428, 106.0, 181.2000000000001, 261.5499999999998, 458.60999999999984, 0.19409741327221233, 0.23329928892834598, 0.19196870395460822], "isController": true}, {"data": ["Consulta CAD2003 -  schema_8", 266, 0, 0.0, 131.89473684210532, 82, 3883, 92.5, 162.50000000000017, 271.89999999999986, 369.27999999999975, 0.19555271946933167, 0.23527580147208557, 0.19341400518619045], "isController": false}, {"data": ["Consulta CAD2003 -  schema_7", 95, 0, 0.0, 177.51578947368426, 83, 4567, 106.0, 230.00000000000034, 328.7999999999989, 4567.0, 0.1951051205852332, 0.23289470407687554, 0.19290296780560137], "isController": false}, {"data": ["Consulta CAD2003 -  schema_6", 183, 0, 0.0, 150.08196721311467, 84, 3873, 108.0, 176.59999999999988, 277.19999999999993, 977.5199999999883, 0.1949969951282718, 0.23414582192299005, 0.19284714992711588], "isController": false}, {"data": ["Consulta CAD2003 -  schema_5", 230, 0, 0.0, 150.42608695652171, 84, 5427, 106.0, 181.2000000000001, 261.5499999999998, 458.60999999999984, 0.1949202098358433, 0.23428826580336787, 0.1927824767261032], "isController": false}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 1372.0, 1372, 1372, 1372.0, 1372.0, 1372.0, 1372.0, 0.7288629737609329, 2.022879464285714, 18.53831655430029], "isController": true}, {"data": ["Consulta CAD2003 -  schema_9", 113, 0, 0.0, 159.89380530973457, 83, 3962, 106.0, 191.20000000000044, 284.49999999999994, 3474.239999999998, 0.19545202171766005, 0.23346577784283234, 0.1932629158328245], "isController": false}, {"data": ["Consulta CAD2003 -  schema_4", 230, 0, 0.0, 151.05652173913035, 85, 5574, 106.5, 186.90000000000012, 258.0499999999999, 436.03999999999996, 0.19493326078425888, 0.23547676358451755, 0.19279538454187717], "isController": false}, {"data": ["Consulta CAD2003 -  schema_3", 60, 0, 0.0, 201.48333333333332, 87, 4280, 111.0, 288.2999999999999, 319.79999999999995, 4280.0, 0.19508515467001344, 0.2366233056041462, 0.19282122701246596], "isController": false}, {"data": ["Controller Envios - Thread  8 - schema_8", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 8.35961031626506, 76.64544898343374], "isController": true}, {"data": ["Consulta CAD2003 -  schema_2", 166, 0, 0.0, 148.83132530120483, 83, 3939, 104.0, 166.7000000000001, 274.85, 1584.620000000044, 0.19534260857695263, 0.23403787587271666, 0.19318329498557876], "isController": false}, {"data": ["Consulta CAD2003 -  schema_1", 201, 1, 0.4975124378109453, 163.42786069651734, 82, 7187, 106.0, 193.80000000000007, 265.9, 429.37999999999965, 0.1944552206389547, 0.5413869382565978, 0.192316273676858], "isController": false}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 1617.0, 1617, 1617, 1617.0, 1617.0, 1617.0, 1617.0, 0.6184291898577613, 1.7157786410018554, 15.725857104205318], "isController": true}, {"data": ["Envio CAD2003 - schema_8-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_10", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 8.709468064263323, 79.76893123040752], "isController": false}, {"data": ["Envio CAD2003 - schema_6-0", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 396.97265625, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  5 - schema_5", 1, 0, 0.0, 922.0, 922, 922, 922.0, 922.0, 922.0, 922.0, 1.0845986984815619, 3.0101850596529283, 27.592656927874184], "isController": true}, {"data": ["Envio CAD2003 - schema_4-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_2-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Envios - Thread  6 - schema_6", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 3.974805247134671, 36.43081796203439], "isController": true}, {"data": ["Envio CAD2003 - schema_9", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 8.510472584355828, 77.9931940184049], "isController": false}, {"data": ["Envio CAD2003 - schema_8", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 8.35961031626506, 76.64544898343374], "isController": false}, {"data": ["Envio CAD2003 - schema_7", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 5.6640625, 51.90728635204082], "isController": false}, {"data": ["Envio CAD2003 - schema_6", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 3.974805247134671, 36.43081796203439], "isController": false}, {"data": ["Envio CAD2003 - schema_5", 1, 0, 0.0, 922.0, 922, 922, 922.0, 922.0, 922.0, 922.0, 1.0845986984815619, 3.0101850596529283, 27.592656927874184], "isController": false}, {"data": ["Envio CAD2003 - schema_4", 1, 0, 0.0, 1163.0, 1163, 1163, 1163.0, 1163.0, 1163.0, 1163.0, 0.8598452278589854, 2.386406384350817, 21.884908372742906], "isController": false}, {"data": ["Envio CAD2003 - schema_3", 1, 0, 0.0, 1372.0, 1372, 1372, 1372.0, 1372.0, 1372.0, 1372.0, 0.7288629737609329, 2.022879464285714, 18.53831655430029], "isController": false}, {"data": ["Envio CAD2003 - schema_2", 1, 0, 0.0, 1617.0, 1617, 1617, 1617.0, 1617.0, 1617.0, 1617.0, 0.6184291898577613, 1.7157786410018554, 15.725857104205318], "isController": false}, {"data": ["Envio CAD2003 - schema_1", 1, 0, 0.0, 1725.0, 1725, 1725, 1725.0, 1725.0, 1725.0, 1725.0, 0.5797101449275363, 1.6089221014492754, 14.753170289855072], "isController": false}, {"data": ["Controller Envios - Thread  7 - schema_7", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 5.6640625, 51.90728635204082], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 2, 100.0, 0.10976948408342481], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1822, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2003 -  schema_1", 201, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
