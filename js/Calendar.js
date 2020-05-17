class Calendar{
    constructor(options){
        this.options = options;
        var date = new Date();
        this.input = document.querySelector('[data-calendar]');
        this.year = date.getFullYear();
        //哪年
        this.month = date.getMonth() + 1;
        //哪月
        this.day = date.getDate();
        //哪日
        this.init();
    }
    initDom(){
        var calendar = document.createElement("div");
        calendar.id = "calendar";
        calendar.className=this.options.calendarClass;
        calendar.style.display="none";
        var selectBox = document.createElement("div");
        var selectYear = document.createElement('select');
        selectYear.id = 'year';
        for(var i = 2020;i<2030;i++)
        {
            var option = document.createElement("option");
            option.value= i;
            option.innerHTML = i;
            selectYear.appendChild(option);
        }
        var selectMonth = document.createElement('select');
        selectMonth.id = 'month';
        for(var i = 1;i<13;i++)
        {
            var option = document.createElement("option");
            option.value= i;
            option.innerHTML = i;
            selectMonth.appendChild(option);
        }

        var selectDay = document.createElement('select');
        selectDay.id = 'day';
        var monthLength = this.getMonthLength();
        for (var i = this.day; i < monthLength; i++) {
            var option = document.createElement('option')
            option.value = i;
            option.innerHTML = i;
            selectDay.appendChild(option)
        }
        selectBox.appendChild(selectYear);
        var yearLabel = document.createElement("label");
        yearLabel.innerHTML="年";
        yearLabel.for="year";

        selectBox.appendChild(selectMonth)
        var monthLabel = document.createElement('label');
        monthLabel.innerHTML = '月'
        monthLabel.for="month";
        selectBox.appendChild(monthLabel)

        selectBox.appendChild(selectDay)
        var dayLabel = document.createElement('label');
        dayLabel.innerHTML = '日'
        dayLabel.for="day";
        selectBox.appendChild(dayLabel)

        calendar.appendChild(selectBox);
        var node = this.input.nextElementSibling;
        document.body.insertBefore(calendar,node);
    }
    initProperty(){//当select的option被点击的时候触发，去修改input
        var str = this.year+'-'+this.month+'-'+this.day;
        this.input.value = str;
    }
    paint(year,month){
        //画出table
        var calendar = document.querySelector('#calendar');
        var table = document.createElement("table");
        var th = document.createElement('tr');
        th.innerHTML = '<th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th>';
        table.appendChild(th);

        var curArrHeight = this.getArrHeight(year, month);
        var monthLength = this.getMonthLength(year, month);
        var firstDay = this.getFirstDay(year, month);    
        var preMonthLength = this.getMonthLength(year, month - 1)
        var pre = [];
        for(var i = firstDay;i>0;i--)
        {
            pre.push(preMonthLength-i);
        }

        var cellClass = this.options.cellClass;
        var uesdClass = cellClass+' '+this.options.uesdClass;
        var p = 1;
        var q = 1;
        for(var i = 0;i<curArrHeight;i++)
        {
            var tr = document.createElement("tr");
            for(var j = 0;j<7;j++)
            {
                var td = document.createElement('td');
                if(i==0)
                {
                    if(j<firstDay)
                    {
                        td.innerHTML = pre.shift();
                        td.className = cellClass;
                    }
                    else{
                        td.innerHTML=p++;
                        td.className = uesdClass;
                        if(td.innerHTML ==this.day)
                        {
                            td.className += ' active'
                        }
                    }
                }
                else if(i==curArrHeight-1)
                {
                    if (p <= monthLength) {
                        td.innerHTML = p++;
                        td.className = uesdClass;
                        if (td.innerHTML == this.day) {
                            td.className += ' active'
                        }
                    } else {
                        td.innerHTML = q++;
                        td.className = cellClass;
                    }
                }
                else
                {
                    td.innerHTML = p++;
                    td.className = uesdClass;
                    if (td.innerHTML == this.day) {
                        td.className += ' active'
                    }
                }
                tr.appendChild(td);
            }
            table.appendChild(tr)

        }
        calendar.appendChild(table)

    }
    //根据年月计算当月有几天
    getMonthLength(year,month){
        year = year||new Date().getFullYear();
        month = month || new Date().getMonth()+1;
        //表示这个月的前一天 Date(year,month,0).getDate()
        //+1了，导致会创建本月的最后一天
        return new Date(year,month,0).getDate();
    }
    getFirstDay(year,month) {
        year = year || new Date().getFullYear();
        month = month || new Date().getMonth() + 1;
        return new Date(year, month - 1, 1).getDay();
    }
    //根据年月给出当月日历的行数
    getArrHeight(year,month){
        //这个月的天数,最后一天是几号
        var monthLength = this.getMonthLength(year,month);
        //这个月的第一天是礼拜几
        var firstDay = this.getFirstDay(year,month);
        var arrHeight = Math.ceil((firstDay + monthLength) / 7)
        return arrHeight;
    }
    initEvent()//给select添加事件
    {
        var self = this;
        this.input.onfocus = function(){
            document.querySelector("#calendar").style.display = "block";
        }
        document.querySelector("#year").addEventListener("change", function() {

            if (this.selectedIndex === 0) { //当前年的特殊月份和日
                var date = new Date();
                //几月
                var nowmonth = date.getMonth() + 1;
                //几号
                var nowday = date.getDate();

                document.querySelector("#month").innerHTML = ""; //特殊月
                for (var i = nowmonth; i < 13; i++) {
                    var option = document.createElement('option');
                    option.value = i;
                    option.innerHTML = i;
                    document.querySelector("#month").appendChild(option);
                }

                self.day = nowday; //改储存着的day

                var calen = document.querySelector("#calendar");
                var yearBox = document.querySelector("#year");
                var yearIndex = yearBox.selectedIndex;
                var yearText = yearBox[yearIndex].text;

                var monthBox = document.querySelector("#month");
                var monthIndex = monthBox.selectedIndex;
                var monthText = monthBox[monthIndex].text;

                var index = this.selectedIndex; //获取选中的索引
                var text = this[index].text; //选中的文本

                self.year = this[index].text //把day改为选中的日期

                calen.removeChild(calen.lastChild);
                self.paint(yearText, monthText);

                var dayLength = document.getElementsByClassName('used').length + 1; //特殊日
                document.querySelector("#day").innerHTML = "";
                for (var i = nowday; i < dayLength; i++) {
                    var option = document.createElement('option');
                    option.value = i;
                    option.innerHTML = i;
                    document.querySelector("#day").appendChild(option);
                }

                self.input.value = yearText + "-" + nowmonth + "-" + self.day;
            } else {
                self.updateMonth(); //默认的月份
                self.day = 1; //改储存着的day默认为1
                self.month = 1;

                var calen = document.querySelector("#calendar");
                var yearBox = document.querySelector("#year");
                var yearIndex = yearBox.selectedIndex;
                var yearText = yearBox[yearIndex].text;

                var monthBox = document.querySelector("#month");
                var monthIndex = monthBox.selectedIndex;
                var monthText = monthBox[monthIndex].text;

                var index = this.selectedIndex; //获取选中的索引
                var text = this[index].text; //选中的文本

                self.year = this[index].text //把day改为选中的日期

                calen.removeChild(calen.lastChild);
                self.paint(yearText, monthText);

                self.updateDay(); //默认的日

                self.input.value = yearText + "-" + monthText + "-" + self.day;
            }

        }, false);
        document.querySelector("#month").addEventListener("change", function() {
            var calen = document.querySelector("#calendar");
            var yearBox = document.querySelector("#year");
            var yearIndex = yearBox.selectedIndex;
            var yearText = yearBox[yearIndex].text;

            var monthBox = document.querySelector("#month");
            var monthIndex = monthBox.selectedIndex;
            var monthText = monthBox[monthIndex].text;

            var index = this.selectedIndex; //获取选中的索引
            var text = this[index].text; //选中的文本

            self.month = this[index].text //把day改为选中的日期

            calen.removeChild(calen.lastChild);
            self.paint(yearText, monthText);

            self.input.value = yearText + "-" + monthText + "-" + self.day;

            var date = new Date();
            var nowyear = date.getFullYear();
            //几月
            var nowmonth = date.getMonth() + 1;
            //几号
            var nowday = date.getDate();
            if (nowyear == self.year && this.selectedIndex === 0) { //当前年的当前月，把下拉day给改成当前的特殊day
                var dayLength = document.getElementsByClassName('used').length + 1; //特殊日
                console.log(dayLength)
                document.querySelector("#day").innerHTML = "";
                for (var i = nowday; i < dayLength; i++) {
                    var option = document.createElement('option');
                    option.value = i;
                    option.innerHTML = i;
                    document.querySelector("#day").appendChild(option);
                }
                self.day = nowday; //改储存着的day
            } else {
                self.updateDay();
                self.day = 1; //改储存着的day默认为1
            }

        }, false);
        document.getElementById("day").addEventListener("change",function(){
            self.day = Number(this[this.selectedIndex].innerHTML);
            var calendar = document.getElementById("calendar");
            var td = calendar.getElementsByTagName("td");
            for(var i = 0;i<td.length;i++)
            {
                var a = td[i].className.indexOf("active");
                if(a>=0)
                {
                    td[i].className = td[i].className.slice(0,a);
                }
                if(td[i].innerHTML==self.day&&td[i].className.indexOf("used")>=0)
                {
                    td[i].className+=" active";
                }
            }
        },false);
        
    }
    updateMonth() {
        // 重新渲染下拉的month框
        document.querySelector("#month").innerHTML = "";
        for (var i = 1; i < 13; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.innerHTML = i;
            document.querySelector("#month").appendChild(option);
        }
    }
    updateDay() {
        // 重新渲染下拉的day框
        var dayLength = document.getElementsByClassName('used').length + 1;
        document.querySelector("#day").innerHTML = "";
        for (var i = 1; i < dayLength; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.innerHTML = i;
            document.querySelector("#day").appendChild(option);
        }
    }
    init(){
        this.initDom();
        this.initProperty();
        this.paint(this.year,this.month);
        this.initEvent();
    }
}