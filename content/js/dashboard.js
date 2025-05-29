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

    var data = {"OkPercent": 99.71522141534956, "KoPercent": 0.28477858465043426};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9979309360730594, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2002 - schema_2-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_4-0"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_6-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_8-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  10 - schema_10"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [0.9985714285714286, 500, 1500, "Controller Consultas  CAD2002 - schema_10"], "isController": true}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  9 - schema_9"], "isController": true}, {"data": [0.9985693848354793, 500, 1500, "Consulta CAD2002 -  schema_6"], "isController": false}, {"data": [0.9985693848354793, 500, 1500, "Controller Consultas  CAD2002 - schema_7"], "isController": true}, {"data": [0.9985693848354793, 500, 1500, "Consulta CAD2002 -  schema_7"], "isController": false}, {"data": [0.9985693848354793, 500, 1500, "Controller Consultas  CAD2002 - schema_8"], "isController": true}, {"data": [0.9985693848354793, 500, 1500, "Consulta CAD2002 -  schema_8"], "isController": false}, {"data": [0.9985693848354793, 500, 1500, "Controller Consultas  CAD2002 - schema_9"], "isController": true}, {"data": [0.9985693848354793, 500, 1500, "Consulta CAD2002 -  schema_9"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_1-0"], "isController": false}, {"data": [0.9985693848354793, 500, 1500, "Controller Consultas  CAD2002 - schema_1"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_3-0"], "isController": false}, {"data": [0.9985714285714286, 500, 1500, "Controller Consultas  CAD2002 - schema_2"], "isController": true}, {"data": [0.9985693848354793, 500, 1500, "Consulta CAD2002 -  schema_1"], "isController": false}, {"data": [0.9985693848354793, 500, 1500, "Controller Consultas  CAD2002 - schema_3"], "isController": true}, {"data": [0.9985714285714286, 500, 1500, "Consulta CAD2002 -  schema_2"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_5-0"], "isController": false}, {"data": [0.9985693848354793, 500, 1500, "Consulta CAD2002 -  schema_3"], "isController": false}, {"data": [0.9985693848354793, 500, 1500, "Controller Consultas  CAD2002 - schema_4"], "isController": true}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  8 - schema_8"], "isController": true}, {"data": [0.9985693848354793, 500, 1500, "Consulta CAD2002 -  schema_4"], "isController": false}, {"data": [0.9985714285714286, 500, 1500, "Controller Consultas  CAD2002 - schema_5"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_7-0"], "isController": false}, {"data": [0.9985693848354793, 500, 1500, "Controller Consultas  CAD2002 - schema_6"], "isController": true}, {"data": [0.9985714285714286, 500, 1500, "Consulta CAD2002 -  schema_5"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_9-0"], "isController": false}, {"data": [0.9985714285714286, 500, 1500, "Consulta CAD2002 -  schema_10"], "isController": false}, {"data": [0.0, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_10"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  5 - schema_5"], "isController": true}, {"data": [0.0, 500, 1500, "Envio CAD2002 - schema_2"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2002 - schema_3"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_10-0"], "isController": false}, {"data": [0.0, 500, 1500, "Envio CAD2002 - schema_1"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  6 - schema_6"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  7 - schema_7"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_8"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2002 - schema_9"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2002 - schema_6"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2002 - schema_7"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2002 - schema_4"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2002 - schema_5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7023, 20, 0.28477858465043426, 146.848355403674, 0, 5155, 118.0, 188.0, 302.0, 361.0, 1.9518347329866184, 2.343076314518171, 2.0181969054678888], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2002 - schema_2-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 531.9010416666666, 0.0], "isController": false}, {"data": ["Envio CAD2002 - schema_4-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 1734.0, 1734, 1734, 1734.0, 1734.0, 1734.0, 1734.0, 0.5767012687427913, 1.6090190671856979, 19.286264597750865], "isController": true}, {"data": ["Envio CAD2002 - schema_6-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 531.9010416666666, 0.0], "isController": false}, {"data": ["Envio CAD2002 - schema_8-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Envios - Thread  10 - schema_10", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 7.718080973756907, 92.40655214088397], "isController": true}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 1233.0, 1233, 1233, 1233.0, 1233.0, 1233.0, 1233.0, 0.8110300081103001, 2.263597424979724, 27.141784519464718], "isController": true}, {"data": ["Controller Consultas  CAD2002 - schema_10", 700, 1, 0.14285714285714285, 135.33999999999986, 89, 5095, 103.5, 180.69999999999993, 298.94999999999993, 348.97, 0.19498058689713743, 0.23352162263331866, 0.1928716520614601], "isController": true}, {"data": ["Controller Envios - Thread  9 - schema_9", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 7.502730174731183, 89.94613155241936], "isController": true}, {"data": ["Consulta CAD2002 -  schema_6", 699, 1, 0.1430615164520744, 142.61516452074395, 99, 421, 122.0, 183.0, 303.0, 346.0, 0.19468100306114294, 0.23353310562293883, 0.1925752879691318], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_7", 699, 1, 0.1430615164520744, 149.76824034334766, 100, 5124, 122.0, 190.0, 307.0, 360.0, 0.1944228187303439, 0.23245361006181198, 0.1923198962202146], "isController": true}, {"data": ["Consulta CAD2002 -  schema_7", 699, 1, 0.1430615164520744, 142.61516452074395, 100, 445, 122.0, 187.0, 305.0, 353.0, 0.1946937459021005, 0.23277753294056633, 0.19258789298055234], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_8", 699, 1, 0.1430615164520744, 148.88125894134473, 92, 5109, 121.0, 193.0, 297.0, 364.0, 0.1944732321089495, 0.23275080334972492, 0.19236976431597033], "isController": true}, {"data": ["Consulta CAD2002 -  schema_8", 699, 1, 0.1430615164520744, 141.728183118741, 92, 434, 121.0, 191.0, 293.0, 363.0, 0.19474424564186618, 0.2330751596470978, 0.19263784650336568], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_9", 699, 1, 0.1430615164520744, 148.55937052932754, 90, 5101, 122.0, 190.0, 299.0, 363.0, 0.1944829174997343, 0.23291047659513553, 0.19237934494731154], "isController": true}, {"data": ["Consulta CAD2002 -  schema_9", 699, 1, 0.1430615164520744, 141.40629470672383, 90, 453, 121.0, 189.0, 299.0, 352.0, 0.1947539580468212, 0.2332350715971552, 0.1926474538566856], "isController": false}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 1455.0, 1455, 1455, 1455.0, 1455.0, 1455.0, 1455.0, 0.6872852233676976, 1.917552620274914, 22.982442010309278], "isController": true}, {"data": ["Envio CAD2002 - schema_1-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 797.36328125, 0.0], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_1", 699, 1, 0.1430615164520744, 143.94849785407754, 92, 5103, 114.0, 188.0, 297.0, 350.0, 0.19460284732641023, 0.23329117967814525, 0.19249797758503712], "isController": true}, {"data": ["Envio CAD2002 - schema_3-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_2", 700, 1, 0.14285714285714285, 142.30571428571423, 89, 5110, 113.0, 173.0, 302.0, 347.98, 0.19467654214413407, 0.2315588930086926, 0.19257089589518947], "isController": true}, {"data": ["Consulta CAD2002 -  schema_1", 699, 1, 0.1430615164520744, 136.7939914163093, 92, 419, 114.0, 186.0, 296.0, 349.0, 0.19487422248948894, 0.23361650601740375, 0.19276641749111845], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_3", 699, 1, 0.1430615164520744, 149.6995708154507, 91, 5155, 122.0, 190.0, 309.0, 352.0, 0.19443493286431585, 0.2332379276838349, 0.19233187932489076], "isController": true}, {"data": ["Consulta CAD2002 -  schema_2", 700, 1, 0.14285714285714285, 135.1628571428571, 89, 405, 113.0, 173.0, 300.6999999999982, 345.99, 0.1949477345123772, 0.23188146399691315, 0.19283915501227333], "isController": false}, {"data": ["Envio CAD2002 - schema_5-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Consulta CAD2002 -  schema_3", 699, 1, 0.1430615164520744, 142.546494992847, 91, 405, 122.0, 189.0, 308.0, 350.0, 0.1947058938226143, 0.23356296378442518, 0.19259990950632724], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_4", 699, 1, 0.1430615164520744, 149.47782546494997, 92, 5110, 123.0, 191.0, 304.0, 367.0, 0.19444834670223674, 0.23337246264380207, 0.1923451480756151], "isController": true}, {"data": ["Controller Envios - Thread  8 - schema_8", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 7.284697291122716, 87.32457571801567], "isController": true}, {"data": ["Consulta CAD2002 -  schema_4", 699, 1, 0.1430615164520744, 142.32331902718175, 92, 441, 123.0, 190.0, 301.0, 365.0, 0.19471939931711713, 0.2336977737987359, 0.19261326892225458], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_5", 700, 1, 0.14285714285714285, 141.83999999999992, 95, 5112, 113.0, 181.0, 298.6999999999996, 344.97, 0.19473644091891118, 0.23382146818688135, 0.1926301467971976], "isController": true}, {"data": ["Envio CAD2002 - schema_7-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_6", 699, 1, 0.1430615164520744, 149.76824034334766, 99, 5117, 122.0, 186.0, 305.0, 348.0, 0.1944101653988287, 0.23320821742426834, 0.19230737975008141], "isController": true}, {"data": ["Consulta CAD2002 -  schema_5", 700, 1, 0.14285714285714285, 134.69714285714278, 95, 415, 113.0, 180.5999999999999, 292.74999999999966, 341.99, 0.19500780031201248, 0.2341472913938879, 0.19289857113257744], "isController": false}, {"data": ["Envio CAD2002 - schema_9-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1595.703125, 0.0], "isController": false}, {"data": ["Consulta CAD2002 -  schema_10", 700, 1, 0.14285714285714285, 128.19714285714272, 89, 429, 103.0, 177.89999999999998, 298.0, 345.96000000000004, 0.19525262761223608, 0.23384743655265866, 0.19314075034957193], "isController": false}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 1648.0, 1648, 1648, 1648.0, 1648.0, 1648.0, 1648.0, 0.6067961165048543, 1.693577442354369, 20.29270801729369], "isController": true}, {"data": ["Envio CAD2002 - schema_10", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 7.718080973756907, 92.40655214088397], "isController": false}, {"data": ["Controller Envios - Thread  5 - schema_5", 1, 0, 0.0, 1015.0, 1015, 1015, 1015.0, 1015.0, 1015.0, 1015.0, 0.9852216748768472, 2.749769088669951, 32.959705972906406], "isController": true}, {"data": ["Envio CAD2002 - schema_2", 1, 0, 0.0, 1648.0, 1648, 1648, 1648.0, 1648.0, 1648.0, 1648.0, 0.6067961165048543, 1.693577442354369, 20.29270801729369], "isController": false}, {"data": ["Envio CAD2002 - schema_3", 1, 0, 0.0, 1455.0, 1455, 1455, 1455.0, 1455.0, 1455.0, 1455.0, 0.6872852233676976, 1.917552620274914, 22.982442010309278], "isController": false}, {"data": ["Envio CAD2002 - schema_10-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1598.6328125, 0.0], "isController": false}, {"data": ["Envio CAD2002 - schema_1", 1, 0, 0.0, 1734.0, 1734, 1734, 1734.0, 1734.0, 1734.0, 1734.0, 0.5767012687427913, 1.6090190671856979, 19.286264597750865], "isController": false}, {"data": ["Controller Envios - Thread  6 - schema_6", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 3.7263225967957276, 44.68457943925234], "isController": true}, {"data": ["Controller Envios - Thread  7 - schema_7", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 5.078480760473588, 60.94176912568305], "isController": true}, {"data": ["Envio CAD2002 - schema_8", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 7.284697291122716, 87.32457571801567], "isController": false}, {"data": ["Envio CAD2002 - schema_9", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 7.502730174731183, 89.94613155241936], "isController": false}, {"data": ["Envio CAD2002 - schema_6", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 3.7263225967957276, 44.68457943925234], "isController": false}, {"data": ["Envio CAD2002 - schema_7", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 5.078480760473588, 60.94176912568305], "isController": false}, {"data": ["Envio CAD2002 - schema_4", 1, 0, 0.0, 1233.0, 1233, 1233, 1233.0, 1233.0, 1233.0, 1233.0, 0.8110300081103001, 2.263597424979724, 27.141784519464718], "isController": false}, {"data": ["Envio CAD2002 - schema_5", 1, 0, 0.0, 1015.0, 1015, 1015, 1015.0, 1015.0, 1015.0, 1015.0, 0.9852216748768472, 2.749769088669951, 32.959705972906406], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 20, 100.0, 0.28477858465043426], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7023, 20, "Assertion failed", 20, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_10", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2002 -  schema_6", 699, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_7", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2002 -  schema_7", 699, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_8", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2002 -  schema_8", 699, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_9", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2002 -  schema_9", 699, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_1", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_2", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2002 -  schema_1", 699, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_3", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2002 -  schema_2", 700, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2002 -  schema_3", 699, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_4", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2002 -  schema_4", 699, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_5", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Controller Consultas  CAD2002 - schema_6", 1, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Consulta CAD2002 -  schema_5", 700, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Consulta CAD2002 -  schema_10", 700, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
