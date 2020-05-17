/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
	//右边的是空气质量
    dat.setDate(dat.getDate() + 1);
	//日期时间+1
  }
  return returnData;//返回一个对象，包含91个日期的属性
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};
function randomColor() {
    color = {
        r: Math.floor(Math.random() * 250),
        g: Math.floor(Math.random() * 250),
        b: Math.floor(Math.random() * 250),
    }
    return color.r + ',' + color.g + ',' + color.b;
}

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
	var chart_wrap = document.getElementById("aqi-chart-wrap");
	var now_select_city = pageState["nowSelectCity"];
	var now_gra_time = pageState["nowGraTime"];//默认是day
	var graData = chartData[now_gra_time][now_select_city];
	
	var style = "style='width:{width};height:{height};background-color:rgba({color},0.6)'";
	var title = "title = {title}的空气质量为:{data}";
	//title里是日期+城市名,鼠标移上去会显示
	var module = "<div "+style+title+"><span>{date}</span></div>";
	var html = "";
	for(var x in graData)
	{
		html+=module.replace("{width}",graData[x]["width"]).replace("{height}",graData[x]["height"]).replace('{color}', graData[x]['color']).replace('{title}', graData[x]['title']).replace('{data}', graData[x]['data']).replace('{date}',graData[x]['date']); //调用replace()方法动态设置浏览器元素为数据组里的
	}
	chart_wrap.innerHTML=html;
	 
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(e) {
  // 确定是否选项发生了变化

  // 设置对应数据

  // 调用图表渲染函数
  if(pageState["nowGraTime"]==e.target.value)
  {
	  return false;
  }
  pageState["nowGraTime"] = e.target.value;
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(e) {
  // 确定是否选项发生了变化
	if(pageState["nowSelectCity"]==e.target.value)
	{
		console.log("true");
		return false;
	}
  // 设置对应数据
    pageState["nowSelectCity"] = e.target.value;

  // 调用图表渲染函数
    renderChart();

}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
	var form_gra_time = document.getElementById("form-gra-time");
	form_gra_time.addEventListener("change",graTimeChange,false);
	//当option发生改变触发graTimeChange
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

  // 给select设置事件，当选项发生变化时调用函数citySelectChange
	var result = "";
	for(var city in aqiSourceData)
	{
		result+="<option>"+city+"</option>";
	}
	var city_select =document.getElementById("city-select");
	city_select.innerHTML = result;
	city_select.addEventListener("change",citySelectChange,false);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  //防止重复计算，这里直接计算好每次按钮改变，innerHTML里应该放的字符串放到charData
  //那么charData{day:{"北京":{年月日1:{data:2,width:"",...}}},week:{}}
  var day ={};
  var week = {};
  var weekNum = 1;
  var weekTotal = 0;
  var weekDays = 0;
  var month = {};
  var monthNum = 1;
  var monthTotal = 0;
  for(var city in aqiSourceData)
  {
	  day[city] = {};
	  week[city] = {};
	  month[city] = {};
	  for(var date in aqiSourceData[city])
	  {
		  var sourceData = aqiSourceData[city][date];//该天的空气质量
		  
		  /*每天的数据*/
		  var dayGet = {};//
		  dayGet["data"] = sourceData;
		  dayGet["height"] = sourceData * 0.75 +"px";//高度为数据的3/4
		  dayGet["width"] = "14px";
		  dayGet["color"] = randomColor();
		  dayGet["title"] = city+date;//传入当前的城市和日期,所以这个的意义是个JB？
		  dayGet["date"] = date.slice(8,10);//存的是几号
		  day[city][date] = dayGet;
		  
		  /*每周的数据*/
		  var weekGet={};
		  weekTotal+=sourceData;
		  weekDays++;
		  if(weekDays==7||date =="2016-03-31")
		  {
			  var weekData = (weekTotal/7).toFixed(2);
			  var weekGet = {};
			  weekGet["data"] = weekData;
			  weekGet["height"] = weekData * 0.75 +"px";
			  weekGet["width"] = "50px";
			  weekGet["color"] = randomColor();
			  weekGet["title"] = city+date;
			  
			  var key = "第"+ weekNum +"周";
			  weekGet["date"] = key;
			  week[city][key]= weekGet;
			  weekTotal = 0;
			  weekDays = 0;
			  weekNum++;
		  }
		  
		  /*每月的数据*/
		  monthTotal+=sourceData;
		  if(date == '2016-01-31' || date == '2016-03-31' || date == '2016-02-29')
		  {
			  
			 var monthGet={};
			 var monthData = (monthTotal/Number(date.slice(8,10))).toFixed(2);
			 monthGet["data"] = monthData;
			 monthGet["height"] = monthData * 0.75 +"px";
			 monthGet['width'] = '50px'; //每日数据的宽度设为10px
			 monthGet['color'] = randomColor();
			 monthGet['title'] = city + key; //传入当前的城市和日期
			 
			 var key = "第" + monthNum + "月";
			 monthGet['date'] = key; //传入当前的日期
			 month[city][key] = monthGet;
			 monthTotal = 0;
			 monthNum++;
		  }
	  }
	  weekNum = 1;
	  monthNum = 1;
  }
  chartData.day=day;
  chartData.week = week;
  chartData.month = month;
}

/**
 * 初始化函数
 */
function init() {
  initAqiChartData();
  initGraTimeForm()
  initCitySelector();
   if (pageState['nowSelectCity'] == -1) {
          pageState['nowSelectCity'] = '北京';
          renderChart();
      }
}

init();