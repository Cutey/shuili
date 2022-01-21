import { Map, View, Feature } from "ol";
import { Tile, Image, Vector as vectorLayer, VectorTile as VectorTileLayer } from "ol/layer";
import html2canvas from "html2canvas";
import { XYZ, ImageWMS, TileWMS, Vector as vectorSource, ImageStatic as Static, VectorTile as VectorTileSource } from 'ol/source';
import { transform, getTransform, transformExtent, Projection } from "ol/proj";
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer';
import { Point, LineString, Polygon, LinearRing } from "ol/geom";
import { fromExtent } from 'ol/geom/Polygon';
import { Fill, Stroke, Circle, Style, Icon, Text } from 'ol/style';
import LayerVector from "ol/layer/Vector";
import { defaults, Rotate, ScaleLine, Zoom } from 'ol/control';
import { WKT, GeoJSON, MVT } from 'ol/format';
import { Overlay } from 'ol/Overlay'
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import { getCenter } from 'ol/extent';
import AppCfg from '../config/AppCfg'
import * as olProj from 'ol/proj'
import { getTianditu } from './mapepsg'
import { format } from 'ol/coordinate';
import MousePosition from "ol/control/MousePosition.js";
import domtoimage from 'dom-to-image'

import Draw, {
    createBox
} from 'ol/interaction/Draw'
import store from '../store/index'

proj4.defs("EPSG:4490", "GEOGCS[\"China Geodetic Coordinate System 2000\",DATUM[\"China_2000\",SPHEROID[\"CGCS2000\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"1024\"]],AUTHORITY[\"EPSG\",\"1043\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4490\"]]");
register(proj4);




