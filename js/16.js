/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = document.getElementById("aqi-city-input").value;
	     if(!city.match(/^[a-zA-Z]+$/)&&!city.match(/^[\u4e00-\u9fa5]+$/))
	 {
		alert("城市名称只能是英文或中文");
		return false;
	}
	var value = document.getElementById("aqi-value-input").value;
	if(!value.match(/^-?\d+$/))
	{
		alert("空气质量只能是数字");
		return false;
	}
	aqiData[city]=value;
	return true;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var aqi_table=document.getElementById("aqi-table");
	var result = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
	for(var city in aqiData)//遍历对象属性
	{
		result+="<tr><td>"+city+"</td><td>"+aqiData[city]+"</td><td><button>删除</button></td></tr>";
	}
	aqi_table.innerHTML=result;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  
  if(addAqiData())
  {
	  renderAqiList();
  }
  
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
  // do sth.
	var cityName=this.parentNode.parentNode.children[0].innerHTML;
	delete aqiData[cityName];
	
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	var add_btn=document.getElementById("add-btn");
	add_btn.addEventListener("click",addBtnHandle,false);
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  //利用一下addevent的false是开启冒泡的，再用event的target就知道事件源对象，即谁被点了
  document.getElementById("aqi-table").addEventListener("click",function(e){
	  var event = e || window.event;
	  var target = event.target || event.srcElement;
	  if(target.nodeName.toLowerCase()=="button")
	  {
		  delBtnHandle.call(target);
	  }
	  
	  
  },false);
  
}

init();