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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9784313725490196, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Envio CAD2003 - schema_1-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  1 - schema_1"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_10-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  10 - schema_10"], "isController": true}, {"data": [0.9841269841269841, 500, 1500, "Controller Consultas  CAD2003 - schema_8"], "isController": true}, {"data": [0.9855072463768116, 500, 1500, "Controller Consultas  CAD2003 - schema_9"], "isController": true}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  4 - schema_4"], "isController": true}, {"data": [0.9932432432432432, 500, 1500, "Consulta CAD2003 -  schema_10"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  9 - schema_9"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_9-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_7-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_5-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_3-0"], "isController": false}, {"data": [0.9864864864864865, 500, 1500, "Controller Consultas  CAD2003 - schema_10"], "isController": true}, {"data": [0.9824561403508771, 500, 1500, "Controller Consultas  CAD2003 - schema_2"], "isController": true}, {"data": [0.9743589743589743, 500, 1500, "Controller Consultas  CAD2003 - schema_3"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "Controller Consultas  CAD2003 - schema_1"], "isController": true}, {"data": [0.9803921568627451, 500, 1500, "Controller Consultas  CAD2003 - schema_6"], "isController": true}, {"data": [0.9523809523809523, 500, 1500, "Controller Consultas  CAD2003 - schema_7"], "isController": true}, {"data": [0.9523809523809523, 500, 1500, "Controller Consultas  CAD2003 - schema_4"], "isController": true}, {"data": [0.9838709677419355, 500, 1500, "Controller Consultas  CAD2003 - schema_5"], "isController": true}, {"data": [0.9920634920634921, 500, 1500, "Consulta CAD2003 -  schema_8"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "Consulta CAD2003 -  schema_7"], "isController": false}, {"data": [0.9901960784313726, 500, 1500, "Consulta CAD2003 -  schema_6"], "isController": false}, {"data": [0.9919354838709677, 500, 1500, "Consulta CAD2003 -  schema_5"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  3 - schema_3"], "isController": true}, {"data": [0.9927536231884058, 500, 1500, "Consulta CAD2003 -  schema_9"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "Consulta CAD2003 -  schema_4"], "isController": false}, {"data": [0.9871794871794872, 500, 1500, "Consulta CAD2003 -  schema_3"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  8 - schema_8"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "Consulta CAD2003 -  schema_2"], "isController": false}, {"data": [0.9605263157894737, 500, 1500, "Consulta CAD2003 -  schema_1"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  2 - schema_2"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_8-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_10"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_6-0"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_4-0"], "isController": false}, {"data": [0.5, 500, 1500, "Controller Envios - Thread  5 - schema_5"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_2-0"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  6 - schema_6"], "isController": true}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_9"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_8"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_7"], "isController": false}, {"data": [1.0, 500, 1500, "Envio CAD2003 - schema_6"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_5"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_4"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_3"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_2"], "isController": false}, {"data": [0.5, 500, 1500, "Envio CAD2003 - schema_1"], "isController": false}, {"data": [1.0, 500, 1500, "Controller Envios - Thread  7 - schema_7"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 525, 0, 0.0, 225.02857142857127, 0, 6193, 76.0, 129.0, 524.6999999999975, 5945.220000000001, 1.3807831802198207, 1.7202796488668373, 1.472470676439105], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Envio CAD2003 - schema_1-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1589.84375, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  1 - schema_1", 1, 0, 0.0, 1417.0, 1417, 1417, 1417.0, 1417.0, 1417.0, 1417.0, 0.7057163020465773, 1.9593275846859561, 4.284607665843331], "isController": true}, {"data": ["Envio CAD2003 - schema_10-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Envios - Thread  10 - schema_10", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 25.734230324074073, 56.2427662037037], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_8", 63, 0, 0.0, 170.50793650793648, 43, 5865, 70.0, 116.4, 120.8, 5865.0, 0.1963858764265252, 0.23491601094305742, 0.19411492119627052], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_9", 69, 0, 0.0, 158.1304347826087, 44, 5869, 63.0, 117.0, 144.0, 5869.0, 0.19659631937499467, 0.2400636498391614, 0.1943369753513803], "isController": true}, {"data": ["Controller Envios - Thread  4 - schema_4", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 3.4024107689950984, 7.465437346813726], "isController": true}, {"data": ["Consulta CAD2003 -  schema_10", 74, 0, 0.0, 83.0135135135135, 43, 855, 63.5, 118.5, 134.0, 855.0, 0.19934861493121125, 0.24355330740229897, 0.1970677443502178], "isController": false}, {"data": ["Controller Envios - Thread  9 - schema_9", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 23.72963408119658, 51.941439636752136], "isController": true}, {"data": ["Envio CAD2003 - schema_9-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1589.84375, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_7-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 529.9479166666666, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_5-0", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 397.4609375, 0.0], "isController": false}, {"data": ["Envio CAD2003 - schema_3-0", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1589.84375, 0.0], "isController": false}, {"data": ["Controller Consultas  CAD2003 - schema_10", 74, 0, 0.0, 150.59459459459458, 43, 5856, 63.5, 118.5, 134.0, 5856.0, 0.1966986523484224, 0.2403157270872651, 0.19444810162542198], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_2", 57, 0, 0.0, 184.5964912280702, 46, 5972, 74.0, 120.20000000000002, 139.29999999999964, 5972.0, 0.19616278069345264, 0.23899272993203133, 0.19387744128022025], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_3", 39, 0, 0.0, 236.69230769230768, 47, 5746, 99.0, 129.0, 189.0, 5746.0, 0.19495613486965432, 0.23396591235721964, 0.19260314866655004], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_1", 38, 0, 0.0, 327.5263157894737, 44, 6193, 56.5, 134.90000000000006, 3889.249999999993, 6193.0, 0.19241285722965995, 0.23226811086018676, 0.19008384675075446], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_6", 51, 0, 0.0, 201.5686274509804, 44, 5825, 95.0, 128.60000000000002, 157.19999999999993, 5825.0, 0.19567219152854512, 0.23272041896869247, 0.19337166446055865], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_7", 21, 0, 0.0, 373.95238095238096, 56, 5989, 95.0, 172.20000000000002, 5407.899999999991, 5989.0, 0.19295263472228602, 0.23569939587448893, 0.1904043391372261], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_4", 21, 0, 0.0, 382.5238095238095, 52, 6154, 98.0, 166.4, 5555.499999999992, 6154.0, 0.1934342876091522, 0.23334630091466785, 0.19087963090895693], "isController": true}, {"data": ["Controller Consultas  CAD2003 - schema_5", 62, 0, 0.0, 184.35483870967744, 47, 6069, 90.0, 123.7, 166.24999999999974, 6069.0, 0.19584059838778964, 0.2327427071093296, 0.19357335355703384], "isController": true}, {"data": ["Consulta CAD2003 -  schema_8", 63, 0, 0.0, 91.1269841269841, 43, 864, 70.0, 116.4, 120.8, 864.0, 0.19949650881109582, 0.23863693713485012, 0.19718958303646353], "isController": false}, {"data": ["Consulta CAD2003 -  schema_7", 21, 0, 0.0, 135.85714285714286, 56, 989, 95.0, 172.20000000000002, 907.8999999999988, 989.0, 0.20224589248223127, 0.2470514836180827, 0.19957486228017798], "isController": false}, {"data": ["Consulta CAD2003 -  schema_6", 51, 0, 0.0, 103.50980392156862, 44, 824, 95.0, 128.60000000000002, 157.19999999999993, 824.0, 0.19950163708696317, 0.23727492499129627, 0.1971560870492143], "isController": false}, {"data": ["Consulta CAD2003 -  schema_5", 62, 0, 0.0, 103.70967741935485, 47, 1069, 90.0, 123.7, 166.24999999999974, 1069.0, 0.19898517560441747, 0.23647981483947994, 0.19668152603175418], "isController": false}, {"data": ["Controller Envios - Thread  3 - schema_3", 1, 0, 0.0, 1050.0, 1050, 1050, 1050.0, 1050.0, 1050.0, 1050.0, 0.9523809523809523, 2.6441592261904763, 5.7793898809523805], "isController": true}, {"data": ["Consulta CAD2003 -  schema_9", 69, 0, 0.0, 85.66666666666667, 44, 869, 63.0, 117.0, 144.0, 869.0, 0.19943810481773092, 0.24353375237013403, 0.19714610214121375], "isController": false}, {"data": ["Consulta CAD2003 -  schema_4", 21, 0, 0.0, 144.42857142857142, 52, 1154, 98.0, 166.4, 1055.4999999999986, 1154.0, 0.20277708039628434, 0.24461682675595295, 0.20009903487765784], "isController": false}, {"data": ["Consulta CAD2003 -  schema_3", 39, 0, 0.0, 108.48717948717947, 47, 746, 99.0, 129.0, 189.0, 746.0, 0.19995488197534916, 0.23996488452605563, 0.19754156433932854], "isController": false}, {"data": ["Controller Envios - Thread  8 - schema_8", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 25.707103587962962, 56.297019675925924], "isController": true}, {"data": ["Consulta CAD2003 -  schema_2", 57, 0, 0.0, 96.85964912280701, 46, 971, 74.0, 120.20000000000002, 139.29999999999964, 971.0, 0.19959800261928606, 0.24317799414512525, 0.19727264211727957], "isController": false}, {"data": ["Consulta CAD2003 -  schema_1", 38, 0, 0.0, 195.94736842105266, 44, 3768, 56.5, 134.90000000000006, 1321.7499999999927, 3768.0, 0.19741182704645932, 0.23830253752123473, 0.19502230786114674], "isController": false}, {"data": ["Controller Envios - Thread  2 - schema_2", 1, 0, 0.0, 1278.0, 1278, 1278, 1278.0, 1278.0, 1278.0, 1278.0, 0.7824726134585289, 2.172431289123631, 4.764371821205008], "isController": true}, {"data": ["Envio CAD2003 - schema_8-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_10", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 25.734230324074073, 56.2427662037037], "isController": false}, {"data": ["Envio CAD2003 - schema_6-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Envio CAD2003 - schema_4-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 794.921875, 0.0], "isController": false}, {"data": ["Controller Envios - Thread  5 - schema_5", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 4.6977448181049075, 10.312566095600678], "isController": true}, {"data": ["Envio CAD2003 - schema_2-0", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Controller Envios - Thread  6 - schema_6", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 7.503695101351352, 16.400971283783782], "isController": true}, {"data": ["Envio CAD2003 - schema_9", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 23.72963408119658, 51.941439636752136], "isController": false}, {"data": ["Envio CAD2003 - schema_8", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 25.707103587962962, 56.297019675925924], "isController": false}, {"data": ["Envio CAD2003 - schema_7", 1, 0, 0.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 18.88685161564626, 41.42086522108844], "isController": false}, {"data": ["Envio CAD2003 - schema_6", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 7.503695101351352, 16.400971283783782], "isController": false}, {"data": ["Envio CAD2003 - schema_5", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 4.6977448181049075, 10.312566095600678], "isController": false}, {"data": ["Envio CAD2003 - schema_4", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 3.4024107689950984, 7.465437346813726], "isController": false}, {"data": ["Envio CAD2003 - schema_3", 1, 0, 0.0, 1050.0, 1050, 1050, 1050.0, 1050.0, 1050.0, 1050.0, 0.9523809523809523, 2.6441592261904763, 5.7793898809523805], "isController": false}, {"data": ["Envio CAD2003 - schema_2", 1, 0, 0.0, 1278.0, 1278, 1278, 1278.0, 1278.0, 1278.0, 1278.0, 0.7824726134585289, 2.172431289123631, 4.764371821205008], "isController": false}, {"data": ["Envio CAD2003 - schema_1", 1, 0, 0.0, 1417.0, 1417, 1417, 1417.0, 1417.0, 1417.0, 1417.0, 0.7057163020465773, 1.9593275846859561, 4.284607665843331], "isController": false}, {"data": ["Controller Envios - Thread  7 - schema_7", 1, 0, 0.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 18.88685161564626, 41.42086522108844], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 525, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
