class Waterfall{
    constructor(){
        this.container = document.getElementById("wf_container");
        this.imgNumber = 0;
        this.column = 5;//列数
        this.zoomWidth = 350;
        this.src="http://cued.xunlei.com/demos/publ/img/P_";//图片来源
        this.init();
    }
    create(){
        for(var i = 0;i<this.column;i++)
        {
            var div = document.createElement("div");
            div.id="wfcolumn"+i;
            this.container.appendChild(div);
        }
        var self = this;
        
    }
    getIndex(){
        var index = this.imgNumber;
        if(index<10)
        {
            index="00"+index;
        }
        else if(index<100)
        {
            index="0"+index;
        }
        return index;
    }
    setData(){

    }
    init(){
        this.create();
    }
}
var waterfall = new Waterfall();
