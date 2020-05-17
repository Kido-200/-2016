class TableTool{
    constructor(param,id){
        this.data = param;
        this.init(id);
    }
    createTable(id){
        var table = document.createElement("table");
        table.setAttribute("id",this.data.table_name);
        table.style.backgroundColor=this.data.table_color;
        var thead = document.createElement("thead");
        thead.style.backgroundColor=this.data.head_color;
        var table_html="<tr>",
            tempHTML="";
        //head的HTML写一下
        for(var i =0;i<this.data.table_head.length;i++)
        {
            if(this.data.isSort[i]==1)
            {
                tempHTML = "</p><span data-index='1' class='asc'>↑</span>&nbsp<span data-index='1' class='des'>↓</span>";
            }
              else 
            {
                tempHTML = "</p><span data-index='0'></span>&nbsp<span data-index='0'></span</td>";
            }
            table_html +="<td name='"+this.data.table_head[i]+"'style='width:"+this.data.tdWH[0]+"px;height:"+this.data.tdWH[1]+"px'><p>"+this.data.table_head[i]+tempHTML;
            //thead里的html，即
        }
        table_html+="</tr>";//他没写tr，估计浏览器帮他补上的
        thead.innerHTML=table_html;
        table.appendChild(thead);

        var tbody = document.createElement("tbody");
        var tbody_html="";
        for(var i in this.data.tbody_obj)
        {
            tbody_html+="<tr>";
            for(var j = 0;j<this.data.tbody_obj[i].length;j++)//这里跟他不一样
            {
                tbody_html+="<td style='width:"+this.data.tdWH[0]+"px;height:"+this.data.tdWH[1]+"px'>"+this.data.tbody_obj[i][j]+"</td>";
            }
            tbody_html+="</tr>";
        }
        tbody.innerHTML=tbody_html;
        table.appendChild(tbody);
        if(id==undefined)//指定了哪儿就放哪儿，没指定就自己创个div
        {
            var div = document.createElement("div");
            div.appendChild(table);
            document.body.appendChild(div);
        }
        else{
            document.getElementById(id).appendChild(table);
        }
    }
    bindSort(){
        var span_newarr = [];
        var span_arr = document.getElementById(this.data.table_name).getElementsByTagName("span");
        //找到箭头，偶数是上，奇数是下,也可以用class值来看
        var that = this;//添加事件的时候this会改变指向
        for(let i = 0;i<span_arr.length;i++)//防止一波闭包
        {
            span_arr[i].addEventListener("click",function(){
                if(this.className=="asc"){
                    // for(let x in that.data.table_head)
                    // {//找一下是第几列的按钮被点击，说实话用i/2就行了吧,注意JS是不会舍弃小数的
                    //     if(this.parentNode.className.toUpperCase()==that.data.table_head[x].toUpperCase())
                    //     {

                    //     }
                    // }
                    that.sortUp(Math.floor(i/2));
                }
                else{
                    that.sortDown(Math.floor(i/2));
                }
                that.isFrozen();
            },false);
          
        }
    }
    updateTbody(){
        var tbody_html="";
        for(var i in this.data.tbody_obj)
        {
            tbody_html+="<tr>";
            for(var j = 0;j<this.data.tbody_obj[i].length;j++)
            {
                tbody_html+="<td style='width:"+this.data.tdWH[0]+"px;height:"+this.data.tdWH[1]+"px'>"+this.data.tbody_obj[i][j]+"</td>";
            }
            tbody_html+="</tr>";
        }
        document.getElementById(this.data.table_name).getElementsByTagName("tbody")[0].innerHTML=tbody_html;
        
    }

    sortUp(index){
        var sortData = this.data.tbody_obj,
            newArr = [],
            newObj = {};
        for(let key in sortData)
        {
            newArr.push(sortData[key]);
        }
        //sort对数组才能用
        newArr.sort((a,b)=>a[index]-b[index]);

        //再转回对象
        for(var i = 0;i<newArr.length;i++)
        {
            newObj[i+1] = newArr[i];
        }

        this.data.tbody_obj = newObj;
        this.updateTbody();
    }
    sortDown(index){
                var sortData = this.data.tbody_obj,
                newArr = [],
                newObj = {};
            for(let key in sortData)
            {
                newArr.push(sortData[key]);
            }
            //sort对数组才能用
            newArr.sort((a,b)=>b[index]-a[index]);
            //再转回对象
            for(var i = 0;i<newArr.length;i++)
            {
                newObj[i+1] = newArr[i];
            }
            this.data.tbody_obj = newObj;
            this.updateTbody();
    }
   
    isFrozen(){
        if(this.data.isFrozen)
        {
            var tableChoose = document.getElementById(this.data.table_name);
            var firstTr = tableChoose.children[0];
            var tdh = this.data.tdWH[1];
            var tdw = this.data.tdWH[0];
            var that = this;
            var temp = firstTr.nextSibling.children[0];

            window.addEventListener("scroll",function(){
                var scrolltop = document.documentElement.scrollTop|| document.body.scrollTop;
                if((scrolltop<tableChoose.offsetTop + tableChoose.clientHeight)&&(scrolltop>tableChoose.offsetTop))
                {
                    firstTr.style.position="fixed";
                    firstTr.style.top=0;
                    //变成fixed会导致脱离文档流，导致下面那个tr会顶上来，所以这样有bug
                    for(var i = 0;i<temp.children.length;i++)
                    {
                        temp.children[i].style.paddingTop=firstTr.clientHeight+"px";
                    }
                    //因为tr不能设置margin和padding，td可以设置padding，所以设置一波td
                }
                else{
                    firstTr.style.position = "static";
                    firstTr.style.top=null;
                    for(var i = 0;i<temp.children.length;i++)
                    {
                        temp.children[i].style.paddingTop="0";
                    }                
                }
            },false);
    }
    }
    init(id){
        this.createTable(id);//创造表格
        this.bindSort();//添加sort功能
        this.isFrozen();
    }
}

// param{
//     table_name:
//     table_head:[]//thead里的td内容
//     isSort:[]//能否用这一列排序
//     tbody_obj:{
//         1:[]
//         2：//每行的td内容
//     }
//     tdWH:[宽，高]
//     head_color:
//     table_color:
//     isFrozen:
// }