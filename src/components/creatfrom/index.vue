<template>
  <section>
    <form-create v-model="fApi" :rule="rule" :option="option"></form-create>
  </section>
</template>
 
<script>
import Vue from 'vue'
export default {
  name: "Forms",
  components: {},
   props:{
    },
  data() {
    return {
      fromjson:null,//动态创建from表单的json数据
      filelists:[],
      targetlist:[],
      formdatas:null,
      // 实例对象
      fApi: {},
 
      // 表单生成规则数组对象  生成规则：http://www.form-create.com/v2/guide/rule.html
      // 生成规则数组中一个对象就是一个表单项（是一个json对象），在里面可以对应的表单名称、类型、属性、值、样式、类名、是否必填、错误提示等。
      rule: [],
 
      // 组件参数配置
      option: {
        // 显示重置表单按扭
        resetBtn: false,
        submitBtn:{
            show: false,
        },
        form:{
            inline: false,
            labelWidth: '170px',
        },
       
        // 表单提交按扭事件
        onSubmit: formData => {
        //   alert(JSON.stringify(formData));
 
          //按钮进入提交状态
          //   this.fApi.btn.loading();
 
          //重置按钮禁用
          //   this.fApi.resetBtn.disabled();
 
          //按钮进入可点击状态
          //   this.fApi.btn.finish();
        }
      }
    };
  },
  mounted() {
    this.$nextTick(()=>{
      
   });
  },
  watch:{

  },
  methods: {
    // 根据筛选条件判断是不是配置过筛选面板，如果搜索条件的筛选面板条件不为空，那就进行from表单赋值
    hasdata(){
      this.formdatas = this.$store.state.menuData.formdata
      let obj = new Object
    
      if(this.formdatas && this.formdatas.length !=0){
          
          for(var i=0;i<this.formdatas.length;i++){
            let row = this.formdatas [i]
            if(row.condition == 'scope'){
              obj[row.tableField+"-startvale"] = row.conditionType[0] ?  row.conditionType[0] : ''
              obj[row.tableField+"-endvale"] = row.conditionType[1] ?  row.conditionType[1] : ''
            }else if(row.condition == 'input'){
              obj[row.tableField] =  row.conditionType
            }else if(row.condition == 'check'){
              obj[row.tableField] =  row.conditionType
            }else if(row.condition == 'date'){
              obj[row.tableField] =  row.conditionType
            }
          } 
      }
      
      this.fApi.coverValue(obj)
    },
    //   根据fromjson数据动态创建表单的要素
    creatfromrule(arr){
      this.fromjson = arr
      this.targetlist = arr
        for(var i=0;i<arr.length;i++){
          if(arr[i].condition){
            let row =JSON.parse(arr[i].condition.value)
              if(row.condition =='scope'){
                this.filelists.push(row.tableField)
                    this.rule.push(
                       {
                        type: 'div',
                        field: row.tableField,
                        title:row.unit==''?row.tableFieldName+':' : row.tableFieldName+'('+row.unit+')'+':',
                        class:'fatherinput',
                        value:'',
                        col:{
                            span:24,
                        },
                        children: [
                           {
                                type:'input',
                                class:'inputstart',
                                field:row.tableField+"-startvale",
                                value:"",
                                col:{
                                    span:11,
                                },
                           },
                           {
                                type:'i',
                                class:'el-icon-minus',
                           },
                           {
                                type:'input',
                                class:'inputend',
                                field:row.tableField+"-endvale",
                                value:"",
                                col:{
                                        span:11,
                                    },
                           },
                        ]
                    }
                    )     
             
            }else if(row.condition =='input'){
                    this.rule.push(
                         {
                            type: "input", // 生成组件的名称(就是表单的名称：如input，radio，checkbox，select，slider等)
                            field:row.tableField, // 表单组件的字段名称(就是表单的name属性，注：该必须唯一),自定义组件可以不配置
                            className: "user-name-dom", // 设置组件的class属性
                            title:  row.unit==''?row.tableFieldName+':' : row.tableFieldName+'('+row.unit+')'+':', // 组件的名称, 选填
                            value: "", // 表单组件的字段值(就是表单的value值),自定义组件可以不用设置
                            props: {
                                disabled: false,
                                readonly: false,
                                clearable: true // 是否显示清空按钮
                            },
                            col: {
                                md: { span: 18}
                            }
                        },
                    )
            }else if(row.condition =='check'){
                    this.rule.push(
                         {
                            type: "checkbox", // 生成组件的名称(就是表单的名称：如input，radio，checkbox，select，slider等)
                            field:row.tableField, // 表单组件的字段名称(就是表单的name属性，注：该必须唯一),自定义组件可以不配置
                            className: "user-name-dom", // 设置组件的class属性
                            title:  row.unit==''?row.tableFieldName+':' : row.tableFieldName+'('+row.unit+')'+':', // 组件的名称, 选填
                            value: [], // 表单组件的字段值(就是表单的value值),自定义组件可以不用设置
                            options:row.conditionType,
                            props: {
                                disabled: false,
                                readonly: false,
                                clearable: true // 是否显示清空按钮
                            },
                            col: {
                                md: { span: 24}
                            }
                        },
                    )
            }else if(row.condition =="date"){
              if(row.conditionType =='datetimerange'){
                this.rule.push(
                    {
                      type: "DatePicker",
                      field: row.tableField,
                      title: row.tableFieldName+':',
                      value: [],
                      props: {
                          type: "daterange",
                          format: "yyyy-MM-dd",
                          placeholder:"请选择日期",
                      },
                      col: {
                        md: { span: 14}
                      }
                  }
                )
              }
            }
          }else{
  
          }

        }
        // this.hasdata()
    },
    // 设置表单数据
    ajaxSetDataFn() {
      // 获取表单数据绑定值

     
      let formData = this.fApi.formData()
       let ruleis = true
       let obj= new Object
      for(var i=0;i<this.filelists.length;i++){
        obj[this.filelists[i]] = []
        let newobjvalue = [formData[this.filelists[i]+'-startvale'],formData[this.filelists[i]+'-endvale']]
        if(formData[this.filelists[i]+'-startvale'] =='' && formData[this.filelists[i]+'-endvale' !='']){   //如果对象起始值为空  结束值不为空
          // ruleis = false
          // return
        }else if(formData[this.filelists[i]+'-startvale'] !='' && formData[this.filelists[i]+'-endvale' =='']){   //如果对象起始值不为空  结束值为空
          // ruleis = false
          // return
        }else if(formData[this.filelists[i]+'-startvale'] =='' && formData[this.filelists[i]+'-endvale' =='']){    //如果对象起始值为空  结束值为空
          obj[this.filelists[i]] = newobjvalue
        }else{
           obj[this.filelists[i]] = newobjvalue
        }
      
      }
     if(ruleis){
           let creatfrom= this.ceratformobj(formData,obj)
            return creatfrom
      }else{
          
      }
  
     
    
     
    },
    ceratformobj(formData,obj){
      let dataobj = new Object
        for (var p in formData){
          if(p.indexOf('-startvale')!=-1 || p.indexOf('-endvale')!=-1){

          }else{
            if(obj.hasOwnProperty(p)){
              dataobj[p] = obj[p]
            }else{
              dataobj[p] = formData[p]
            }
          }
        
      }
    let newcreatobj = new Object
    for(var ite in dataobj){
      if(dataobj[ite] instanceof Array){  //如果属性是数组的进来
        if(dataobj[ite].length == 0 || dataobj[ite][0] =='' || dataobj[ite][1] ==''){ //如果属性是数组的进来，而且是空数组，数组里面有空字符串
          delete dataobj[ite]
        }else{
      
        }
      }else if(typeof(dataobj[ite])=='string'){ //如果属性是字符的进来
        if(dataobj[ite] ==''){ //如果是空字符串就进来
          delete dataobj[ite]
        }else{
         
        }
      }
    }
    let keys = []
    for(var key in dataobj){
        keys.push(key)
      }

    let formdatacreat = []
    for(var i=0;i<this.targetlist.length;i++){
      let row =JSON.parse(this.targetlist[i].condition.value)
      for(var j=0;j<keys.length;j++){
        if(row.tableField ==keys[j]){
          let obj=new Object
          obj.tableField = keys[j]
          obj.condition = row.condition
          obj.conditionType = dataobj[keys[j]]
          formdatacreat.push(obj)
       
        }
      }
      
    }
     return formdatacreat
   
    },
    //获取Form表单 model对象
    getFormModelFn() {
    },
    // 重置表单
    resedFormModelFn(){
      this.fApi.resetFields()
      this.rule = []
      this.fromjson = null
    },
    // 重置表单不清空
    clearform(){
       this.fApi.resetFields()
    }
  }
};
</script>
 
<style lang="scss" scoped>
.el-form {
  margin: 0px auto;
  padding: 0px;
  width:100%;
  border-radius: 8px;
}
</style>