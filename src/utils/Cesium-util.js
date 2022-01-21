import * as Cesium from 'cesium';
import AppCfg from "@/config/AppCfg";
import CesiumNavigation from 'cesium-navigation-es6';
import Vue from 'vue';
import { default as proj4 } from 'proj4';


Cesium.GeoJsonDataSource.crsNames[
    "urn:ogc:def:crs:EPSG::3857"
] = Cesium.GeoJsonDataSource.crsNames["EPSG:3857"] = function(
    coordinates
) {
    const firstProjection =
        'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],AUTHORITY["EPSG","3857"]]';
    const secondProjection =
        'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';

    const xa = coordinates[0];
    const ya = coordinates[1];

    const newCoordinates = proj4(
        firstProjection,
        secondProjection, [xa, ya]
    );
    return Cesium.Cartesian3.fromDegrees(
        newCoordinates[0],
        newCoordinates[1],
        0
    );
};
const GlobeUtil = {
    _globeInstance: null, //实例
    _handler: null, //事件处理对象
    lastdata: [],
    getGlobeInstance() {
        return this._globeInstance;
    },
    imageLabelLayer: null,
    initGlobe(globeDiv, num, isshowAnimate) {
        Cesium.Ion.defaultAccessToken = AppCfg.ionToken;
        Cesium.Camera.DEFAULT_VIEW_FACTOR = num; //摄像机视口远近参数，数字越大地球越远离视口
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(72, 3, 136, 54); //地球初始显示位置设置--中国
        let viewer = new Cesium.Viewer(globeDiv, {
            //terrainProvider: Cesium.createWorldTerrain(),//加载地形，从渲染速度上暂时停用
            // 需要进行可视化的数据源的集合
            selectionIndicator: false, //关闭鼠标点击绿框
            animation: false, //动画控制
            shouldAnimate: isshowAnimate, //是否自动播放
            timeline: false, //时间线
            fullscreenButton: false, //全屏按钮
            infoBox: false, //要素信息框
            homeButton: false,
            baseLayerPicker: true,
            sceneModePicker: false,
            navigationHelpButton: false,
            geocoder: false,
            scene3DOnly: false, //设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            requestRenderMode: false, // 启用请求渲染模式
            sceneMode: 3, // 初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
            orderIndependentTranslucency: isshowAnimate,
            contextOptions: {
                webgl: {
                    alpha: true,
                }
            },
            skyBox: new Cesium.SkyBox({
                    sources: {
                        positiveX: process.env.VUE_APP_BASE_API + 'profile/SkyBoxExt/tycho2t3_80_px.jpg',
                        negativeX: process.env.VUE_APP_BASE_API + 'profile/SkyBoxExt/tycho2t3_80_mx.jpg',
                        positiveY: process.env.VUE_APP_BASE_API + 'profile/SkyBoxExt/tycho2t3_80_py.jpg',
                        negativeY: process.env.VUE_APP_BASE_API + 'profile/SkyBoxExt/tycho2t3_80_my.jpg',
                        positiveZ: process.env.VUE_APP_BASE_API + 'profile/SkyBoxExt/tycho2t3_80_pz.jpg',
                        negativeZ: process.env.VUE_APP_BASE_API + 'profile/SkyBoxExt/tycho2t3_80_mz.jpg'
                    }
                }) //用于渲染星空的SkyBox对象
                //fullscreenElement: document.body, // 全屏时渲染的HTML元素 暂时没发现用处
        });


        viewer.scene.skyBox.show = !isshowAnimate;
        // viewer.scene.undergroundMode = true
        // viewer.scene.globe.show = false

        if (isshowAnimate) {
            viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);
        } else {
            viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 1);
        }


              
        viewer.scene.sun.show = !isshowAnimate;       
        viewer.scene.moon.show = !isshowAnimate;
        //this.cesiumViewer.scene.primitives.add(Cesium.createOsmBuildings());//加载建筑物图层
        // 去除版权信息
        viewer._cesiumWidget._creditContainer.style.display = "none";

        this._globeInstance = viewer;
        this._handler = viewer.screenSpaceEventHandler;
        //取消双击事件
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        //设置homebutton的位置
        //方法1
        /*Cesium.Camera.DEFAULT_VIEW_RECTANGLE =
            Cesium.Rectangle.fromDegrees(AppCfg.globe.bound.W, AppCfg.globe.bound.S, AppCfg.globe.bound.E, AppCfg.globe.bound.N);*/
        //方法2,采用兰布达表达式去掉作用限制
        /*viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
            e.cancel = true;
            this.restoreView(viewer);
        });*/

        //设置初始位置
        // this.restoreView(viewer);
        this.addGlobeNav(AppCfg.globe.location.X, AppCfg.globe.location.Y, AppCfg.globe.location.H);

        //根据国情本土化转换
        this.convert(viewer);

        //去掉大气光圈
        viewer.scene.skyAtmosphere.show = false;

        //开启太阳光照功能
        viewer.scene.sunBloom = true;

        //球体参数设置
        let g = viewer.scene.globe;
        g.enableLighting = false;
        g.showGroundAtmosphere = true;
        g.atmosphereHueShift = 0.0;
        g.atmosphereBrightnessShift = 0.0;
        g.atmosphereSaturationShift = 0.2;
        g.baseColor = Cesium.Color.fromCssColorString(AppCfg.common.COLOR); //Cesium.Color.TRANSPARENT;//;
        // g.fillHighlightColor = Cesium.Color.TRANSPARENT;

        //此参数若设置为True，会出现绘制要素渲染异常，慎用
        //g.depthTestAgainstTerrain = true;

        //g.shadows = Cesium.ShadowMode.DISABLED;

        //渲染性能参数
        this.showFramesPerSecond(viewer, true);

        //地图清晰度设置
        //1、开启抗锯齿
        viewer.scene.postProcessStages.fxaa.enabled = false;
        //viewer.scene.globe.maximumScreenSpaceError = 4/3;

        //2、调整分辨率
        let supportsImageRenderingPixelated = viewer.cesiumWidget._supportsImageRenderingPixelated;
        if (supportsImageRenderingPixelated) {
            let vtxf_dpr = window.devicePixelRatio;
            while (vtxf_dpr >= 2.0) {
                vtxf_dpr /= 2.0;
            }
            viewer.resolutionScale = vtxf_dpr;
        }

        //天地图
        this.createBaseLayerPicker4TDT(viewer, true, true);
        this.addgjserver(viewer)

        //ArcGIS
        // this.createBaseLayerPicker4ArcGIS(viewer, true, true);
    },


    /**
     * 场景初始位置恢复
     * @param viewer
     */
    restoreView: function(viewer) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(13156275.647413502, 4803573.127806621, 1000),
            // orientation: {
            //     heading: Cesium.Math.toRadians(0,0),
            //     pitch: Cesium.Math.toRadians(-40),
            // }
        });
    },
    /**
     * 相机飞行位置
     * @param x  经度
     * @param y  纬度
     * @param z  高度
     * @param heading  航偏角
     * @param pitch  俯视角
     * */
    cameraFlyTo(x, y, z, heading, pitch) {
        this._globeInstance.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(x, y, z),
            orientation: {
                heading: Cesium.Math.toRadians(heading),
                pitch: Cesium.Math.toRadians(pitch),
            }
        });
    },
    cameraFlyToEx(x, y, z) {
        this._globeInstance.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(x, y, z)
        });
    },
    //本地化
    convert: function(viewer) {
        if (viewer) {
            //（0）通过API修改鼠标操作---左键平移、中键缩放、右键旋转,代码如下：
            viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
            viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG];

            //（1）修改sceneModePicker：
            if (viewer.sceneModePicker) {
                viewer.sceneModePicker.viewModel.tooltip3D = "三维";
                viewer.sceneModePicker.viewModel.tooltip2D = "二维";
                viewer.sceneModePicker.viewModel.tooltipColumbusView = "哥伦布视图";
            }

            //(2）修改homeButton：
            if (viewer.homeButton) {
                viewer.homeButton.viewModel.tooltip = "初始位置";
            }

            //(3）修改navigationHelpButton：
            if (viewer.navigationHelpButton) {
                viewer.navigationHelpButton.viewModel.tooltip = "操作指南";
                let clickHelper = viewer.navigationHelpButton.container.getElementsByClassName("cesium-click-navigation-help")[0];
                let touchHelper = viewer.navigationHelpButton.container.getElementsByClassName("cesium-touch-navigation-help")[0];

                let button = viewer.navigationHelpButton.container.getElementsByClassName("cesium-navigation-button-right")[0];
                button.innerHTML = button.innerHTML.replace(">Touch", ">手势");
                button = viewer.navigationHelpButton.container.getElementsByClassName("cesium-navigation-button-left")[0];
                button.innerHTML = button.innerHTML.replace(">Mouse", ">鼠标");

                let click_help_pan = clickHelper.getElementsByClassName("cesium-navigation-help-pan")[0];
                click_help_pan.innerHTML = "平移";
                let click_help_pan_details = click_help_pan.parentNode.getElementsByClassName("cesium-navigation-help-details")[0];
                click_help_pan_details.innerHTML = "按下左键 + 拖动";

                let click_help_zoom = clickHelper.getElementsByClassName("cesium-navigation-help-zoom")[0];
                click_help_zoom.innerHTML = "旋转";
                click_help_zoom.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "按下右键+拖动";
                click_help_zoom.parentNode.getElementsByClassName("cesium-navigation-help-details")[1].innerHTML = "";

                let click_help_rotate = clickHelper.getElementsByClassName("cesium-navigation-help-rotate")[0];
                click_help_rotate.innerHTML = "缩放";
                click_help_rotate.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "滚动鼠标滚轮";
                click_help_rotate.parentNode.getElementsByClassName("cesium-navigation-help-details")[1].innerHTML = "";
                //触屏操作
                let touch_help_pan = touchHelper.getElementsByClassName("cesium-navigation-help-pan")[0];
                touch_help_pan.innerHTML = "平移";
                touch_help_pan.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "单指拖动";

                let touch_help_zoom = touchHelper.getElementsByClassName("cesium-navigation-help-zoom")[0];
                touch_help_zoom.innerHTML = "缩放";
                touch_help_zoom.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "双指捏合";

                let touch_help_tilt = touchHelper.getElementsByClassName("cesium-navigation-help-rotate")[0];
                touch_help_tilt.innerHTML = "俯仰";
                touch_help_tilt.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "双指同向拖动";

                let touch_help_rotate = touchHelper.getElementsByClassName("cesium-navigation-help-tilt")[0];
                touch_help_rotate.innerHTML = "旋转";
                touch_help_rotate.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "双指反向拖动";
            }

            //(4)全屏按钮修改：
            /*if (viewer.fullscreenButton) {
                viewer.fullscreenButton.viewModel.tooltip = viewer.fullscreenButton.viewModel.isFullscreen ? "退出全屏" : "全屏模式";
            }*/
        }
    },
    /**
     * 产生随机整数，包含下限值，包括上限值
     * @param {Number} lower 下限
     * @param {Number} upper 上限
     * @return {Number} 返回在下限到上限之间的一个随机整数
     */
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    eventHandler() {
        return this._handler;
    },
    removeEvent() {
        if (this._handler) {
            this._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
    },
    /**
     * 创建底图切换工具（ESRI）
     */
    createBaseLayerPicker4ArcGIS: function(viewer, isShowLabel, isShowTools) {
        if (viewer) {
            //清除默认底图集合
            if (!isShowLabel) {
                viewer.imageryLayers.removeAll();
            }

            viewer.baseLayerPicker.viewModel.imageryProviderViewModels = [];
            viewer.baseLayerPicker.viewModel.terrainProviderViewModels = [];

            //矢量底图切换
            let vector_arcgis = new Cesium.ProviderViewModel({
                name: "ArcGIS矢量服务",
                tooltip: "矢量底图",
                //显示切换的图标
                iconUrl: require('../assets/vector.png'),
                creationFunction: function() {
                    let arcgis_vector = new Cesium.ArcGisMapServerImageryProvider({
                        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer',
                        maximumLevel: AppCfg.globe.maxLevel4arc,
                        credit: new Cesium.Credit('ArcGIS全球矢量服务')
                    });
                    return arcgis_vector;
                }
            });
            //矢量底图切换
            let vector_arcgis_night = new Cesium.ProviderViewModel({
                name: "ArcGIS矢量服务",
                tooltip: "矢量底图(蓝黑版)",
                iconUrl: require('../assets/vector.png'),
                creationFunction: function() {
                    let arcgis_night = new Cesium.ArcGisMapServerImageryProvider({
                        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
                        maximumLevel: AppCfg.globe.maxLevel4arc,
                        credit: new Cesium.Credit('ArcGIS全球矢量服务')
                    });
                    return arcgis_night;
                }
            });

            //影像底图切换
            let image_arcgis = new Cesium.ProviderViewModel({
                name: "ArcGIS影像服务",
                tooltip: "影像底图",
                iconUrl: require('../assets/image.png'),
                creationFunction: function() {
                    let arcgis_image = new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                        maximumLevel: AppCfg.globe.maxLevel4arc,
                        credit: new Cesium.Credit('ArcGIS全球影像服务')
                    });

                    /*let arcgis_image = new Cesium.WebMapTileServiceImageryProvider({
                        url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS",
                        layer: "World_Imagery",
                        style: "default",
                        format: "image/jpeg",
                        tileMatrixSetID: "default028mm",
                        maximumLevel: 23,
                        //maximumLevel: AppCfg.globe.maxLevel4arc,
                        credit: new Cesium.Credit('ArcGIS全球影像服务')
                    });*/

                    if (isShowLabel) {
                        GlobeUtil.imageLabelLayer = new Cesium.ArcGisMapServerImageryProvider({
                            url: 'http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/administrative_division_boundaryandlabel/MapServer',
                            maximumLevel: AppCfg.globe.maxLevel4arcLabel,
                            credit: new Cesium.Credit('ArcGIS全球标注服务')
                        });
                        viewer.imageryLayers.addImageryProvider(GlobeUtil.imageLabelLayer);
                    }

                    return arcgis_image;
                }
            });

            //更改地图切换的标题
            document.querySelector('.cesium-baseLayerPicker-sectionTitle').innerText = "场景底图";

            //隐藏cesium工具栏
            if (isShowTools) {
                document.querySelector('.cesium-viewer-toolbar').style.display = 'none';
            }

            //设置默认地图源-天地图影像底图
            viewer.baseLayerPicker.viewModel.imageryProviderViewModels = [vector_arcgis, vector_arcgis_night, image_arcgis];
            // viewer.baseLayerPicker.viewModel.selectedImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[0];
        }
    },
    /**
     * 创建底图切换工具（天地图）
     */
    createBaseLayerPicker4TDT: function(viewer, isShowLabel, isShowTools) {
        if (viewer) {
            let tileMatrixSetID = 'GoogleMapsCompatible';
            let subdomains = AppCfg.tdtTokenPool;
            //清除默认底图集合
            // if (!isShowLabel) {
            //     viewer.imageryLayers.removeAll();
            // }

            // viewer.baseLayerPicker.viewModel.imageryProviderViewModels = [];
            // viewer.baseLayerPicker.viewModel.terrainProviderViewModels = [];

            //影像底图切换
            let image_tdt = new Cesium.ProviderViewModel({
                name: "天地图影像",
                tooltip: "影像底图",
                //显示切换的图标
                iconUrl: require('../assets/image.png'),
                creationFunction: function() {
                    let tdt = new Cesium.WebMapTileServiceImageryProvider({
                        url: 'http://t' + GlobeUtil.random(0, 7) + '.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk={s}',
                        subdomains: subdomains,
                        layer: "tdtImg_w",
                        style: "default", //WMTS请求的样式名称
                        tileMatrixSetID: tileMatrixSetID,
                        maximumLevel: AppCfg.globe.maxLevel,
                        credit: new Cesium.Credit('天地图全球影像服务')
                    });

                    if (isShowLabel) {
                        //影像标注
                        viewer.imageryLayers.addImageryProvider(
                            new Cesium.WebMapTileServiceImageryProvider({
                                url: 'http://t' + GlobeUtil.random(0, 7) + '.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk={s}',
                                subdomains: subdomains,
                                layer: "tdtLabel_w",
                                style: "default", //WMTS请求的样式名称
                                tileMatrixSetID: tileMatrixSetID,
                                maximumLevel: AppCfg.globe.maxLevel,
                                credit: new Cesium.Credit('天地图全球标注服务')
                            }))
                    }

                    return tdt;
                }
            });
            //矢量底图切换
            let vector_tdt = new Cesium.ProviderViewModel({
                name: "天地图矢量",
                tooltip: "矢量底图",
                iconUrl: require('../assets/vector.png'),
                creationFunction: function() {
                    let tdt = new Cesium.WebMapTileServiceImageryProvider({
                        url: 'http://t' + GlobeUtil.random(0, 7) + '.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk={s}',
                        subdomains: subdomains,
                        layer: "tdtVec_w",
                        style: "default", //WMTS请求的样式名称
                        tileMatrixSetID: tileMatrixSetID,
                        maximumLevel: AppCfg.globe.maxLevel,
                        credit: new Cesium.Credit('天地图全球矢量服务')
                    });
                    if (isShowLabel) {
                        viewer.imageryLayers.addImageryProvider(
                            new Cesium.WebMapTileServiceImageryProvider({
                                url: 'http://t' + GlobeUtil.random(0, 7) + '.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk={s}',
                                subdomains: subdomains,
                                layer: "tdtLabel_w",
                                style: "default", //WMTS请求的样式名称
                                tileMatrixSetID: tileMatrixSetID,
                                maximumLevel: AppCfg.globe.maxLevel,
                                credit: new Cesium.Credit('天地图全球标注服务')
                            }))
                    }
                    return tdt;
                }
            });

            //地形底图切换
            let terrain_tdt = new Cesium.ProviderViewModel({
                name: "天地图地形",
                tooltip: "地形底图",
                iconUrl: require('../assets/terrain.png'),
                creationFunction: function() {
                    let tdt = new Cesium.WebMapTileServiceImageryProvider({
                        url: 'http://t' + GlobeUtil.random(0, 7) + '.tianditu.gov.cn/ter_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=ter&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk={s}',
                        subdomains: subdomains,
                        layer: "tdtTer_w",
                        style: "default", //WMTS请求的样式名称
                        tileMatrixSetID: tileMatrixSetID,
                        maximumLevel: AppCfg.globe.maxLevel,
                        credit: new Cesium.Credit('天地图全球地形服务')
                    });

                    if (isShowLabel) {
                        viewer.imageryLayers.addImageryProvider(
                            new Cesium.WebMapTileServiceImageryProvider({
                                url: 'http://t' + GlobeUtil.random(0, 7) + '.tianditu.gov.cn/cta_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cta&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk={s}',
                                subdomains: subdomains,
                                layer: "tdtLabel_w",
                                style: "default", //WMTS请求的样式名称
                                tileMatrixSetID: tileMatrixSetID,
                                maximumLevel: AppCfg.globe.maxLevel,
                                credit: new Cesium.Credit('天地图全球标注服务')
                            }))
                    }

                    return tdt;
                }
            });

            //更改地图切换的标题
            document.querySelector('.cesium-baseLayerPicker-sectionTitle').innerText = "场景底图";

            //隐藏cesium工具栏
            if (isShowTools) {
                document.querySelector('.cesium-viewer-toolbar').style.display = 'none';
            }

            //设置默认地图源-天地图影像底图
            viewer.baseLayerPicker.viewModel.imageryProviderViewModels = [image_tdt, vector_tdt, terrain_tdt];
            viewer.baseLayerPicker.viewModel.selectedImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[0];
        }
    },
    //添加天地图的国境边界
    addgjserver(viewer) {
        let subdomains = AppCfg.tdtTokenPool;
        let num = Math.floor(Math.random() * subdomains.length)
        let token = subdomains[num]
            // 叠加国界服务
        var iboMap = new Cesium.UrlTemplateImageryProvider({
            url: 'http://t' + GlobeUtil.random(0, 7) + '.tianditu.gov.cn/' + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
            subdomains: subdomains,
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            maximumLevel: 10
        });
        viewer.imageryLayers.addImageryProvider(iboMap);
    },
    /**
     * 添加导航
     * @param x  经度
     * @param y  纬度
     * @param z  高度
     * */
    addGlobeNav(x, y, z) {
        let options = {};
        //重置地图视图位置
        options.defaultResetView = Cesium.Cartographic.fromDegrees(x, y, z);
        //罗盘控件
        options.enableCompass = true;
        //缩放控件
        options.enableZoomControls = false;
        //距离尺控件
        options.enableDistanceLegend = true;
        //指南针控件
        options.enableCompassOuterRing = true;
        CesiumNavigation(this._globeInstance, options);
    },
    rotate: function(viewer, time) {
        viewer.clock.multiplier = 300; //速度
        viewer.clock.shouldAnimate = true;
        var previousTime = viewer.clock.currentTime.secondsOfDay;
        const onTickCallback = () => {
                var spinRate = 1;
                var currentTime = viewer.clock.currentTime.secondsOfDay;
                var delta = (currentTime - previousTime) / 1000;
                previousTime = currentTime;
                viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * delta);
            }
            // 开启地图自转效果
        viewer.clock.onTick.addEventListener(onTickCallback);

        //监听点击事件，当点击地图时停止旋转
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(click => {
            viewer.clock.onTick.removeEventListener(onTickCallback);

            //查看当前视角的 x,y,z,heading,pitch,roll值
            var e = click;
            var position = viewer.scene.pickPosition(e.position);
            //将笛卡尔坐标转化为经纬度坐标
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var x = Cesium.Math.toDegrees(cartographic.longitude);
            var y = Cesium.Math.toDegrees(cartographic.latitude);
            var z = cartographic.height;
            var h = viewer.scene.camera.heading;
            var p = viewer.scene.camera.pitch;
            var r = viewer.scene.camera.roll;
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // time = 1;
        setTimeout(() => {
            viewer.clock.onTick.removeEventListener(onTickCallback);
            //地球
            var option = new Object();
            option.x = 108.837303; //108.837303,34.340961
            option.y = 34.340961;
            option.z = 6000000; //  武汉高度 3500000  全国高度 6000000
            option.h = 0.010152402293521767;
            option.p = -1.5705337480193866;
            option.r = 0.00003681052934645379;
            //   this.cesiumFly(option);
            viewer.clock.multiplier = 0; //速度
        }, time); // time/1000 = xxx 秒;
    },
    /**
     *地球自转
     *@param viewer 视图对象
     * @param multiplier 倍数(毫秒数)
     */
    earthRotate(viewer, multiplier) {
        //旋转
        viewer.clock.multiplier = multiplier; //速度
        function onTickCallback() {
            if (!viewer || viewer.scene.mode !== Cesium.SceneMode.SCENE3D) {
                return;
            }
            const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(
                viewer.clock.currentTime
            );
            if (Cesium.defined(icrfToFixed)) {
                const camera = viewer.camera;
                const offset = Cesium.Cartesian3.clone(camera.position);
                const transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
                camera.lookAtTransform(transform, offset);
            }
        }
        viewer.scene.postUpdate.addEventListener(onTickCallback);

        //监听点击事件停止地球转动
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        return onTickCallback
            // handler.setInputAction(function () {
            //     viewer.clock.multiplier=1
            //     viewer.scene.postUpdate.removeEventListener(onTickCallback);
            // }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    },
    /**
     * 默认显示三维场景渲染性能参数，其中fps（屏幕每秒刷新次数，一般越高越好），ms（发出指令响应时间，一般越低越好）
     * @param viewer
     * @param isShow
     */
    showFramesPerSecond: function(viewer, isShow) {
        let scene = viewer.scene;
        scene.debugShowFramesPerSecond = isShow;
    },
    /**
     * 绘制走航监测数据性能版，垂直剖面效果
     * @param viewer
     * @param dsName
     * @param datas
     */
    drawDatas4Profile: function(viewer, datas, colors, max, min, isdeleted) {
        if (viewer) {
            let geomInstances = [];

            if (isdeleted) {
                geomInstances = GlobeUtil.lastdata
                GlobeUtil.lastdata = []
            } else {
                geomInstances = []
                GlobeUtil.lastdata = []
            }
            let scene = viewer.scene;
            if (datas != null && datas.length > 0) {
                //遍历绘制要素
                datas.forEach((data) => {
                    let parentdata = null
                    if (data) {
                        let coords = data['coords'];
                        //定位绘制的点位
                        //GlobeUtil.cameraFlyTo(117.30, 31.25, 80000, 0, -45);
                        //根据value获取对应的颜色值
                        let value = data['props']['v'];
                        if (value < min) {
                            value = min;
                        }
                        let quotient = (value - min) / (max - min);
                        let color = colors(quotient);
                        //let color = Cesium.Color.fromHsl(0.1 - barData[i].value * 0.1 / 1500, 1.0, 1 - barData[i].value / 1500);
                        let polygonHierarchy = new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(coords));
                        let geometry = new Cesium.PolygonGeometry({
                            polygonHierarchy: polygonHierarchy,
                            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                            perPositionHeight: true
                        });

                        //创建几何实例
                        const geomInstance = new Cesium.GeometryInstance({
                            geometry: geometry,
                            attributes: {
                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color).withAlpha(0.8))
                            },
                            id: GlobeUtil.genID() //特定规则的id属性可用于查找
                        });
                        geomInstance.attr = data;
                        geomInstance.parametdata = datas
                        geomInstances.push(geomInstance);
                    }
                })
                if (isdeleted) {
                    GlobeUtil.lastdata = geomInstances
                }
                if (geomInstances.length > 0) {
                    const primitive = new Cesium.Primitive({
                        allowPicking: true, //是否允许点选, true可以点选，需要额外的GPU资源，false可以节省GPU资源
                        appearance: new Cesium.PerInstanceColorAppearance({
                            flat: true,
                            translucent: false //是否支持透明
                        }),
                        releaseGeometryInstances: false, //true-释放geometry实例集合,false-不释放geometry实例集合
                        asynchronous: false,
                        geometryInstances: geomInstances
                            /*,
                                                    asynchronous: true*/ //是否异步创建
                    })
                    primitive.name = 'zhutu'
                    return scene.primitives.add(primitive);
                }
            }
        }
        return null;
    },

    /**
     * 绘制3D柱状图
     * @param viewer
     * @param datas
     * @param max
     * @param min
     */
    drawDatas4Columnar: function(viewer, data, colors, max, min) {
        if (viewer) {
            let geomInstances = [];
            let scene = viewer.scene;

            if (data) {
                //根据value获取对应的颜色值
                let value = data['props']['v'];
                if (value < min) {
                    value = min;
                }
                let quotient = (value - min) / (max - min);

                let color = colors(quotient);
                let coords = data['coords'];
                const geomInstance = new Cesium.GeometryInstance({
                    geometry: new Cesium.EllipseGeometry({
                        center: Cesium.Cartesian3.fromDegrees(coords[0], coords[1]),
                        vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
                        semiMinorAxis: 100.0,
                        semiMajorAxis: 100.0,
                        extrudedHeight: (5000.0 * quotient) < 1000 ? 1000 : (5000.0 * quotient), //高度最小值为1000
                        outline: false
                    }),
                    attributes: {
                        color: new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color).withAlpha(0.8))
                    }
                });

                geomInstances.push(geomInstance);
            }

            if (geomInstances.length > 0) {
                const primitive = new Cesium.Primitive({
                    allowPicking: false, //是否允许点选
                    appearance: new Cesium.PerInstanceColorAppearance({
                        flat: true,
                        translucent: true //是否支持透明
                    }),
                    geometryInstances: geomInstances
                })
                return scene.primitives.add(primitive);
            }
        }
        return null;
    },
    drawDatas4BatchColumnarone: function(viewer, data, colors, max, min, pieData) {
        let scene = viewer.scene;
        let chartPieData = null;
        let geomInstances = [];
        //根据value获取对应的颜色值
        let value = data['props']['v'];
        if (value < min) {
            value = min;
        }
        let quotient = (value - min) / (max - min);
        let color = colors(quotient);
        let coords = data['coords'];
        const geomInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.EllipseGeometry({
                center: Cesium.Cartesian3.fromDegrees(coords[0], coords[1]),
                vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
                semiMinorAxis: 30.0,
                semiMajorAxis: 30.0,
                extrudedHeight: value == '0' ? 0 : (3000.0 * quotient),
                outline: false
            }),
            attributes: {
                color: new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color).withAlpha(0.5)),
                show: new Cesium.ShowGeometryInstanceAttribute(true),
            },

            id: GlobeUtil.genID(), //特定规则的id属性可用于查找
        });
        geomInstance.attr = { data: data, pieData: pieData };
        geomInstances.push(geomInstance);
        if (geomInstances.length > 0) {
            const primitive = new Cesium.Primitive({
                allowPicking: true, //是否允许点选
                appearance: new Cesium.PerInstanceColorAppearance({
                    flat: true,
                    translucent: true //是否支持透明
                }),
                releaseGeometryInstances: false,
                geometryInstances: geomInstances,
            })
            primitive.name = 'zhutu'
            return scene.primitives.add(primitive);
        }
    },
    mapcloors(colorjsondata, value) {
        let color = null
            // let valu = Number(value)
        let valu = value
        for (var i = 0; i < colorjsondata.length; i++) {
            if (valu >= colorjsondata[i].title && valu <= colorjsondata[i + 1].title) {
                color = colorjsondata[i + 1].vallue
                return color
            } else if (valu < colorjsondata[i].title) {
                color = colorjsondata[i + 1].vallue
                return color
            } else if (valu > colorjsondata[colorjsondata.length - 1].title) {
                color = colorjsondata[colorjsondata.length - 1].vallue
                return color
            } else {
                color = colorjsondata[colorjsondata.length - 1].vallue
                return color
            }

        }

    },
    drawDatas4BatchColumnar: function(viewer, datas, colors, max, min, pieData, isdeleted, isshowm, index) {
        if (viewer) {
            let geomInstances = [];

            if (isdeleted) {
                geomInstances = GlobeUtil.lastdata
                GlobeUtil.lastdata = []
            } else {
                geomInstances = []
                GlobeUtil.lastdata = []
            }


            let scene = viewer.scene;

            if (datas != null && datas.length > 0) {
                //遍历绘制要素
                datas.forEach((data, i) => {
                    if (data) {
                        let chartPieData = null;
                        if (pieData && pieData.length > 1) {
                            chartPieData = pieData[i];
                        }
                        //根据value获取对应的颜色值
                        let value = data['props']['v'];
                        if (value < min) {
                            value = min;
                        }
                        let quotient = (value - min) / (max - min);

                        let color = colors(quotient);
                        let coords = data['coords'];
                        const geomInstance = new Cesium.GeometryInstance({
                            geometry: new Cesium.EllipseGeometry({
                                center: Cesium.Cartesian3.fromDegrees(coords[0], coords[1]),
                                vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
                                semiMinorAxis: 30.0,
                                semiMajorAxis: 30.0,
                                extrudedHeight: value == '0' ? 0 : (3000.0 * quotient),
                                outline: false
                            }),
                            attributes: {
                                color: new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color).withAlpha(0.9)),
                                show: new Cesium.ShowGeometryInstanceAttribute(true),
                            },

                            id: GlobeUtil.genID(), //特定规则的id属性可用于查找
                        });
                        geomInstance.attr = { data: data, pieData: chartPieData };
                        geomInstances.push(geomInstance);

                    }
                });
                if (isdeleted) {
                    GlobeUtil.lastdata = geomInstances
                }

                if (geomInstances.length > 0) {
                    const primitive = new Cesium.Primitive({
                        allowPicking: true, //是否允许点选
                        appearance: new Cesium.PerInstanceColorAppearance({
                            flat: true,
                            translucent: true //是否支持透明
                        }),
                        releaseGeometryInstances: false,
                        geometryInstances: geomInstances,
                        show: isshowm,
                        asynchronous: false,
                    })
                    primitive.name = 'zhutu'
                    return scene.primitives.add(primitive);
                }
            }
        }
        return null;
    },


    drawBatchColumnar: function(viewer, datas, colors, max, min) {
        if (viewer) {
            let geomInstances = [];
            let scene = viewer.scene;

            if (datas != null && datas.length > 0) {
                //遍历绘制要素
                datas.forEach((data) => {

                    if (data) {
                        //根据value获取对应的颜色值
                        let value = data['properties']['pm25'];
                        if (value < min) {
                            value = min;
                        }
                        let quotient = (value - min) / (max - min);

                        let color = colors(quotient);
                        let coords = data['properties'];
                        const geomInstance = new Cesium.GeometryInstance({
                            geometry: new Cesium.EllipseGeometry({
                                center: Cesium.Cartesian3.fromDegrees(coords.JD, coords.WD),
                                vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
                                semiMinorAxis: 200.0,
                                semiMajorAxis: 200.0,
                                extrudedHeight: 5000.0 * quotient,
                                outline: false
                            }),
                            attributes: {
                                color: new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color).withAlpha(0.8))
                            },
                            id: GlobeUtil.genID(), //特定规则的id属性可用于查找
                        });
                        geomInstance.attr = data;
                        geomInstances.push(geomInstance);
                    }
                });

                if (geomInstances.length > 0) {
                    const primitive = new Cesium.Primitive({
                        allowPicking: true, //是否允许点选
                        appearance: new Cesium.PerInstanceColorAppearance({
                            flat: true,
                            translucent: true //是否支持透明
                        }),
                        releaseGeometryInstances: false,
                        geometryInstances: geomInstances
                    })
                    return scene.primitives.add(primitive);
                }
            }
        }
        return null;
    },
    /**
     * 按照数据类型ID记录Primitive实例数组，暂不考虑单个Primitive实例按Key记录
     * @param dataType
     * @param primitive
     */
    recordPrimitive(dataType, primitive, viewer) {
        //说明：此处的hash值为Primitive实例数组
        let scene = viewer.scene;
        if (Vue.prototype.$hashmap && primitive) {
            if (Vue.prototype.$hashmap.has(dataType)) {
                let primitives = Vue.prototype.$hashmap.get(dataType);

                if (primitives && primitives.length > 0) {
                    primitives.forEach((item, i) => {
                        scene.primitives.remove(item);
                    })
                }
                Vue.prototype.$hashmap.remove(dataType);
                if (Vue.prototype.$hashmap.has(dataType)) {
                    Vue.prototype.$hashmap.get(dataType).push(primitive)
                } else {
                    Vue.prototype.$hashmap.set(dataType, [primitive]);
                }
                // ;
            } else {
                Vue.prototype.$hashmap.set(dataType, [primitive]);
            }
        }
    },
    /**
     * 按照数据类型ID记录Primitive实例数组，暂不考虑单个Primitive实例按Key记录
     * @param dataType
     * @param primitive
     */
    recordPrimitiveing(dataType, primitive) {
        //说明：此处的hash值为Primitive实例数组
        if (Vue.prototype.$hashmap && primitive) {
            if (Vue.prototype.$hashmap.has(dataType)) {
                Vue.prototype.$hashmap.get(dataType).push(primitive);
            } else {
                Vue.prototype.$hashmap.set(dataType, [primitive]);
            }
        }
    },
    /**
     * 按照数据类型ID整体删除Primitive实例数组
     * @param viewer
     * @param dataType
     */
    removePrimitive(viewer, dataType) {
        if (viewer) {
            let scene = viewer.scene;
            //说明：此处的hash值为Primitive实例数组
            if (Vue.prototype.$hashmap && Vue.prototype.$hashmap.has(dataType)) {
                let primitives = Vue.prototype.$hashmap.get(dataType);
                if (primitives && primitives.length > 0) {
                    primitives.forEach((primitive) => {
                        scene.primitives.remove(primitive);
                    });
                    //删除完成则清空对应的hash值
                    Vue.prototype.$hashmap.remove(dataType);
                    return true;
                }
            }
        }
        return false;
    },
    /**
     * 根据数据类型ID整体控制Primitive实例数组显示或隐藏
     * @param dataType
     * @param isShow 显示true，隐藏false
     */
    showPrimitive(dataType, isShow) {
        if (Vue.prototype.$hashmap && Vue.prototype.$hashmap.has(dataType)) {
            let primitives = Vue.prototype.$hashmap.get(dataType);
            if (primitives && primitives.length > 0) {
                primitives.forEach((primitive) => {
                    primitive.show = isShow;
                });
            }
        }
    },
    /**
     * 绘制走航监测数据(Entity版)，仅供参考，不作为实际应用
     * @param viewer
     * @param dsName
     * @param datas
     */
    drawDatas: function(viewer, dsName, datas) {
        if (viewer != null && dsName != "") {
            //查找并创建数据源
            let dataSources = viewer.dataSources.getByName(dsName),
                ds;
            if (dataSources && dataSources.length == 0) {
                ds = new Cesium.CustomDataSource(dsName);
                viewer.dataSources.add(ds);
            }

            //遍历datas并创建空间要素
            let colors = [
                Cesium.Color.RED.withAlpha(0.5),
                Cesium.Color.BLUE.withAlpha(0.5),
                Cesium.Color.GREEN.withAlpha(0.5),
                Cesium.Color.YELLOW.withAlpha(0.5),
                Cesium.Color.GRAY.withAlpha(0.5),
                Cesium.Color.ORANGE.withAlpha(0.5),
                Cesium.Color.PURPLE.withAlpha(0.5),
                Cesium.Color.RED.withAlpha(0.5),
                Cesium.Color.RED.withAlpha(0.5),
                Cesium.Color.RED.withAlpha(0.5)
            ]

            if (datas != null && datas.length > 0) {
                datas.forEach((data) => {
                    if (data) {
                        let level = data['props']['level'];
                        ds.entities.add({
                            polygon: {
                                hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(data['coords']),
                                material: colors[level - 1],
                                perPositionHeight: true,
                                outline: false,
                                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                            }
                        });
                    }
                })
                viewer.flyTo(ds);
            }


            //创建空间面要素DEMO
            /*let wyoming = viewer.entities.add({
                name: 'Wyoming',
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
                        -109.080842, 45.002073, 1000,
                        -105.91517, 45.002073, 3000,
                        -104.058488, 44.996596, 4000,
                        -104.053011, 43.002989, 100000,
                        -104.053011, 41.003906, 800000,
                        -105.728954, 40.998429, 400000,
                        -107.919731, 41.003906, 30000,
                        -109.04798, 40.998429, 20000,
                        -111.047063, 40.998429, 10000,
                        -111.047063, 42.000709, 1000,
                        -111.047063, 44.476286, 9000,
                        -111.05254, 45.002073, 100]),
                    material: Cesium.Color.RED.withAlpha(0.5),
                    perPositionHeight: true,
                    outline: true,
                    outlineColor: Cesium.Color.BLACK,
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                }
            });*/
        }
    },
    genID() {
        return Number(Math.random().toString().substr(3, 5) + Date.now()).toString(36);
    },
    flyToPoint(destination, heading = 0.0, pitch = -90, range = 0.0, duration = 3, fn) {
        let boundingSphere = new Cesium.BoundingSphere(destination, 0.0);
        this._globeInstance.camera.flyToBoundingSphere(boundingSphere, {
            duration: duration,
            maximumHeight: undefined,
            offset: {
                heading: Cesium.Math.toRadians(heading),
                pitch: Cesium.Math.toRadians(pitch),
                range: range
            },
            complete: function() {
                if (fn) {
                    fn();
                }
            }
        });
    },
    createModel: function(url, height, lon, lat, viewer, www) {
        //清除所有图层
        var position = Cesium.Cartesian3.fromDegrees(lon, lat, height);
        var heading = Cesium.Math.toRadians(0);
        var pitch = 0;
        var roll = 0;
        var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            hpr
        );
        var entity = viewer.entities.add({
            name: 'moudle',
            position: position,
            orientation: orientation,
            model: {
                uri: url,
                minimumPixelSize: 128,
                maximumScale: 128,
            },
        });
        // let e =entity.position.getValue(viewer.clock.currentTime);
        // let i =entity.orientation.getValue(viewer.clock.currentTime);
        // let t = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(i), e);
        //moveRoute.that.viewer.camera.lookAtTransform(t, new Cesium.Cartesian3(0, 90, 500));
        // let headings = Cesium.Math.toRadians(-180.0);//航向
        // let pitchs = Cesium.Math.toRadians(-25.0);//俯仰
        // let ranges = 1500.0;//范围
        // viewer.camera.lookAtTransform(t,new Cesium.HeadingPitchRange(headings, pitchs, ranges));
        // viewer.flyTo(entity)
        GlobeUtil.cameraFlyTo(lon, lat, 8000, 0, -95);
        // viewer.camera.setView({
        //     destination:Cesium.Cartesian3.fromDegrees(lon, lat,1000),
        //     orientation:{
        //       // 指向  镜头随小车变化角度
        //       heading : Cesium.Math.toRadians(0),
        //       // 视角固定
        //       pitch:Cesium.Math.toRadians(-15.0),
        //       roll:0.0
        //     }
        //   });

        // viewer.trackedEntity = entity;
        // viewer.flyTo(entity, {
        //     offset : {
        //         heading : Cesium.Math.toRadians(0),
        //         pitch : Cesium.Math.toRadians(90),
        //         range : 1000
        //     }
        // })



    },
    //加载json边界数据
    creatbj(viewer, features, outlineWidth, color, ispro) {
        Cesium.Math.setRandomNumberSeed(0);
        var promise = Cesium.GeoJsonDataSource.load(features, {});
        promise.then(function(dataSource) {
            dataSource.name = "bround"
            viewer.dataSources.add(dataSource);
            var entities = dataSource.entities.values;
            entities._name = "bround"
            for (var i = 0; i < entities.length; i++) {

                var entity = entities[i];
                entity.name = 'bround'
                entity.polygon.outlineWidth = outlineWidth ? outlineWidth : 2; //边框宽
                entity.polygon.fill = false; //是否显示填充部分
                entity.polygon.material = Cesium.Color.fromCssColorString(color); //填充色
                entity.polygon.outline = true; //是否显示边框
                // entity.polygon.outlineColor = Cesium.Color.RED;
                entity.polyline = {
                    positions: entity.polygon.hierarchy._value.positions,
                    width: outlineWidth,
                    material: Cesium.Color.fromCssColorString(color)
                }
            }
        });
        if (ispro) {
            viewer.flyTo(promise);
        }

    },
    // 加载高值区的方法
    creatrdwg(viewer, features, type, radio, range) {
        var promise = Cesium.GeoJsonDataSource.load(features);
        promise.then(function(dataSource) {
            dataSource.name = "jsondata"
            viewer.dataSources.add(dataSource);
            var entities = dataSource.entities.values;
            entities._name = 'jsondata'
            for (var i = 0; i < entities.length; i++) {
                let height
                let num
                var entity = entities[i];
                if (type == true) {
                    if (radio == 'PM2.5') {
                        let properties = entities[i].properties
                        num = Number(properties._pm25._value)
                        height = (num - 0) * 1000
                    } else {
                        height = 100
                    }
                } else {
                    height = 0
                }
                entity.name = 'jsondata'
                entity.polygon.outlineWidth = 2; //边框宽
                entity.polygon.fill = true; //是否显示填充部分
                entity.polygon.material = Cesium.Color.fromCssColorString('rgb(239,0,0)').withAlpha(0.3); //填充色
                entity.polygon.outline = true; //是否显示边框
                entity.polygon.extrudedHeight = height
                entity.polyline = {
                    positions: entity.polygon.hierarchy._value.positions,
                    width: entity.polygon.outlineWidth,
                    material: Cesium.Color.fromCssColorString('rgb(239,0,0)').withAlpha(0.3), //填充色,
                    extrudedHeight: height
                }
            }
        });
        viewer.flyTo(promise, {
            offset: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-30),
                range: range
            }
        })
        return true
    },

    creatpm(viewer, features, height, row) {

        var promise = Cesium.GeoJsonDataSource.load(features);
        promise.then(function(dataSource) {
            dataSource.name = "jsondata"
            var entities = dataSource.entities.values;
            for (var i = 0; i < entities.length; i++) {
                let properties = entities[i].properties
                    // let num = Number(properties.f0116pm25._value)
                var entity = entities[i];
                // var color = GlobeUtil.leaedleng(num,row)
                entity.polygon.outlineWidth = 2; //边框宽
                entity.polygon.fill = true; //是否显示填充部分
                entity.polygon.material = Cesium.Color.fromCssColorString('rgb(239,0,0)').withAlpha(0.4); //填充色
                entity.polygon.outline = false; //是否显示边框
                entity.polygon.extrudedHeight = height
                    // entity.polygon.extrudedHeight =(num-70)*2000;
                entity.polyline = {
                    positions: entity.polygon.hierarchy._value.positions,
                    width: entity.polygon.outlineWidth,
                    material: Cesium.Color.fromCssColorString('rgb(234,227,22)').withAlpha(0.8), //填充色,
                    extrudedHeight: height
                        // extrudedHeight:(num-70)*2000,
                }
            }
            viewer.dataSources.add(dataSource);
        });


        viewer.flyTo(promise, {
            offset: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-30),
                range: 1000
            }
        })
    },
    creat3dpm(viewer, features, row, range) {

        var promise = Cesium.GeoJsonDataSource.load(features);
        promise.then(function(dataSource) {
            dataSource.name = "jsondata"
            var entities = dataSource.entities.values;
            let num = 0
            let height = 0
            for (var i = 0; i < entities.length; i++) {
                let properties = entities[i].properties
                if (row.name == 'PM2.5') {
                    num = properties._pm25._value
                    height = (num - 0) * 100
                } else if (row.name == '扬尘源') {
                    num = properties.fgqk._value
                    height = num * 100
                }

                var entity = entities[i];
                var color = GlobeUtil.leaedleng(num, row)
                entity.polygon.outlineWidth = 2; //边框宽
                entity.polygon.fill = true; //是否显示填充部分
                entity.polygon.material = Cesium.Color.fromCssColorString(color).withAlpha(.8); //填充色
                entity.polygon.outline = true; //是否显示边框
                // entity.polygon.extrudedHeight = height
                entity.polygon.extrudedHeight = height;
                entity.polyline = {
                    positions: entity.polygon.hierarchy._value.positions,
                    width: entity.polygon.outlineWidth,
                    material: Cesium.Color.fromCssColorString('rgb(239,0,0)').withAlpha(.1), //填充色,
                    // extrudedHeight:height
                    extrudedHeight: height,
                }
            }
            viewer.dataSources.add(dataSource);

        });

        viewer.flyTo(promise, {
            offset: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-30),
                range: range
            }
        })

        // GlobeUtil.cameraFlyTo(AppCfg.globe.location.X, AppCfg.globe.location.Y, 100000, 0, -45)
        return true
    },
    leaedleng(num, row) {
        let numarr = []
        let colersarr = []

        if (row.colors && row.colors.length > 0) {
            for (var key = 0; key < row.colors.length; key++) {
                let arr = row.colors[key].split(",");
                colersarr.push(arr[1])
                if (arr[0].indexOf("~") != -1) {
                    let newar = arr[0].split("~")
                    for (var i = 0; i < newar.length; i++) {
                        numarr.push(Number(newar[i]))
                    }
                } else {
                    numarr.push(Number(newar[i]))
                }

            }
            numarr = GlobeUtil.unique(numarr)
            for (var j = 0; j < numarr.length; j++) {
                if (num >= numarr[j] && num <= numarr[j + 1]) {
                    return (colersarr[j])
                } else {

                }
            }
        } else {
            return 'rgb(239,0,0)'
        }
    },
    unique(arr) {
        // 如果新数组的当前元素的索引值 == 该元素在原始数组中的第一个索引，则返回当前元素
        return arr.filter(function(item, index) {
            return arr.indexOf(item, 0) === index;
        });
    },
    creatno(viewer, features) {
        Cesium.Math.setRandomNumberSeed(0);
        var promise = Cesium.GeoJsonDataSource.load(features);
        promise.then(function(dataSource) {
            dataSource.name = "jsondata"
            viewer.dataSources.add(dataSource);
            var entities = dataSource.entities.values;
            for (var i = 0; i < entities.length; i++) {
                let properties = entities[i].properties
                let num = Number(properties.no._value)
                if (num >= 258314980277000 && num <= 1226211998902000) {
                    var entity = entities[i];
                    entity.name = 'jsondata'
                    entity.polygon.outlineWidth = 2; //边框宽
                    entity.polygon.fill = true; //是否显示填充部分
                    entity.polygon.material = Cesium.Color.fromCssColorString("rgba(45,250,3,.8)"); //填充色
                    entity.polygon.outline = true; //是否显示边框
                    entity.polyline = {
                        positions: entity.polygon.hierarchy._value.positions,
                        width: entity.polygon.outlineWidth,
                        material: Cesium.Color.fromCssColorString("rgba(45,250,3,.5)")

                    }
                } else if (num >= 1226211998902000 && num <= 1691325163146000) {
                    var entity = entities[i];
                    entity.name = 'jsondata'
                    entity.polygon.outlineWidth = 2; //边框宽
                    entity.polygon.fill = true; //是否显示填充部分
                    entity.polygon.material = Cesium.Color.fromCssColorString("rgba(97,229,42,.8)"); //填充色
                    entity.polygon.outline = true; //是否显示边框
                    entity.polyline = {
                        positions: entity.polygon.hierarchy._value.positions,
                        width: entity.polygon.outlineWidth,
                        material: Cesium.Color.fromCssColorString("rgba(97,229,42,.5)")
                    }
                } else if (num >= 1691325163146000 && num <= 1999732537494000) {
                    var entity = entities[i];
                    entity.name = 'jsondata'
                    entity.polygon.outlineWidth = 2; //边框宽
                    entity.polygon.fill = true; //是否显示填充部分
                    entity.polygon.material = Cesium.Color.fromCssColorString("rgba(255,255,0,.8)"); //填充色
                    entity.polygon.outline = true; //是否显示边框
                    entity.polyline = {
                        positions: entity.polygon.hierarchy._value.positions,
                        width: entity.polygon.outlineWidth,
                        material: Cesium.Color.fromCssColorString("rgba(255,255,0,.5)")
                    }
                } else if (num >= 1999732537494000 && num <= 2156569187084000) {
                    var entity = entities[i];
                    entity.name = 'jsondata'
                    entity.polygon.outlineWidth = 2; //边框宽
                    entity.polygon.fill = true; //是否显示填充部分
                    entity.polygon.material = Cesium.Color.fromCssColorString("rgba(243,139,0,.8)"); //填充色
                    entity.polygon.outline = true; //是否显示边框
                    entity.polyline = {
                        positions: entity.polygon.hierarchy._value.positions,
                        width: entity.polygon.outlineWidth,
                        material: Cesium.Color.fromCssColorString("rgba(243,139,0,.5)")
                    }
                } else if (num >= 2156569187084000 && num <= 2699587953340000) {
                    var entity = entities[i];
                    entity.name = 'jsondata'
                    entity.polygon.outlineWidth = 2; //边框宽
                    entity.polygon.fill = true; //是否显示填充部分
                    entity.polygon.material = Cesium.Color.fromCssColorString("rgba(239,0,0,.8)"); //填充色
                    entity.polygon.outline = true; //是否显示边框
                    entity.polyline = {
                        positions: entity.polygon.hierarchy._value.positions,
                        width: entity.polygon.outlineWidth,
                        material: Cesium.Color.fromCssColorString("rgba(239,0,0,.5)")
                    }
                } else {
                    var entity = entities[i];
                    entity.name = 'jsondata'
                    entity.polygon.outlineWidth = 0; //边框宽
                    entity.polygon.fill = false; //是否显示填充部分
                    entity.polygon.material = Cesium.Color.fromCssColorString("rgba(45,250,3,.8)"); //填充色
                    entity.polygon.outline = false; //是否显示边框
                    entity.polyline = {
                        positions: entity.polygon.hierarchy._value.positions,
                        width: entity.polygon.outlineWidth,
                        material: Cesium.Color.fromCssColorString("rgba(45,250,3,.5)")
                    }
                }
            }
        });
    },
    remouveAlllayer(viewer) {
        // viewer.imageryLayers.removeall();
    },
    //删除添加的json数据
    deleteLabel(viewer, name) {

        var len = viewer.dataSources.length

        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var dataSource = viewer.dataSources.get(i)
                if (dataSource !== undefined && dataSource.name != '' && dataSource.name == name) {
                    viewer.dataSources.remove(dataSource)
                }
            }
        }
    },
    //删除添加的所有json数据
    deleteLabelall(viewer) {
        var len = viewer.dataSources.length
        if (len > 0) {
            viewer.dataSources.removeAll();
        }
    },
    //加载图片
    addimg(viewer, url) {
        var rectangle = Cesium.Rectangle.fromDegrees(110.003002136454, 34.28001879856, 120.02000191249, 42.8900);
        let zoning = null
        zoning = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
            url: url,
            layers: 'pm',
            rectangle: rectangle,
            name: 'cesiumimgssd'
        }))
        zoning.name = 'pm'
        zoning.alpha = 0.1 //图层的透明度
        zoning.brightness = 5.0 //图层的亮度
            // var layers = viewer.imageryLayers;
            // viewer._cesiumWidget._creditContainer.style.display="none";
            // viewer.camera.setView({
            // 	destination: Cesium.Rectangle.fromDegrees(110.000002136454,33.980001879856,120.02000191249,43.0000016782433) //定位坐标点，建议使用谷歌地球坐标位置无偏差
            // });
    },
    deateimg(viewer) {
        viewer.imageryLayers._layers.forEach((item) => {
            if (item.name == 'pm') {
                viewer.imageryLayers.remove(item);
            }
        })

        // viewer.imageryLayers.removeall();
    },
    addmapserver(viewer) {
        viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url: "http://119.3.224.4:20002/pie-cloud/tiles/publish/grid/node/tif_e4a2a2f75be94966a8912d7681b67b9c/{z}/{x}/{y}?key=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbmZvIjoie1widXNlcklkXCI6XCIxNzhcIixcImtleVwiOlwiODIyMjRlN2M1NmQyNzE4ZGYwOGVhZGNhYmU5NzBmNTdcIn0ifQ.k5uFq1uHCdpkpNjQFwo4gWD5K0e1Te6YaSz6glQA8TQ",
        }))

    },

    addwmtsimg(viewer) {
        viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapServiceImageryProvider({
                url: "http://60.247.54.35:8888/usogcrs?layer=83A9E0C6-AF38-11EB-8221-2F6D384E1890&",
                layers: 'KVP', //图层名称
                parameters: {
                    format: "image/png", //瓦片的输出格式
                    // version: "1.3.0", //版本
                    request: "GetMap", //请求方式
                    transparent: true, //是否透明
                    // tokenk: token //此参数不为OGC标准中的参数，是自己定义的参数
                },
                srs: "EPSG:4326",
                id: 'addwmtsimg'
            })
        )
    },
    addpointicon(viewer, row, img) {
        var citizensBankPark = viewer.entities.add({
            name: row.name,
            code: row.index,
            curdata: row,

            position: Cesium.Cartesian3.fromDegrees(row.lng, row.lat),
            point: { //点
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2
            },

            billboard: { //图标
                image: img,
                width: 40,
                height: 40
            },
            label: { //文字标签
                text: row.name,
                font: '14pt monospace',
                style: Cesium.LabelStyle.FILL,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.TOP, //垂直方向以底部来计算标签的位置
                pixelOffset: new Cesium.Cartesian2(0, -26) //偏移量
            },
        });

        viewer.zoomTo(viewer.entities);
        /*
         * 鼠标点击事件
         */

    },
    icomleftclick(viewer) {
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(click) {
            var pick = viewer.scene.pick(click.position);
            //选中某模型   pick选中的对象
            if (Cesium.defined(pick)) {
                let cartesian2 = click.position
                let attr = pick.id._curdata; //获取属性信息
                let infoBox = document.getElementById('popup-info-box');
                let infoContent = document.getElementById('popup-content-box');
                let content = "";
                content += '<ul>';

                content += '<li><span>监测站名称</span><span>' + attr.name + '</span></li>' + '<li><span>时间</span><span>' + attr.time + '</span></li>' + '<li><span>站点类型</span><span>' + attr.type + '</span></li>';
                content += '<li><span>AQI</span><span>' + attr.AQI + '</span></li>' + '<li><span>PM2.5</span><span>' + attr.PM25 + '</span></li>' + '<li><span>PM10</span><span>' + attr.PM10 + '</span></li>';
                content += '<li><span>CO</span><span>' + attr.CO + '</span></li><li><span>SO2</span><span>' + attr.SO2 + '</span></li>' +
                    '<li><span>O3</span><span>' + attr.O3 + '</span></li>' + '<li><span>NO2</span><span>' + attr.NO2 + '</span></li>' +
                    '<li><span>经度</span><span>' + attr.lng + '</span></li>' + '<li><span>纬度</span><span>' + attr.lat + '</span></li>';


                content += '</ul>'
                infoContent.innerHTML = content;
                infoBox.style.display = 'block';
                let hi = infoBox.offsetHeight;
                if (cartesian2.y - hi > hi) {
                    infoBox.style.top = cartesian2.y + 'px'; //气泡框在鼠标上面
                } else {
                    infoBox.style.top = cartesian2.y + 'px'; //气泡框在鼠标下面
                }
                infoBox.style.left = cartesian2.x + 10 + 'px';

            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    },
    //(1)卫星轨道、波束绘制------------
    /**
     * 卫星轨道绘制
     * @param isShowBeam : 是否显示卫星波束
     */
    addOrbit: function(viewer, id, czml, isShowBeam) {
        viewer.dataSources.add(Cesium.CzmlDataSource.load(czml)).then(function(dataSource) {
            let clock = viewer.clock
            let satellite = dataSource.entities.getById(id)
            let property = new Cesium.SampledPositionProperty()
            let totalLength = 0
            let totalStep = 0
            let waveBeamLength = 0
            let pos = [];
            for (let ind = 0; ind < 292; ind++) {
                let time = Cesium.JulianDate.addSeconds(clock.startTime, 3 * ind, new Cesium.JulianDate());
                let position = satellite.position.getValue(time);
                if (position != null) {
                    let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position);
                    let lat = Cesium.Math.toDegrees(cartographic.latitude),
                        lng = Cesium.Math.toDegrees(cartographic.longitude),
                        hei = cartographic.height / 1;
                    property.addSample(time, Cesium.Cartesian3.fromDegrees(lng, lat, hei));
                    pos.push(lng);
                    pos.push(lat);

                    totalLength += hei;
                    totalStep += 1;
                }
            }
            //创建卫星波束相关参数
            if (totalLength > 0 && totalStep > 0) {
                waveBeamLength = totalLength / totalStep;
            } else {
                waveBeamLength = 600000;
            }

            let cylinderEntity = viewer.entities.add({
                cylinder: {
                    HeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    length: waveBeamLength,
                    topRadius: 0,
                    bottomRadius: waveBeamLength / 4,
                    material: Cesium.Color.RED.withAlpha(.4),
                    outline: !0,
                    numberOfVerticalLines: 0,
                    outlineColor: Cesium.Color.RED.withAlpha(.8)
                }
            });
            cylinderEntity.position = property;
            cylinderEntity.position.setInterpolationOptions({ //设定位置的插值算法
                interpolationDegree: 5,
                interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
            });
            cylinderEntity.show = isShowBeam;

            //临时存储到hashmap

            // GlobeUtil.addToHashMap(id, dataSource, satellite, cylinderEntity);
            GlobeUtil.addToHashMap(id, dataSource, satellite, cylinderEntity)
                //缩放到卫星轨迹全幅范围
                //方案一
                // viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(viewer.camera.direction.x, viewer.camera.direction.y, waveBeamLength * 8)});



            /*let orbitPolygon = new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(
                    Cesium.Cartesian3.fromDegreesArray(pos)
                )
            });
            let orbitGeometry = Cesium.PolygonGeometry.createGeometry(orbitPolygon);*/

            /* viewer.camera.flyToBoundingSphere(orbitGeometry.boundingSphere, {maximumHeight: waveBeamLength * 20});
             viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(orbitGeometry.boundingSphere.center.x, orbitGeometry.boundingSphere.center.y, waveBeamLength * 10)});*/

            //删除临时对象
            //delete orbitGeometry;
        });
    },
    /**
     * 删除卫星轨道
     * @param key
     */
    deleteOrbit: function(key, viewer) {

    },
    /*
     * 场景重置
     * */
    clear: function(viewer) {
        //删除完成则清空对应的hash值
        let data = Vue.prototype.$hashmap._data
        var arr = Object.keys(data);
        let len = arr.length

        if (arr.length != 0) {
            for (var i = 0; i < len; i++) {
                let orbitInfo = data[arr[i]][1][0]
                let ds = orbitInfo['datasource'],
                    sate = orbitInfo['satellite'],
                    waveBeam = orbitInfo['wavebeam'];
                if (ds && sate && waveBeam) {
                    //删除卫星
                    ds.entities.remove(sate);
                    //删除波束
                    viewer.entities.remove(waveBeam);
                    //删除数据源
                    viewer.dataSources.remove(ds, true);
                }
                Vue.prototype.$hashmap.remove(data[arr[i]])
                Vue.prototype.$hashmap._data = new Object
            }

        }
        Vue.prototype.$hashmap.remove();

    },
    /**
     * 显示或隐藏波束
     */
    showWaveBeam: function(isShow) {
        if (globeUtil.czml.hashMap) {
            globeUtil.czml.hashMap.each(function(key, orbitInfo, length) {
                if (orbitInfo != null) {
                    let waveBeam = orbitInfo['wavebeam'];
                    if (waveBeam != null) {
                        waveBeam.show = isShow;
                    }
                }
            });
        }
    },
    addToHashMap(key, ds, sate, waveBeam) {
        let sateInfo = {
            'datasource': ds,
            'satellite': sate,
            'wavebeam': waveBeam
        };
        if (Vue.prototype.$hashmap) {
            if (Vue.prototype.$hashmap.has(key)) {
                Vue.prototype.$hashmap.get(dataType).push(sateInfo);
            } else {
                Vue.prototype.$hashmap.set(key, [sateInfo]);
            }
        }

    },
    removeFromHashMap: function(key) {
        Vue.prototype.$hashmap.removeAtKey(key);
    },
    get: function(key) {
        Vue.prototype.$hashmap.has(dataType);
    },
    addwei(viewer, url) {
        viewer.dataSources.add(
            Cesium.CzmlDataSource.load(url)
        );
        let waveBeamLength = 3000000;
        let center = Cesium.Cartesian3.fromDegrees(AppCfg.globe.location.X, AppCfg.globe.location.Y, 0);
        viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(AppCfg.globe.location.X, AppCfg.globe.location.Y, waveBeamLength * 8) })
            //    viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(viewer.camera.direction.x, viewer.camera.direction.y, waveBeamLength * 8)});
    }


};
export default GlobeUtil;