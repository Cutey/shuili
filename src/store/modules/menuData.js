import mapUtil from "@/utils/Openlayer-utils";
const menuData = {
    state: {
        mapIndex: 0,
        mapceter: [],
        layersnamelist: [], //地图添加的图层名称数组
        listByRole: [], //所有水利对象
        tjfxactiverole: null,
        isclearmap: false,
        activerole: null, //单选选中的水利对象
        checkboxlist: [], //多选选中的水利对象
        resdata: [], //搜索面板确定后获取的数据list
        isjuan: false, //是否开启卷帘模式
        dialogshow: false, //弹出框控制
        formdata: [], //from创建表单的data
        slyspar: { //水利要素的搜索条件
            pageNo: 1,
            pageSize: 10,
            data: [],
            serachname: '',
            spaceCode: '',
            order: {
                tableField: '',
                orderType: ''
            },
            tableNames: '',
            spaceWkt: '',
        },
        showlend: false, //图例弹出框展示控制,
        legthlist: [], //图例展示数据、
        menuactive: '', //服务管理右侧菜单树默认选中值
        showmoudle: false, //服务展示模块是否展示的控制
        showserverkey: '', //服务展示头部选中模块的key
        spaceWkt: '', //缓冲区填充的空间数据
    },
    mutations: {
        SET_MAPINDEX: (state, mapIndex) => {
            state.mapIndex = mapIndex
        },
        SET_MAPINDEXCENTER: (state, mapceter) => {
            state.mapceter = mapceter
        },
        SET_LAYERSNAMELIST: (state, layersname) => {
            state.layersnamelist.push(layersname)
        },
        DELETED_LAYERSNAMELIST: (state, layersname) => {
            mapUtil.clearLayer(layersname)
            var ind = state.layersnamelist.indexOf(layersname)
            if (ind != -1) {
                state.layersnamelist.splice(ind, 1)
            }
        },
        SET_ACTYIVEROLE: (state, activerole) => {
            state.activerole = activerole
        },
        SET_CHECKBOXLIST: (state, checkboxlist) => {
            state.checkboxlist = checkboxlist
        },
        SRT_RESDATA: (state, resdata) => {
            state.resdata = resdata
        },
        SRT_ISJUAN: (state, isjuan) => {
            state.isjuan = isjuan
        },
        SRT_LISTBYROLE: (state, listByRole) => {
            state.listByRole = listByRole
        },
        SET_DIALONGSHOW: (state, dialogshow) => {
            state.dialogshow = dialogshow
        },
        SET_FORMDATA: (state, formdata) => {
            state.formdata = formdata
        },
        SET_SLYSPAR: (state, slyspar) => {
            state.slyspar = slyspar
        },
        SET_TJYSACTIVE: (state, tjfxactiverole) => {
            state.tjfxactiverole = tjfxactiverole
        },
        SET_CLEARMAP: (state, isclearmap) => {
            state.isclearmap = isclearmap
        },
        SET_SHOWLEND: (state, showlend) => {
            state.showlend = showlend
        },
        SET_LENGTHLIST: (state, legthlist) => {
            state.legthlist = legthlist
        },
        SET_MENUACTIVE: (state, menuactive) => {
            state.menuactive = menuactive
        },
        SET_SHOWMOUDLE: (state, showmoudle) => {
            state.showmoudle = showmoudle
        },
        SET_SHOWSERVERKEY: (state, showserverkey) => {
            state.showserverkey = showserverkey
        },
        SET_SPACEWKT: (state, spaceWkt) => {
            state.spaceWkt = spaceWkt
        },
    },
    actions: {
        setmapIndex({ commit }, mapIndex) {
            commit('SET_MAPINDEX', mapIndex);
        },
        setmapCenter({ commit }, mapceter) {
            commit('SET_MAPINDEXCENTER', mapceter);
        },
        setlayersnameList({ commit }, layersname) {
            commit('SET_LAYERSNAMELIST', layersname);
        },
        deletedayersnameList({ commit }, layersname) {
            commit('DELETED_LAYERSNAMELIST', layersname);
        },
        setactiverole({ commit }, activerole) {
            commit('SET_ACTYIVEROLE', activerole);
        },
        setcheckboxlist({ commit }, checkboxlist) {
            commit('SET_CHECKBOXLIST', checkboxlist);
        },
        setresdata({ commit }, resdata) {
            commit('SRT_RESDATA', resdata);
        },
        setisjuan({ commit }, isjuan) {
            commit('SRT_ISJUAN', isjuan);
        },
        setlistByRole({ commit }, listByRole) {
            commit('SRT_LISTBYROLE', listByRole);
        },
        setformdata({ commit }, formdata) {
            commit('SET_FORMDATA', formdata);

        },
        setslyspar({ commit }, slyspar) {
            commit('SET_SLYSPAR', slyspar);

        },
        setjfxactiverole({ commit }, tjfxactiverole) {
            commit('SET_TJYSACTIVE', tjfxactiverole);
        },
        setisclearmap({ commit }, isclearmap) {
            commit('SET_CLEARMAP', isclearmap);
        },
        setshowlend({ commit }, showlend) {
            commit('SET_SHOWLEND', showlend);
        },
        setlegthlist({ commit }, legthlist) {
            commit('SET_LENGTHLIST', legthlist);
        },
        setmenuactive({ commit }, menuactive) {
            commit('SET_MENUACTIVE', menuactive);
        },
        setshowmoudle({ commit }, showmoudle) {
            commit('SET_SHOWMOUDLE', showmoudle);
        },
        setshowserverkey({ commit }, showserverkey) {
            commit('SET_SHOWSERVERKEY', showserverkey);
        },
        setspaceWkt({ commit }, spaceWkt) {
            commit('SET_SPACEWKT', spaceWkt);
        },


    }
};
export default menuData