const mapUtil = {
    _mapInstance: null, //地图实例
    _mapContainer: null, //地图容器
    _zoom: 4, //地图级别
    _minZoom: 1, //地图最小级别
    _maxZoom: 25, //地图最大级别
    _center: [104.80258, 31.070269], //地图初始中心位置
    _extent: [117.01594781, 38.4449580083, 119.637510662, 40.9267630301],
    tdtToken: '2f3eb03445a8c299976d55341be55f96', //天地图访问地址token
    isNet: false, //公司内外网天地图访问标识

    //获取地图实例
    getMapInstance() {
        return mapUtil._mapInstance;
    },
    //获取地图容器
    getMapContainer() {
        return mapUtil._mapContainer;
    },
    changenum(center, mapzoom) {

        // mapUtil._mapInstance.getView().animate({
        //     center: center,
        //     zoom: mapzoom,
        //     duration: 1000,
        // });
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
                center: center, //中心点,
                minZoom: mapUtil._minZoom,
                maxZoom: mapUtil._maxZoom,
                zoom: mapUtil._zoom,
                // projection: 'EPSG:4326',
                projection: 'EPSG:3857',
                // extent: transformExtent(mapUtil._extent, 'EPSG:4326', 'EPSG:4490') //限制地图移动范围
            })
        });
        store.dispatch('setmapCenter', center)
        mapUtil._mapInstance.on("moveend", function(e) {
            var zoom = mapUtil._mapInstance.getView().getZoom(); //获取当前地图的缩放级别
            store.dispatch('setmapIndex', parseInt(zoom))
        });

        return mapUtil._mapInstance;
    },
    addmap() {

        var tdt = getTianditu({
            type: 'vec',
            // proj: '球面墨卡托投影',
            proj: '经纬度投影',

            key: '3988921eb66e20c7427e4f95182f9454'
        });
        var zz = getTianditu({
            type: 'img',
            // proj: '球面墨卡托投影',
            proj: '经纬度投影',

            key: '3988921eb66e20c7427e4f95182f9454'
        })
        var jj = getTianditu({
                type: 'ter',
                // proj: '球面墨卡托投影',
                proj: '经纬度投影',

                key: '3988921eb66e20c7427e4f95182f9454'
            })
            // mapUtil._mapInstance.addLayer(tdt)
        mapUtil._mapInstance.addLayer(zz)
            // mapUtil._mapInstance.addLayer(jj)
    },
    //地图复位
    restoreView() {
        let center = transform(mapUtil._center, "EPSG:4326", "EPSG:3857");
        mapUtil._mapInstance.getView().animate({
            center: center,
            zoom: mapUtil._zoom,
            duration: 1000
        });
    },
    // 地图定位
    gpsView(x, y) {
        // 地图定位缩放级别
        let zoom = "11"
        let gpsview = mapUtil._mapInstance.getView();
        // 设置地图中心，将地图移动到中心点
        gpsview.setCenter(transform([x, y], 'EPSG:4326', 'EPSG:3857'));
        // 设置缩放级别
        gpsview.setZoom(zoom)
        mapUtil._mapInstance.render();


    },
    setcenter(centersd, zoom) {
        let center = transform(centersd, "EPSG:4326", "EPSG:3857");
        mapUtil._mapInstance.getView().animate({
            center: center,
            zoom: zoom ? zoom : 10,
            duration: 1000
        });
    },
    // 鼠标滑动获取鼠标位置经纬度
    MousePosition() {
        const mousePositionControl = new MousePosition({
            coordinateFormat: function(coordinate) {
                for (var i = 0; i < coordinate.length; i++) {
                    coordinate[i] = coordinate[i].toFixed(6)
                }
                store.dispatch('setmapCenter', coordinate)
            },
            projection: 'EPSG:4490',
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
            undefinedHTML: ' '
        });
        //添加控件到地图
        mapUtil._mapInstance.addControl(mousePositionControl);
    },
    /**
     * 设置地图容器高度
     * @param v 高度
     */
    setMapHeight(v) {
        if (mapUtil._mapInstance && mapUtil._mapContainer) {
            mapUtil._mapContainer.style.width = '100%';
            mapUtil._mapContainer.style.height = v + 'px';
            mapUtil._mapInstance.updateSize();
        }
    },
    setMapWidth(v) {
        if (mapUtil._mapInstance && mapUtil._mapContainer) {
            mapUtil._mapContainer.style.width = window.clientWidth - v + 'px';
            mapUtil._mapInstance.updateSize();
        }
    },
    //要么单纯使用代理，要么淡出使用天地图，40个token切换
    getMapUrls(layerType, isMain, isProxy) {
        let urls4Map = [],
            urls4Label = [],
            guojiemapser = []
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
            'guojiemapser': guojiemapser
        };
    },
    switchLayer(layerType) {

        let baseLyr, baseLyrLabel, urls = mapUtil.getMapUrls(layerType, false, true);
        baseLyr = new Tile({
            zIndex: 0,
            source: new XYZ({
                urls: urls.urls4Map,
                crossOrigin: 'anonymous'

            }),
            isGroup: true,
            name: layerType + '-layer'
        });
        baseLyrLabel = new Tile({
            zIndex: 1,
            source: new XYZ({
                urls: urls.urls4Label,
                crossOrigin: 'anonymous'
            }),
            isGroup: true,
            name: layerType + '-label-layer'
        });
        let guojie = new Tile({
            zIndex: 1,
            source: new XYZ({
                urls: urls.guojiemapser,
                crossOrigin: 'anonymous'
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
    //https://cloudtest.piesat.cn/engine-server//pie-engine/vector/dynamic/tiles?id=04b78b5db58e1000

    //https://cloudtest.piesat.cn/engine-server//pie-engine/vector/dynamic/tiles?id=04b627ab1a0e1000&z={z}&x={x}&y={y}
    createWVTLayer(url, layername) {
        let layer = new VectorTileLayer({
            source: new VectorTileSource({
                format: new MVT(),
                url: url,
            }),
        });
        layer.name = layername
        return layer
    },

    // 地图增加比例尺
    addScaleLine() {  
        mapUtil.scaleLineControl  =  new  ScaleLine({                 //设置度量单位为米    
                         units:   'metric',                 target:   'scalebar',                 className: 'ol-scale-line'         });  
        mapUtil._mapInstance.addControl(mapUtil.scaleLineControl);  
    },
    // 設置地圖顯示層級
    mapsetzoom(zoom) {
        mapUtil._mapInstance.getView().setZoom(zoom)
    },

    /**
     * wms一张图片服务加载方式
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
                    "projection": 'EPSG:4490'
                }
            })
        });
        wmsLayer.name = createLayerName;
        mapUtil._mapInstance.addLayer(wmsLayer);
        return wmsLayer;
    },


    /**
     * wms预警服务加载方式
     * @param url              @type(String) 服务地址
     * @param serverLayerName  @type(String) 服务图层名称
     * @param createLayerName  @type(String) 创建图层名称
     * @param layerLevel       @type(Number) 图层层级
     * */
    earlywmsLayer(url, serverLayerName, createLayerName, layerLevel, comlevel) {
        let wmsLayer = new Image({
            zIndex: layerLevel,
            source: new ImageWMS({
                ratio: 1,
                url: url,
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    "LAYERS": serverLayerName,
                    "STYLES": 'yn-warn',
                    "exceptions": 'application/vnd.ogc.se_inimage',
                    "projection": 'EPSG:4326',
                    "CQL_FILTER": 'level' + comlevel
                }
            })
        });
        wmsLayer.name = createLayerName;
        mapUtil._mapInstance.addLayer(wmsLayer);
        return wmsLayer;
    },
    /**
     * wms瓦片图片服务加载方式
     * @param url              @type(String) 服务地址
     * @param serverLayerName  @type(String) 服务图层名称
     * @param createLayerName  @type(String) 创建图层名称
     * @param layerLevel       @type(Number) 图层层级
     * */
    wmsTileLayer(url, serverLayerName, createLayerName, layerLevel) {
        let wmsLayer = new Tile({
            zIndex: layerLevel,
            source: new TileWMS({
                url: url,
                params: {
                    "LAYERS": serverLayerName,
                    "projection": 'EPSG:4490',
                    // "VERSION":'1.1.0'
                }
            })
        });
        wmsLayer.name = createLayerName;
        mapUtil._mapInstance.addLayer(wmsLayer);
        return wmsLayer;
    },
    //添加矢量线
    setLineFeature: function(coord, name) {
        let feature = new Feature({
            geometry: new LineString(coord)
        });
        feature.name = name;
        return feature;
    },
    //添加矢量图层
    addLayer: function(vectorSource, styleType) {
        let vectorLayer = new LayerVector({
            zIndex: 2,
            source: vectorSource,
            style: mapUtil.setStyle(styleType),
        });
        return vectorLayer
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
    //EPSG:4326坐标系渲染热点网格的方法
    /**
     *创建要素
     * @param geometryType  @type(String) (point,line,polygon)根据类型创建点线面
     * @param name          @type(String) 要素名称
     * @param coordinate    @type(Array)  坐标数组
     * @param attributes    @type(Object)  属性信息
     */
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
     *WKT方式创建要素
     */
    createWKTfeature(wkt) {
        let format = new WKT();
        let feature = format.readFeature(wkt, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        return feature;
    },
    /**
     *geoJson创建要素
     */
    createGeoJsonFeature(geoJsonObject) {
        let features = new GeoJSON({
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        }).readFeatures(geoJsonObject);
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
        let img = null;
        if (styleObj && styleObj.icon) {
            img = new Icon({
                src: styleObj.icon,
                scale: styleObj.scale || 0.06,
                rotateWithView: styleObj.rotateWithView || false,
                offset: styleObj.offset,
                offsetOrigin: styleObj.offsetOrigin,
                size: styleObj.size
            });
        } else {
            img = new Circle({
                // 点的颜色
                fill: new Fill({
                    color: styleObj.circle || '#F00'
                }),
                // 圆形半径
                radius: styleObj.radius || 8
            })
        }
        let style = new Style({
            // 将点设置成圆形样式
            image: img,
            // 线样式
            stroke: new Stroke({
                color: styleObj.stroke || '#409EFF',
                lineDash: styleObj.lineDash || '',
                width: styleObj.line || 2
            }),
            // 填充样式
            fill: new Fill({
                color: styleObj.fill || 'rgba(17,138,211, 0.6)'
            }),
            text: new Text({
                //对齐方式
                textAlign: 'center',
                //文本基线
                textBaseline: 'middle',
                //字体样式
                font: styleObj.font || 'normal 12px 微软雅黑',
                offsetY: 30,
                offsetX: 0,
                //文本内容
                text: styleObj.text || '',
                // 文本
                backgroundFill: new Fill({ // 填充背景
                    color: styleObj.backgroundFill || [0, 0, 0, 0],
                }),

                padding: styleObj.padding || 0,
                fill: new Fill({
                    // color: '#333'
                    color: styleObj.textColor || '#333',
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 2
                }),
                placement: 'point', //point 则自动计算面的中心点然后标注  line 则根据面要素的边进行标注
                overflow: true, //超出面的部分显示
            })
        });
        return style;
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
    creatBigImage(nema, url, extent, imageExtent, attr) {
        let ImageLayer = new Image({
            source: new Static({
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/' +
                    'British_National_Grid.svg/2000px-British_National_Grid.svg.png',
                crossOrigin: '',
                projection: 'EPSG:27700',
                imageExtent: [0, 0, 8933, 8625]
            })
        })
        ImageLayer.name = nema;
        mapUtil._mapInstance.addLayer(ImageLayer);
        return ImageLayer;
    },
    mapcenterposion(feature) {
        let extent = feature[0].getGeometry().getExtent(); //获取范围
        mapUtil._mapInstance.getView().fit(extent, mapUtil._mapInstance.getSize());

    },
    /**
     * 地图添加遮罩,将需要显示的区域遮罩擦除
     * @param coordinate    @type(Array)  坐标数组
     */
    erase(coordinate) {
        let extent = transformExtent(this._extent, 'EPSG:4326', 'EPSG:3857');
        let polygonRing = fromExtent(extent);
        coordinate.forEach(i => {
            let lr = new LinearRing(i);
            polygonRing.appendLinearRing(lr);
        });
        let feature = new Feature({
            geometry: polygonRing
        });
        let style = {
            stroke: 'rgba(255, 255, 255, 0)',
            fill: 'rgba(100,127,147,.9)'
        };
        let eraseLyr = mapUtil.createLayer(feature, 'ov', '1');
        eraseLyr.setStyle(mapUtil.setStyle(style));
    },
    //地图改变鼠标光标为小手
    vectorPointerMove() {
        let map = mapUtil._mapInstance;
        map.on("pointermove", function(evt) {
            let feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                return feature;
            });
            if (feature) {
                let feName = feature.name;
                if ('boundaryFeature' == feName) {
                    map.getTargetElement().style.cursor = "";
                } else {
                    map.getTargetElement().style.cursor = "pointer";
                }
            }
        });
    },
    /**
     * 清除图层
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
    },
    clearLayerall() {
        let layer = mapUtil._mapInstance.getLayers()
        if (layer) {
            let lys = layer.getArray();
            for (let i = 0; i < lys.length; i++) {
                if (lys[i].name) {
                    mapUtil._mapInstance.removeLayer(lys[i]);
                }
            }
        }
    },
    clearLayerone(layerName) {
        let layersarr = []
        let layer = mapUtil._mapInstance.getLayers()
        if (layer) {
            let lys = layer.getArray();
            for (let i = 0; i < lys.length; i++) {
                if (lys[i].name == layerName) {
                    layersarr.push(lys[i])
                        // mapUtil._mapInstance.removeLayer(lys[i]);
                }
            }
            if (layersarr.length > 1) {
                for (let j = 1; j < lys.length; j++) {
                    mapUtil._mapInstance.removeLayer(layersarr[j]);
                }
            };
        }
    },
    mapClick() {
        const coordinate = []
        mapUtil._mapInstance.on("click", function(evt) {     
            coordinate = evt.coordinate_;

                     
        }, map);
    },

    drawMap(map, imgName) {
        let node = document.getElementById('mapwarp');
        domtoimage.toPng(node).then(function(dataUrl) {
            var link = document.createElement('a');
            link.download = '全图导出.jpeg';
            link.href = dataUrl;
            link.click();
        }).catch(function(error) {

        });
    }

}
export default mapUtil