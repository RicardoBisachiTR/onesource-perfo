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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9732620320855615, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2003 - schema_1-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_10-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  10 - schema_10"], "isController": true}, {"data": [0.9777777777777777, 500, 1500, "Controller Consultas  CAD2003 - schema_8"], "isController": true}, {"data": [0.9803921568627451, 500, 1500, "Controller Consultas  CAD2003 - schema_9"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [0.9901960784313726, 500, 1500, "Consulta CAD2003 -  schema_10"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  9 - schema_9"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_9-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_7-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_5-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3-0"], "isController": false}, {"data": [0.9803921568627451, 500, 1500, "Controller Consultas  CAD2003 - schema_10"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "Controller Consultas  CAD2003 - schema_2"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "Controller Consultas  CAD2003 - schema_3"], "isController": true}, {"data": [0.9743589743589743, 500, 1500, "Controller Consultas  CAD2003 - schema_1"], "isController": true}, {"data": [0.9777777777777777, 500, 1500, "Controller Consultas  CAD2003 - schema_6"], "isController": true}, {"data": [0.9696969696969697, 500, 1500, "Controller Consultas  CAD2003 - schema_7"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "Controller Consultas  CAD2003 - schema_4"], "isController": true}, {"data": [0.9743589743589743, 500, 1500, "Controller Consultas  CAD2003 - schema_5"], "isController": true}, {"data": [0.9888888888888889, 500, 1500, "Consulta CAD2003 -  schema_8"], "isController": false}, {"data": [0.9848484848484849, 500, 1500, "Consulta CAD2003 -  schema_7"], "isController": false}, {"data": [0.9888888888888889, 500, 1500, "Consulta CAD2003 -  schema_6"], "isController": false}, {"data": [0.9871794871794872, 500, 1500, "Consulta CAD2003 -  schema_5"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}, {"data": [0.9901960784313726, 500, 1500, "Consulta CAD2003 -  schema_9"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "Consulta CAD2003 -  schema_4"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "Consulta CAD2003 -  schema_3"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  8 - schema_8"], "isController": true}, {"data": [0.9772727272727273, 500, 1500, "Consulta CAD2003 -  schema_2"], "isController": false}, {"data": [0.9871794871794872, 500, 1500, "Consulta CAD2003 -  schema_1"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_8-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_10"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_6-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  5 - schema_5"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  6 - schema_6"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_9"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_8"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_7"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_6"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_5"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_4"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_3"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_2"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_1"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  7 - schema_7"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 389, 0, 0.0, 254.28534704370168, 0, 6250, 51.0, 136.0, 903.5, 5980.7000000000035, 1.4800216105983246, 1.880754285499593, 1.6183612149208246], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2003 - schema_1-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 1421.0, 1421, 1421, 1421.0, 1421.0, 1421.0, 1421.0, 0.7037297677691766, 1.953125, 4.270485133708656], "isController": true}, {"data": ["Envio CAD2003 - schema_10-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1590.8203125, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  10 - schema_10", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 24.578263274336283, 53.806001106194685], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_8", 45, 0, 0.0, 200.51111111111112, 42, 6194, 49.0, 104.4, 143.19999999999987, 6194.0, 0.1964456434904462, 0.23757645009625836, 0.1941094409593532], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_9", 51, 0, 0.0, 176.52941176470588, 42, 5859, 49.0, 110.00000000000003, 148.8, 5859.0, 0.19686179144230212, 0.23988761266477526, 0.19454727819273154], "isController": true}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 822.0, 822, 822, 822.0, 822.0, 822.0, 822.0, 1.2165450121654502, 3.3763876216545015, 7.393124619829684], "isController": true}, {"data": ["Consulta CAD2003 -  schema_10", 51, 0, 0.0, 73.11764705882355, 42, 825, 46.0, 103.0, 117.79999999999998, 825.0, 0.2009543360823361, 0.24529404224572382, 0.19859170659484848], "isController": false}, {"data": ["Controller Envios - Thread  9 - schema_9", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 25.213068181818183, 55.37997159090909], "isController": true}, {"data": ["Envio CAD2003 - schema_9-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_7-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_5-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1588.8671875, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_3-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 793.9453125, 0.0], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_10", 51, 0, 0.0, 171.15686274509807, 42, 5825, 46.0, 103.0, 117.79999999999998, 5825.0, 0.1970709841956799, 0.24055384554078596, 0.19475401145716603], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_2", 22, 0, 0.0, 334.3636363636364, 44, 5967, 48.5, 145.79999999999998, 5094.449999999988, 5967.0, 0.1940736950749389, 0.23639809421836822, 0.1915323358754047], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_3", 22, 0, 0.0, 353.3181818181818, 48, 6104, 80.0, 155.39999999999998, 5214.049999999987, 6104.0, 0.19407198306280876, 0.23357900163196896, 0.19153064628175723], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_1", 39, 0, 0.0, 215.43589743589743, 44, 5853, 52.0, 116.0, 175.0, 5853.0, 0.19640923627023896, 0.24267871981467026, 0.1940387121345655], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_6", 45, 0, 0.0, 211.15555555555554, 41, 6250, 61.0, 111.79999999999998, 156.39999999999995, 6250.0, 0.19602718243596445, 0.23614298821658825, 0.1936959563948423], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_7", 33, 0, 0.0, 252.93939393939394, 44, 5900, 71.0, 122.0, 1881.9999999999836, 5900.0, 0.19558916791626413, 0.23477414266748062, 0.19318134672032528], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_4", 12, 0, 0.0, 564.5833333333334, 43, 5913, 72.5, 4187.700000000006, 5913.0, 5913.0, 0.19177294083804777, 0.2315851781490715, 0.18888573429059993], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_5", 39, 0, 0.0, 206.92307692307693, 43, 5908, 47.0, 116.0, 137.0, 5908.0, 0.1968474129707303, 0.24590646498639734, 0.1944716003442306], "isController": true}, {"data": ["Consulta CAD2003 -  schema_8", 45, 0, 0.0, 89.4, 42, 1194, 49.0, 104.4, 143.19999999999987, 1194.0, 0.20083009773731425, 0.24287889945106442, 0.19844175369304237], "isController": false}, {"data": ["Consulta CAD2003 -  schema_7", 33, 0, 0.0, 101.42424242424242, 44, 900, 71.0, 122.0, 381.9999999999979, 900.0, 0.2015648764040826, 0.24194704417324808, 0.1990834906150172], "isController": false}, {"data": ["Consulta CAD2003 -  schema_6", 45, 0, 0.0, 100.02222222222221, 41, 1249, 61.0, 111.79999999999998, 156.39999999999995, 1249.0, 0.20039455461196934, 0.24140411732878514, 0.19801139020382355], "isController": false}, {"data": ["Consulta CAD2003 -  schema_5", 39, 0, 0.0, 78.6923076923077, 43, 907, 47.0, 116.0, 137.0, 907.0, 0.20194488458073134, 0.25227434762740647, 0.19950754898457967], "isController": false}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 1045.0, 1045, 1045, 1045.0, 1045.0, 1045.0, 1045.0, 0.9569377990430622, 2.654941686602871, 5.815453050239235], "isController": true}, {"data": ["Consulta CAD2003 -  schema_9", 51, 0, 0.0, 78.49019607843138, 42, 859, 49.0, 110.00000000000003, 148.8, 859.0, 0.2007368222180238, 0.2446095644207759, 0.19837675005116823], "isController": false}, {"data": ["Consulta CAD2003 -  schema_4", 12, 0, 0.0, 147.83333333333331, 43, 912, 72.5, 687.0000000000008, 912.0, 912.0, 0.20843103538116825, 0.25170150830250293, 0.20529303558091466], "isController": false}, {"data": ["Consulta CAD2003 -  schema_3", 22, 0, 0.0, 126.04545454545456, 48, 1104, 80.0, 155.39999999999998, 964.049999999998, 1104.0, 0.20303069454954872, 0.24436142809021943, 0.20037204509588585], "isController": false}, {"data": ["Controller Envios - Thread  8 - schema_8", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 21.84578001968504, 47.96690452755905], "isController": true}, {"data": ["Consulta CAD2003 -  schema_2", 22, 0, 0.0, 107.04545454545456, 44, 966, 48.5, 145.79999999999998, 843.5999999999983, 966.0, 0.20303069454954872, 0.247308473416822, 0.20037204509588585], "isController": false}, {"data": ["Consulta CAD2003 -  schema_1", 39, 0, 0.0, 87.23076923076923, 44, 853, 52.0, 116.0, 175.0, 853.0, 0.2014837469777438, 0.24894866814077, 0.1990519769946891], "isController": false}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 1269.0, 1269, 1269, 1269.0, 1269.0, 1269.0, 1269.0, 0.7880220646178093, 2.1870690504334123, 4.798161692277384], "isController": true}, {"data": ["Envio CAD2003 - schema_8-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_10", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 24.578263274336283, 53.806001106194685], "isController": false}, {"data": ["Envio CAD2003 - schema_6-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_4-0", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 264.8111979166667, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  5 - schema_5", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 4.3365478515625, 9.527587890625], "isController": true}, {"data": ["Envio CAD2003 - schema_2-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.6223958333334, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  6 - schema_6", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 6.655613009592327, 14.566471822541967], "isController": true}, {"data": ["Envio CAD2003 - schema_9", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 25.213068181818183, 55.37997159090909], "isController": false}, {"data": ["Envio CAD2003 - schema_8", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 21.84578001968504, 47.96690452755905], "isController": false}, {"data": ["Envio CAD2003 - schema_7", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 14.684606481481481, 32.24723048941799], "isController": false}, {"data": ["Envio CAD2003 - schema_6", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 6.655613009592327, 14.566471822541967], "isController": false}, {"data": ["Envio CAD2003 - schema_5", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 4.3365478515625, 9.527587890625], "isController": false}, {"data": ["Envio CAD2003 - schema_4", 1, 0, 0.0, 822.0, 822, 822, 822.0, 822.0, 822.0, 822.0, 1.2165450121654502, 3.3763876216545015, 7.393124619829684], "isController": false}, {"data": ["Envio CAD2003 - schema_3", 1, 0, 0.0, 1045.0, 1045, 1045, 1045.0, 1045.0, 1045.0, 1045.0, 0.9569377990430622, 2.654941686602871, 5.815453050239235], "isController": false}, {"data": ["Envio CAD2003 - schema_2", 1, 0, 0.0, 1269.0, 1269, 1269, 1269.0, 1269.0, 1269.0, 1269.0, 0.7880220646178093, 2.1870690504334123, 4.798161692277384], "isController": false}, {"data": ["Envio CAD2003 - schema_1", 1, 0, 0.0, 1421.0, 1421, 1421, 1421.0, 1421.0, 1421.0, 1421.0, 0.7037297677691766, 1.953125, 4.270485133708656], "isController": false}, {"data": ["Controller Envios - Thread  7 - schema_7", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 14.684606481481481, 32.24723048941799], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 389, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
