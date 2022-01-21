import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import Tile from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileGrid from 'ol/tilegrid/TileGrid';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style, Stroke, Fill, Circle } from 'ol/style';
import Draw from "ol/interaction/Draw";
import { createBox } from "ol/interaction/Draw";
import { fromLonLat } from 'ol/proj';
import { WKT, GeoJSON, MVT } from 'ol/format';
import { format } from 'ol/coordinate';
import $ from "jquery"
import { transform, getTransform, transformExtent, Projection } from "ol/proj";
import * as turf from '@turf/turf'
import mapUtil from "@/utils/Openlayer-utils";
import store from '../store/index.js'
import terraformer from './terraformer.js'

var drawmap = null
var draw_vector = null
var geometryonbj = null
var draw_source = new VectorSource()
const mapDraw = {
    drawinit(drawtype, val) {
        mapUtil._mapInstance.removeInteraction(drawmap); //移除交互

        if (mapDraw.addDrawLayer()) {
            mapDraw.drawFeature(drawtype, val)
        }

    },
    getgeometryonbj() {
        return geometryonbj
    },
    //绘制点线面
    drawFeature(drawtype, val) {
        if (!drawtype) return; //这里一定要判断
        geometryonbj = new Object
        if (drawtype === 'Square') { //正方形
            drawmap = new Draw({
                source: draw_source,
                geometryFunction: createBox(),
                type: "LineString",
                stopClick: false, //绘制时禁用点击事件
                freehand: false,
                // style: mapDraw.getDrawingStyle(),
            })
        } else {
            drawmap = new Draw({
                source: draw_source,
                type: drawtype,
                stopClick: false, //绘制时禁用点击事件
                // style: this.getDrawingStyle(),
                freehand: false,
            })
        }
        // 监听绘制结束事件
        drawmap.on("drawend", (evt) => {
            if (drawmap.type_ === "Circle") {
                let circleCenter = evt.feature.getGeometry().getCenter();
                let circleRadius = evt.feature.getGeometry().getRadius();
                geometryonbj.circleRadius = fromLonLat([circleRadius, circleRadius], "EPSG:3857")[0];
                geometryonbj.circleCenter = circleCenter
                    // this.$refs.infoEl.innerHTML = "圆心：" + circleCenter+"<br/>半径："+circleRadius;
            } else {
                let styleobj = {
                    stroke:'rgba(237,113,14,.8)',
                    line:'3',
                    fill:'rgba(246,242,240,.3)'
                }
                let isstyleobj = {
                    stroke:'rgba(237,113,14,.8)',
                    line:'1',
                    fill:'rgba(246,242,240,0)'
                }
                let coordinates = evt.feature.getGeometry().getCoordinates();
                evt.feature.setStyle(mapUtil.setStyle(isstyleobj))
                if (drawmap.type_ == 'LineString') { //绘制的类型为线
                    let bufferCoordinates = [],
                        pointTransform = [];
                    for (var i = 0; i < coordinates.length; i++) {
                        pointTransform = transform(coordinates[i], "EPSG:3857", "EPSG:4326");
                        bufferCoordinates.push(pointTransform);
                    }
                    var line = turf.lineString(bufferCoordinates);
                    var buffered = turf.buffer(line, Number(val), { units: 'kilometers' });
                    //读取geojson数据
                    var b = mapUtil.createGeoJsonFeature(buffered)
                    b[0].setStyle(mapUtil.setStyle(styleobj))
                    draw_source.addFeature(b[0]);
                     // 将geojson转为wkt格式数据
                    let featergeo = terraformer.terraformerinit('wkt',buffered.geometry)
                    store.dispatch('setspaceWkt', featergeo)


                } else if (drawmap.type_ == 'Point') { //绘制的类型为点
                    var pointTransform = transform(coordinates, "EPSG:3857", "EPSG:4326");
                    var point = turf.point(pointTransform);
                    var buffered = turf.buffer(point, Number(val), { units: 'kilometers' });
                    //读取geojson数据
                    var b = mapUtil.createGeoJsonFeature(buffered)
                    b[0].setStyle(mapUtil.setStyle(styleobj))
                    draw_source.addFeature(b[0]);
                   
                     // 将geojson转为wkt格式数据
                    let featergeo = terraformer.terraformerinit('wkt',buffered.geometry)
                    store.dispatch('setspaceWkt', featergeo)

                } else if (drawmap.type_ == 'Polygon') { //绘制的类型为多边形
                    let bufferCoordinates = [],pointTransform = []
                    for (var i = 0; i < coordinates[0].length; i++) {
                        pointTransform = transform(coordinates[0][i], "EPSG:3857", "EPSG:4326");
                        bufferCoordinates.push(pointTransform);
                    }
                    var py = turf.polygon([bufferCoordinates]);
                    var buffered = turf.buffer(py, Number(val), { units: 'kilometers' });
                    //读取geojson数据
                    var b = mapUtil.createGeoJsonFeature(buffered)
                   
                    b[0].setStyle(mapUtil.setStyle(styleobj))
                    draw_source.addFeature(b[0]);
                    // 将geojson转为wkt格式数据
                    let featergeo = terraformer.terraformerinit('wkt',buffered.geometry)
                    store.dispatch('setspaceWkt', featergeo)
                }
                geometryonbj.coordinates = coordinates
            }
            mapUtil._mapInstance.removeInteraction(drawmap); //只能画一个点，线，面
        });
     
        mapUtil._mapInstance.addInteraction(drawmap);
    },
    //添加绘制点线面图层
    addDrawLayer() {
        draw_vector = new VectorLayer({
            source: draw_source,
            //绘制好后，在地图上呈现的样式
           
            zIndex:2,
        });
        mapUtil._mapInstance.addLayer(draw_vector);
        return true
    },
    //取消绘制
    cancelDraw() {
        mapUtil._mapInstance.removeInteraction(drawmap); //移除交互
    },
    //清空绘制图层
    clearDrawLayer() {
        mapUtil._mapInstance.removeInteraction(drawmap); //移除交互
        if(draw_vector){
            draw_vector.getSource().clear(); //清除图层上的所有要素
        }
       
    },
    getDrawingStyle() {
        return new Style({
            stroke: new Stroke({
                width: 2,
                color: [239, 176, 19, 1],
                lineDash: [1, 2, 3, 4, 5, 6],
            }),
            fill: new Fill({
                color: [239, 176, 19, 0.2],
            }),
            image: new Circle({
                // 点的颜色
                fill: new Fill({
                    color: [239, 176, 19, .5]
                }),
                stroke: new Stroke({
                    color: [239, 176, 19, 1]
                }),
                // 圆形半径
                radius: 5
            }),
        })
    },
}

export default mapDraw