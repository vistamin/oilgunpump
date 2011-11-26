function refresh(file, delta_slope, start_number) {
	/*	$button1.html('隐藏实时记录点');
	$button2.html('隐藏拐点');
	$button3.html('隐藏斜率趋势点');
	$button4.html('隐藏对比点');
*/
    //alert(file+delta_slope+start_number);
	var options = {
		chart: {
			renderTo: 'container',
			zoomType: 'x',
		},
		title: {
			text: '用直线模拟'
		},

		xAxis: {
			min: 0,
			max: 175,
            title:{
			    text: 'Time/s'
            }
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Volume/0.01L'
			}
		},
		series: []
	};

	$.get(file, function(data) {
		// Split the lines
		var last_x = 0;
		var last_y = 0;
		var gd_x = 0;
		var gd_y = 0;
		var flag = 0;
		var last_slope = 0;
		var current_slope = 0;
		var item = 0;
		var step = 3;
		var rate = {
			data: []
		};
		var lines = data.split('\n');
		$.each(lines, function(lineNo, line) {
			if (line.length > 0) {
				var items = line.split(',');
				var series = {
					data: []
				};
				var point = {
					data: []
				};
				var xielv = {
					data: []
				};
				$.each(items, function(itemNo, item_str) {
					item = parseFloat(item_str) * 1.00 / 100;
					series.data.push(item);
					if (itemNo == 0 || itemNo == start_number) {
						point.data.push([itemNo, item]);
						gd_x = itemNo;
						gd_y = item;
						if (itemNo != 0) {
							current_slop = (item - gd_y) / (itemNo - gd_x) * 50;
						}
					} else if (itemNo > start_number) {
						current_slope = (item - gd_y) * 1.00 / (itemNo - gd_x) * 50;
						xielv.data.push([itemNo, current_slope]);
						if ((last_slope - current_slope) >= delta_slope && item != last_y) {
							point.data.push([last_x, last_y]);
							gd_x = last_x;
							gd_y = last_y;
							flag = 1;
						}
						if (flag == 0) {
							if (item > last_y) {
								point.data.push([last_x, last_y]);
								gd_x = last_x;
								gd_y = last_y;
								flag = 1;
							}
						} else if (flag == 1) {
							if (item == last_y) {
								point.data.push([last_x, last_y]);
								gd_x = last_x;
								gd_y = last_y;
								flag = 0;
							}
						}
					}
					last_x = itemNo;
					last_y = item;
					last_slope = current_slope;
				});
				series.name = '实时记录点连线' + lineNo;
				point.name = '拐点连线' + lineNo;
				xielv.name = '斜率趋势' + lineNo;
				rate.name = '实时点与拐点比率' + lineNo;
				rate.data.push([series.data.length, point.data.length]);

				options.series.push(series);
				options.series.push(point);
				options.series.push(xielv);
			}
		});
		options.series.push(rate);

        $button1 = $('#button1');
        $button1.click(function() {
          for (var i = 0; i < chart_test.series.length - 1;) {
            var series = chart_test.series[i];
            if (series.visible) {
              series.hide();
              $button1.html('显示实时记录点');
            } else {
              series.show();
              $button1.html('隐藏实时记录点');
            }
            i = i + step;
          }
        });
        $button2 = $('#button2');
        $button2.click(function() {
          for (var i = 1; i < chart_test.series.length - 1;) {
            var series = chart_test.series[i];
            if (series.visible) {
              series.hide();
              $button2.html('显示拐点');
            } else {
              series.show();
              $button2.html('隐藏拐点');
            }
            i = i + step;
          }
        });
        $button3 = $('#button3');
        $button3.click(function() {
          for (var i = 2; i < chart_test.series.length - 1;) {
            var series = chart_test.series[i];
            if (series.visible) {
              series.hide();
              $button3.html('显示斜率趋势点');
            } else {
              series.show();
              $button3.html('隐藏斜率趋势点');
            }
            i = i + step;
          }
        });
        $button4 = $('#button4');
        $button4.click(function() {
          var series = chart_test.series[chart_test.series.length - 1];
          if (series.visible) {
            series.hide();
            $button4.html('显示对比点');
          } else {
            series.show();
            $button4.html('隐藏对比点');
          }
        });
        var chart_test = new Highcharts.Chart(options);
    });
}

$(document).ready(function() {
  var delta_slope = document.getElementById("slope").value;
  var start_number = document.getElementById("start_number").value;
  var file = document.getElementById("sample").value;
  refresh(file, delta_slope, start_number);

  $button5 = $('#button5');
  $button5.click(function() {
    delta_slope = document.getElementById("slope").value;
    start_number = document.getElementById("start_number").value;
    file = document.getElementById("sample").value;
    alert(delta_slope+'\n'+start_number);
    refresh(file, delta_slope, start_number);
  });
});

