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

    var data = {"OkPercent": 84.61538461538461, "KoPercent": 15.384615384615385};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8695652173913043, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2003 - schema_1-0"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_10-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  10 - schema_10"], "isController": true}, {"data": [0.9, 500, 1500, "Controller Consultas  CAD2003 - schema_8"], "isController": true}, {"data": [0.9, 500, 1500, "Controller Consultas  CAD2003 - schema_9"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [0.9, 500, 1500, "Consulta CAD2003 -  schema_10"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  9 - schema_9"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_9-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_7-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_5-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3-0"], "isController": false}, {"data": [0.9, 500, 1500, "Controller Consultas  CAD2003 - schema_10"], "isController": true}, {"data": [0.9, 500, 1500, "Controller Consultas  CAD2003 - schema_2"], "isController": true}, {"data": [0.9, 500, 1500, "Controller Consultas  CAD2003 - schema_3"], "isController": true}, {"data": [0.9, 500, 1500, "Controller Consultas  CAD2003 - schema_1"], "isController": true}, {"data": [0.9, 500, 1500, "Controller Consultas  CAD2003 - schema_6"], "isController": true}, {"data": [0.9, 500, 1500, "Controller Consultas  CAD2003 - schema_7"], "isController": true}, {"data": [0.9, 500, 1500, "Controller Consultas  CAD2003 - schema_4"], "isController": true}, {"data": [0.9, 500, 1500, "Controller Consultas  CAD2003 - schema_5"], "isController": true}, {"data": [0.9, 500, 1500, "Consulta CAD2003 -  schema_8"], "isController": false}, {"data": [0.9, 500, 1500, "Consulta CAD2003 -  schema_7"], "isController": false}, {"data": [0.9, 500, 1500, "Consulta CAD2003 -  schema_6"], "isController": false}, {"data": [0.9, 500, 1500, "Consulta CAD2003 -  schema_5"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}, {"data": [0.9, 500, 1500, "Consulta CAD2003 -  schema_9"], "isController": false}, {"data": [0.9, 500, 1500, "Consulta CAD2003 -  schema_4"], "isController": false}, {"data": [0.9, 500, 1500, "Consulta CAD2003 -  schema_3"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  8 - schema_8"], "isController": true}, {"data": [0.9, 500, 1500, "Consulta CAD2003 -  schema_2"], "isController": false}, {"data": [0.9, 500, 1500, "Consulta CAD2003 -  schema_1"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_8-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_10"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_6-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  5 - schema_5"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_9"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  6 - schema_6"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_8"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_7"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_6"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_5"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_4"], "isController": false}, {"data": [0.0, 500, 1500, "Envio CAD2003 - schema_3"], "isController": false}, {"data": [0.0, 500, 1500, "Envio CAD2003 - schema_2"], "isController": false}, {"data": [0.0, 500, 1500, "Envio CAD2003 - schema_1"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  7 - schema_7"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 130, 20, 15.384615384615385, 515.5923076923077, 0, 5106, 52.0, 1517.3000000000013, 5051.95, 5101.66, 2.384227418615314, 3.2399845254470425, 3.1014120529573592], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2003 - schema_1-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1587.890625, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 1876.0, 1876, 1876, 1876.0, 1876.0, 1876.0, 1876.0, 0.5330490405117271, 1.478898753997868, 3.237856476545842], "isController": true}, {"data": ["Envio CAD2003 - schema_10-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Envios - Thread  10 - schema_10", 1, 0, 0.0, 130.0, 130, 130, 130.0, 130.0, 130.0, 130.0, 7.6923076923076925, 21.36418269230769, 46.81490384615385], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_8", 10, 1, 10.0, 576.5, 50, 5106, 56.0, 4610.800000000002, 5106.0, 5106.0, 0.19426906265177268, 0.23494414764448762, 0.19117669378339], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_9", 10, 1, 10.0, 556.7, 44, 5059, 48.5, 4565.300000000002, 5059.0, 5059.0, 0.19769878612945319, 0.24750961310347555, 0.1945518230299316], "isController": true}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 1322.0, 1322, 1322, 1322.0, 1322.0, 1322.0, 1322.0, 0.7564296520423601, 2.0986490639183053, 4.5902869704992435], "isController": true}, {"data": ["Consulta CAD2003 -  schema_10", 10, 1, 10.0, 51.4, 42, 108, 46.0, 101.90000000000002, 108.0, 108.0, 0.21963540522732264, 0.26795948413134196, 0.21613925571052053], "isController": false}, {"data": ["Controller Envios - Thread  9 - schema_9", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 11.657201943277311, 25.59578518907563], "isController": true}, {"data": ["Envio CAD2003 - schema_9-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1587.890625, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_7-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 793.9453125, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_5-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.296875, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_3-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 793.9453125, 0.0], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_10", 10, 1, 10.0, 551.5, 42, 5047, 46.0, 4553.100000000002, 5047.0, 5047.0, 0.19789831984326453, 0.24143981541034218, 0.19474818057232193], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_2", 10, 1, 10.0, 577.1, 49, 5092, 77.5, 4594.9000000000015, 5092.0, 5092.0, 0.19584802193497844, 0.23059957035840187, 0.19273051924206816], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_3", 10, 1, 10.0, 551.7, 43, 5044, 46.5, 4550.4000000000015, 5044.0, 5044.0, 0.19788657141726362, 0.24142548210115963, 0.19473661915739898], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_1", 10, 1, 10.0, 572.9000000000001, 49, 5060, 75.5, 4565.700000000002, 5060.0, 5060.0, 0.19683102056884164, 0.2317569936521996, 0.19369787053439622], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_6", 10, 1, 10.0, 551.8, 42, 5045, 46.0, 4551.500000000002, 5045.0, 5045.0, 0.19787873990818428, 0.24141592750712362, 0.19472891231003642], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_7", 10, 1, 10.0, 552.6, 45, 5046, 46.5, 4552.300000000002, 5046.0, 5046.0, 0.19786307874950534, 0.24139682058765335, 0.19471350044519192], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_4", 10, 1, 10.0, 576.0, 46, 5091, 74.0, 4593.200000000002, 5091.0, 5091.0, 0.1949925902815693, 0.2399703733133141, 0.19188870432298574], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_5", 10, 1, 10.0, 576.5, 48, 5058, 75.0, 4567.300000000002, 5058.0, 5058.0, 0.1934310805060157, 0.2318717298057952, 0.19035205061124222], "isController": true}, {"data": ["Consulta CAD2003 -  schema_8", 10, 1, 10.0, 76.4, 50, 154, 56.0, 149.10000000000002, 154.0, 154.0, 0.21517407582734432, 0.26022614795369453, 0.21174894161251454], "isController": false}, {"data": ["Consulta CAD2003 -  schema_7", 10, 1, 10.0, 52.5, 45, 109, 46.0, 102.90000000000002, 109.0, 109.0, 0.21959199806759042, 0.26790652654867253, 0.21609653950460045], "isController": false}, {"data": ["Consulta CAD2003 -  schema_6", 10, 1, 10.0, 51.800000000000004, 42, 110, 45.5, 103.90000000000002, 110.0, 110.0, 0.21961611103790574, 0.2679359448434137, 0.21612026864540784], "isController": false}, {"data": ["Consulta CAD2003 -  schema_5", 10, 1, 10.0, 76.5, 48, 151, 55.5, 146.8, 151.0, 151.0, 0.21414651904833287, 0.25670395715998884, 0.21073774145020022], "isController": false}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 1539.0, 1539, 1539, 1539.0, 1539.0, 1539.0, 1539.0, 0.649772579597141, 1.8027381822612087, 3.952571678037687], "isController": true}, {"data": ["Consulta CAD2003 -  schema_9", 10, 1, 10.0, 56.699999999999996, 44, 122, 48.5, 115.70000000000002, 122.0, 122.0, 0.2193896579715232, 0.27466556789012964, 0.21589742025185932], "isController": false}, {"data": ["Consulta CAD2003 -  schema_4", 10, 1, 10.0, 76.0, 46, 113, 74.0, 111.2, 113.0, 113.0, 0.21606205302162781, 0.2658998039236869, 0.21262278401356868], "isController": false}, {"data": ["Consulta CAD2003 -  schema_3", 10, 1, 10.0, 51.599999999999994, 43, 108, 46.0, 102.00000000000003, 108.0, 108.0, 0.21962093426745438, 0.26794182927766674, 0.21612501509893922], "isController": false}, {"data": ["Controller Envios - Thread  8 - schema_8", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 6.377963362068965, 14.017600574712644], "isController": true}, {"data": ["Consulta CAD2003 -  schema_2", 10, 1, 10.0, 77.0, 49, 121, 76.5, 119.2, 121.0, 121.0, 0.21711283353959054, 0.25563764003777767, 0.21365683824008339], "isController": false}, {"data": ["Consulta CAD2003 -  schema_1", 10, 1, 10.0, 72.89999999999999, 49, 117, 59.5, 115.30000000000001, 117.0, 117.0, 0.21833584419554158, 0.2570776634243794, 0.21486038105063207], "isController": false}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 1775.0, 1775, 1775, 1775.0, 1775.0, 1775.0, 1775.0, 0.5633802816901409, 1.563050176056338, 3.4204445422535215], "isController": true}, {"data": ["Envio CAD2003 - schema_8-0", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 198.486328125, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_10", 1, 0, 0.0, 130.0, 130, 130, 130.0, 130.0, 130.0, 130.0, 7.6923076923076925, 21.36418269230769, 46.81490384615385], "isController": false}, {"data": ["Envio CAD2003 - schema_6-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1587.890625, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  5 - schema_5", 1, 0, 0.0, 1086.0, 1086, 1086, 1086.0, 1086.0, 1086.0, 1086.0, 0.9208103130755064, 2.5547090814917124, 5.601296328268877], "isController": true}, {"data": ["Envio CAD2003 - schema_4-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_2-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1587.890625, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_9", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 11.657201943277311, 25.59578518907563], "isController": false}, {"data": ["Controller Envios - Thread  6 - schema_6", 1, 0, 0.0, 884.0, 884, 884, 884.0, 884.0, 884.0, 884.0, 1.1312217194570138, 3.1384774462669682, 6.871288178733032], "isController": true}, {"data": ["Envio CAD2003 - schema_8", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 6.377963362068965, 14.017600574712644], "isController": false}, {"data": ["Envio CAD2003 - schema_7", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 4.288120653013911, 9.388282457496135], "isController": false}, {"data": ["Envio CAD2003 - schema_6", 1, 0, 0.0, 884.0, 884, 884, 884.0, 884.0, 884.0, 884.0, 1.1312217194570138, 3.1384774462669682, 6.871288178733032], "isController": false}, {"data": ["Envio CAD2003 - schema_5", 1, 0, 0.0, 1086.0, 1086, 1086, 1086.0, 1086.0, 1086.0, 1086.0, 0.9208103130755064, 2.5547090814917124, 5.601296328268877], "isController": false}, {"data": ["Envio CAD2003 - schema_4", 1, 0, 0.0, 1322.0, 1322, 1322, 1322.0, 1322.0, 1322.0, 1322.0, 0.7564296520423601, 2.0986490639183053, 4.5902869704992435], "isController": false}, {"data": ["Envio CAD2003 - schema_3", 1, 0, 0.0, 1539.0, 1539, 1539, 1539.0, 1539.0, 1539.0, 1539.0, 0.649772579597141, 1.8027381822612087, 3.952571678037687], "isController": false}, {"data": ["Envio CAD2003 - schema_2", 1, 0, 0.0, 1775.0, 1775, 1775, 1775.0, 1775.0, 1775.0, 1775.0, 0.5633802816901409, 1.563050176056338, 3.4204445422535215], "isController": false}, {"data": ["Envio CAD2003 - schema_1", 1, 0, 0.0, 1876.0, 1876, 1876, 1876.0, 1876.0, 1876.0, 1876.0, 0.5330490405117271, 1.478898753997868, 3.237856476545842], "isController": false}, {"data": ["Controller Envios - Thread  7 - schema_7", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 4.288120653013911, 9.388282457496135], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 20, 100.0, 15.384615384615385], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 130, 20, "Assertion failed", 20, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_8", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_9", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2003 -  schema_10", 10, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_10", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_2", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_3", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_1", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_6", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_7", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_4", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_5", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2003 -  schema_8", 10, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2003 -  schema_7", 10, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2003 -  schema_6", 10, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2003 -  schema_5", 10, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2003 -  schema_9", 10, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2003 -  schema_4", 10, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2003 -  schema_3", 10, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2003 -  schema_2", 10, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2003 -  schema_1", 10, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
