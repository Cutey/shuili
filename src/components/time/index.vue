<template>
    <div class="header-time">
        <div class="header-time-divs"><span class="fonts">{{hour}}</span> <span class="spamsded">:</span> <span class="fonts">{{minu}}</span><span class="stresdf">{{str}}</span></div>
         <i class="split-line"></i>
        <div class="header-time-divs" style="font-size: 15px;color: rgba(133,133,132,1);"><span class="fonts">{{year}}</span> <span class="spamsded">:</span><span class="fonts">{{month}}</span> <span class="spamsded">:</span> <span class="fonts">{{date}}</span></div>
    </div>
</template>

<script>
export default {
    name:'timecomd',
    data(){
        return{
            nowTime: '',
            nowDate: '',
            nowWeek: '',
            year: "",
            month: "",
            date: "",
            day: "",
            hour: "",
            week: "",
            minu:"",
            str:"",
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.getCurrentDate()
        });
    },
    methods:{
        //获取时间
            getCurrentDate() {
                var now = new Date();
                this.year = now.getFullYear(); //得到年份
                this.month = now.getMonth(); //得到月份
                this.date = now.getDate(); //得到日期
                this.day = now.getDay(); //得到周几
                this.hour = now.getHours(); //得到小时
                this.minu = now.getMinutes(); //得到分钟
                this.sec = now.getSeconds(); //得到秒
                if(this.hour>12) {
                        this.hour -= 12;
                        this.str = " PM";
                    }else{
                        this.str = " AM";
                    }
                var weeks = new Array(
                    "星期日",
                    "星期一",
                    "星期二",
                    "星期三",
                    "星期四",
                    "星期五",
                    "星期六"
                );
                this.week = weeks[this.day];
                this.month = this.month + 1;
                if (this.month < 10) this.month = "0" + this.month;
                if (this.date < 10) this.date = "0" + this.date;
                if (this.hour < 10) this.hour = "0" + this.hour;
                if (this.minu < 10) this.minu = "0" + this.minu;
                if (this.sec < 10) this.sec = "0" + this.sec;
            },
    }
}
</script>

<style scoped>
 .header-time{
        color: #ececec;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
.header-time-divs{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
.split-line {
        width: 2px;
        height: 20px;
        background: #D85D0F;
        margin: 0 10px;
    }
.fonts {
    font-family: lcd;
    font-size: 20px;
    font-weight: bold;
    color: #05D3EB;
}
.spamsded{
    font-size: 18px;
    font-weight: bold;
    color: #0EA2E7;
}
.stresdf {
    margin-left: 5px;
    font-size: 19px;
    color: #05D3EB;
}
</style>