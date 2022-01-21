<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App'
}
</script>

<style >
@import url('./assets/styles/font.css');
  .ol-scale-line {
    /* 比例尺背景颜色 */
    background: rgba(6,30,62,.8) !important;
    left: 10px !important;
    position: fixed !important;
    height: 35px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 5px !important;
    bottom: 10px !important;
}

.ol-scale-line-inner {
    /* 比例尺边框样式 */
    border: 1px solid #eee;
    border-top: none;
    /* 比例尺文字大小 */
    font-size: 10px;
    /* 比例尺文字颜色 */
    color: #eee;
    /* 比例尺宽高为动态计算，若需要固定宽度，将最大最小宽度设置为相同即可 */
    min-width: 100px;
    max-width: 100px;
}
</style>

