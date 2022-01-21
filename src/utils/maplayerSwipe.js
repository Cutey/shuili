import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { getRenderPixel } from 'ol/render';
import OSM from 'ol/source/OSM';
import { transform, getTransform, transformExtent, Projection } from "ol/proj";
import mapUtil from './Openlayer-utils'
export default {
    rightLayer: null,
    map: null,
    init(mapDiv) {
        let leftURL = 'http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7'; // 高德矢量图
        let rightURL = 'http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6';//影像路图（含路网，含注记）
        let center = transform(mapUtil._center, "EPSG:4326", "EPSG:4490");
        var leftLayer =new TileLayer({
            source: new OSM(),
          });
          leftLayer.name = 'leftLayer'
        var rightLayer = new TileLayer({
            source: new XYZ({
                url: rightURL
            })
        });
        rightLayer.name = 'rightLayer'
        var map = new Map({
            layers: [leftLayer, rightLayer],
            target: mapDiv,
            view: new View({
                center: center,//中心点,
                minZoom: mapUtil._minZoom,
                maxZoom: mapUtil._maxZoom,
                zoom: mapUtil._zoom,
                projection: 'EPSG:4326',
            })
        });
        this.rightLayer = rightLayer;
        this.map = map;
    },
    mapSwipe() {
        var swipe = document.getElementById('swipe');
        var map = this.map;
        this.swipeRender(map);
        swipe.addEventListener('input', function () {
            map.render();
        }, false);
    },
    swipeRender(map) {
        this.rightLayer.on('prerender', function (event) {
            var ctx = event.context;
            var mapSize = map.getSize();
            var width = mapSize[0] * (swipe.value / 100);
            var tl = getRenderPixel(event, [width, 0]);
            var tr = getRenderPixel(event, [mapSize[0], 0]);
            var bl = getRenderPixel(event, [width, mapSize[1]]);
            var br = getRenderPixel(event, mapSize);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(tl[0], tl[1]);
            ctx.lineTo(bl[0], bl[1]);
            ctx.lineTo(br[0], br[1]);
            ctx.lineTo(tr[0], tr[1]);
            ctx.closePath();
            ctx.clip();
        });

        this.rightLayer.on('postrender', function (event) {
            var ctx = event.context;
            ctx.restore();
        });
    },
    addlayers(){
        let mls = this.map.getLayers();

    }

}