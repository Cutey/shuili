import { Map, View, Feature } from "ol";
import { Tile, Image, Vector as vectorLayer } from "ol/layer";
import { XYZ, ImageWMS, Vector as vectorSource, ImageStatic as Static } from 'ol/source';
import { transform, getTransform, transformExtent, Projection } from "ol/proj";
import { Point, LineString, Polygon } from "ol/geom";
import { Fill, Stroke, Circle, Style } from 'ol/style';
import { defaults, Rotate, ScaleLine, Zoom } from 'ol/control';
import GeoJSON from "ol/format/GeoJSON";
import AppCfg from '../config/AppCfg'

const mapUtil = {
    _mapInstance: null, //地图实例
    _mapContainer: null, //地图容器
    _zoom: 9, //地图级别
    _minZoom: 5, //地图最小级别
    _maxZoom: 17, //地图最大级别
    _center: [114.140605, 38.252775], //地图初始中心位置
    tdtToken: '2f3eb03445a8c299976d55341be55f96', //天地图访问地址token
    isNet: false, //公司内外网天地图访问标识
    scaleLineControl:null,//比例尺实例

    //获取地图实例
    getMapInstance() {
        return mapUtil._mapInstance;
    },
    //获取地图容器
    getMapContainer() {
        return mapUtil._mapContainer;
    },

    /**
     * 初始化地图
     * @param mapDiv 地图容器id
     */
    initMap(mapDiv) {
        mapUtil._mapContainer = document.getElementById(mapDiv);
        let center = transform(mapUtil._center, "EPSG:4326", "EPSG:3857");
        mapUtil._mapInstance = new Map({
            target: mapDiv,
            logo: false,
            controls: defaults({
                attribute: false,
                zoom: false,
                rotate: false
            }),
            loadTilesWhileAnimating: true,
            pixelRatio: 1,
            //地图设置
            view: new View({
                center: center,
                minZoom: mapUtil._minZoom,
                maxZoom: mapUtil._maxZoom,
                zoom: mapUtil._zoom,
                // projection: 'EPSG:4326',
            })
        });
        return mapUtil._mapInstance;
    },
    //地图复位
    restoreView() {
        let center = transform(mapUtil._center, "EPSG:4326", "EPSG:3857");
        mapUtil._mapInstance.getView().animate({
            center: center,
            minZoom: mapUtil._minZoom,
            maxZoom: mapUtil._maxZoom,
            zoom: mapUtil._zoom,
            duration: 1000
        });
    },
    setcenter() {
        let center = transform([114.440605,39.932775], "EPSG:4326", "EPSG:3857");
        mapUtil._mapInstance.getView().animate({
            center: center,
            duration: 1000,
            minZoom: mapUtil._minZoom,
            maxZoom: mapUtil._maxZoom,
            zoom: 7,
        });
    },
    PmrestoreView(zoom) {
        let center = transform(mapUtil._center, "EPSG:4326", "EPSG:3857");
        mapUtil._mapInstance.getView().animate({
            center: center,
            minZoom: mapUtil._minZoom,
            maxZoom: mapUtil._maxZoom,
            zoom: zoom,
            duration: 1000
        });
    },
    /**
     * 设置地图容器高度
     * @param v 需要减去的导航高度
     */
    setMapHeight(v) {
        if (mapUtil._mapInstance && mapUtil._mapContainer) {
            mapUtil._mapContainer.style.height = window.innerHeight - v + 'px';
            mapUtil._mapInstance.updateSize();
        }
    },
    /**
     * 公司内外网天地图访问策略
     * @param isNet 值为false表示采用公司网络访问天地图服务，true表示其他网络访问天地图服务
     * @returns {string}
     */
    getTdtServerUrl(isNet) {
        if (isNet) {
            return 'http://t' + Math.round(Math.random() * 7) + '.tianditu.gov.cn/DataServer'
        } else {
            return 'http://114.116.231.97:6060/proxy/DataServer' + Math.round(Math.random() * 7)
        }
    },
           //要么单纯使用代理，要么淡出使用天地图，40个token切换
           getMapUrls(layerType, isMain, isProxy) {
            let urls4Map = [], urls4Label = [],guojiemapser = []
            let tkLen = AppCfg.tdtTokenPool.length;
            let rootUrl4gw, rootUrl4hwy;
            for (let i = 0; i < 7; i++) {
                if (isMain) {
                    rootUrl4gw = 'http://t' + i + '.tianditu.gov.cn/DataServer';
                }
                if (isProxy) {
                    rootUrl4hwy = 'http://114.116.231.97:6060/proxy/DataServer' + i;
                }
                for (let j = 0; j < tkLen; j++) {
                    let tdtToken = AppCfg.tdtTokenPool[j]

                    if (layerType == 'vec') {
                        //天地图官网
                        if (isMain) {
                            urls4Map.push(rootUrl4gw + '?T=vec_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            urls4Label.push(rootUrl4gw + '?T=cva_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            guojiemapser.push(rootUrl4gw + '?T=ibo_w&x={x}&y={y}&l={z}&tk=' + tdtToken)
                        }

                        //华为云代理
                        if (isProxy) {
                            urls4Map.push(rootUrl4hwy + '?T=vec_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            urls4Label.push(rootUrl4hwy + '?T=cva_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            guojiemapser.push(rootUrl4hwy + '?T=ibo_w&x={x}&y={y}&l={z}&tk=' + tdtToken)
                        }
                    } else if (layerType == 'img') {
                        //天地图官网
                        if (isMain) {
                            urls4Map.push(rootUrl4gw + '?T=img_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            urls4Label.push(rootUrl4gw + '?T=cia_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            guojiemapser.push(rootUrl4gw + '?T=ibo_w&x={x}&y={y}&l={z}&tk=' + tdtToken)
                        }

                        //华为云代理
                        if (isProxy) {
                            urls4Map.push(rootUrl4hwy + '?T=img_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            urls4Label.push(rootUrl4hwy + '?T=cia_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            guojiemapser.push(rootUrl4hwy + '?T=ibo_w&x={x}&y={y}&l={z}&tk=' + tdtToken)
                        }
                    } else {
                        //layerType = 'ter'
                        //天地图官网
                        if (isMain) {
                            urls4Map.push(rootUrl4gw + '?T=ter_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            urls4Label.push(rootUrl4gw + '?T=cta_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            guojiemapser.push(rootUrl4gw + '?T=ibo_w&x={x}&y={y}&l={z}&tk=' + tdtToken)
                        }

                        //华为云代理
                        if (isProxy) {
                            urls4Map.push(rootUrl4hwy + '?T=ter_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            urls4Label.push(rootUrl4hwy + '?T=cta_w&x={x}&y={y}&l={z}&tk=' + tdtToken);
                            guojiemapser.push(rootUrl4hwy + '?T=ibo_w&x={x}&y={y}&l={z}&tk=' + tdtToken)
                        }
                    }

                }
            }

            return {
                'urls4Map': urls4Map,
                'urls4Label': urls4Label,
                'guojiemapser' : guojiemapser
            };
        },
    /**
     * 地图底图切换
     * @param layerType 图层类型：vec、img、ter
     */
     switchLayer(layerType) {
        let baseLyr, baseLyrLabel, urls = mapUtil.getMapUrls(layerType, true, false);
        baseLyr = new Tile({
            zIndex: 0,
            source: new XYZ({
                urls: urls.urls4Map
            }),
            isGroup: true,
            name: layerType + '-layer'
        });
        baseLyrLabel = new Tile({
            zIndex: 1,
            source: new XYZ({
                urls: urls.urls4Label
            }),
            isGroup: true,
            name: layerType + '-label-layer'
        });
         let guojie = new Tile({
            zIndex: 1,
            source: new XYZ({
                urls: urls.guojiemapser
            }),
            isGroup: true,
            name: 'ter-label-layer'
        });


        let mls = mapUtil._mapInstance.getLayers();

        if (mls) {
            mls.setAt(0, baseLyr);
            mls.setAt(1, baseLyrLabel);
            mls.setAt(2, guojie);
        }
    },

    /**
     * wms服务加载
     * @param url              @type(String) 服务地址
     * @param serverLayerName  @type(String) 服务图层名称
     * @param createLayerName  @type(String) 创建图层名称
     * @param layerLevel       @type(Number) 图层层级
     * */
    wmsLayer(url, serverLayerName, createLayerName, layerLevel) {
        let wmsLayer = new Image({
            zIndex: layerLevel,
            source: new ImageWMS({
                ratio: 1,
                url: url,
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    "LAYERS": serverLayerName,
                    "exceptions": 'application/vnd.ogc.se_inimage',
                    "projection": 'EPSG:3857'
                }
            })
        });
        wmsLayer.name = createLayerName;
        mapUtil._mapInstance.addLayer(wmsLayer);
        return wmsLayer;
    },

    /**
     *创建要素
     * @param geometryType  @type(String) (point,line,polygon)根据类型创建点线面
     * @param name          @type(String) 要素名称
     * @param coordinate    @type(Array)  坐标数组
     * @param attributes    @type(Object)  属性信息
     */
    createFeature(geometryType, name, coordinate, attributes) {
        let gmType = null;
        if (geometryType) {
            if ('point' == geometryType) {
                gmType = new Point(coordinate);
            } else if ('line' == geometryType) {
                gmType = new LineString(coordinate);
            } else if ('polygon' == geometryType) {
                gmType = new Polygon(coordinate);
            }
            gmType.applyTransform(getTransform('EPSG:4326', 'EPSG:3857'));
            let feature = new Feature(gmType);
            feature.name = name;
            if (attributes) {
                feature.attributes = attributes;
            }
            return feature;
        }
    },

    createhoutFeature(geometryType, name, coordinate, attributes) {
        let gmType = null;
        gmType = new Polygon(coordinate);
        let feature = new Feature(gmType);
        feature.name = name;
        if (attributes) {
            feature.attributes = attributes;
        }
        return feature;
    },
    /**
     * 创建Geojson
     *
     */
    createGeojson(GeoJson) {
        let features = new GeoJSON({
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        }).readFeatures(GeoJson);
        return features;
    },
    /**
     * 创建图层
     *@param feature           @type(Object Or Array) 要素对象或数组
     * @param createLayerName  @type(String)          创建图层名称
     * @param layerLevel       @type(Number)          图层层级
     * @param styleObj         @type(Object)          图层样式
     */
    createLayer(feature, createLayerName, layerLevel, styleObj, featureType) {

        //如styleObj为null时,赋值为空
        if (!styleObj) {
            styleObj = {
                circle: '',
                stroke: '',
                line: '',
                fill: ''
            }
        }
        //创建图层
        let vl = new vectorLayer({
            zIndex: layerLevel,
            source: new vectorSource(),
            style: mapUtil.setStyle(styleObj)
        });
        //判断feature为对象还是数组形式
        if (Object.prototype.toString.call(feature) === '[object Array]' || featureType == 'Geojson') {
            vl.getSource().addFeatures(feature);
        } else {
            vl.getSource().addFeature(feature);
        }
        vl.name = createLayerName;
        mapUtil._mapInstance.addLayer(vl);
        return vl;
    },

    /**
     * 图层样式
     */
    setStyle(styleObj) {
        let styles = new Style({
            // 将点设置成圆形样式
            image: new Circle({
                // 点的颜色
                fill: new Fill({
                    color: styleObj.circle || '#F00'
                }),
                // 圆形半径
                radius: 5
            }),
            // 线样式
            stroke: new Stroke({
                color: styleObj.stroke || '#409EFF',
                //lineDash: [4],
                width: styleObj.line || 2
            }),
            // 填充样式
            fill: new Fill({
                color: styleObj.fill || 'rgba(255, 255, 255, 0.1)'
            })
        });
        return styles;
    },

    /**
     * 创建静态image图层
     * @param name @type(string)  图层名称
     * @param url @type(String)   图片路径地址
     * @param extent @type(Array) 范围
     * @param layerLevel       @type(Number)          图层层级
     * @param attr
     */
    createStaticImage(name, url, extent, layerLevel, attr) {
        let imgLayer = new Image({
            zIndex: layerLevel,
            source: new Static({
                attributions: attr,
                url: url,
                projection: 'EPSG:3857',
                imageExtent: transformExtent(extent, "EPSG:4326", "EPSG:3857")
            })
        });
        imgLayer.name = name;
        mapUtil._mapInstance.addLayer(imgLayer);
        return imgLayer;
    },

    /**
     * 清楚图层
     * @param layerName         @type(String)          图层名称
     * */
    clearLayer(layerName) {
        let layer = mapUtil._mapInstance.getLayers()
        if (layer) {
            let lys = layer.getArray();
            for (let i = 0; i < lys.length; i++) {

                if (lys[i].name == layerName) {
                    mapUtil._mapInstance.removeLayer(lys[i]);
                }
            }
        }
        return true
    },
    //增加图例
    addScaleLine() {
          mapUtil.scaleLineControl = new ScaleLine({    
                        //设置度量单位为米    
                        units: 'metric',    
                        target: 'scalebar',    
                        className: 'ol-scale-line'    
                    });  
        mapUtil._mapInstance.addControl(mapUtil.scaleLineControl);  
    },
    //删除比例尺
    removeControl() {
        mapUtil._mapInstance.removeControl(mapUtil.scaleLineControl);
    }
}
export default mapUtil
