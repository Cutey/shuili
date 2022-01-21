/*轨迹路线*/
import * as Cesium from 'cesium'
import AppStore from "@/store/AppStore";
const MoveRourtesj = {
    that: null,
    viewer: null,
    animateEntity: null,
    timoutId: null,
    timeSum: 0,
    zongtimesun:0,
    trace: null,
    isplay: false,
    setView(viewer) {
        this.viewer = viewer;
    },
    createMoveLinenew(position, num) {
        MoveRourtesj.that = this;
        this.endMove();
        let start = Cesium.JulianDate.fromDate(new Date());
        let stop = Cesium.JulianDate.addSeconds(start, num, new Cesium.JulianDate());
        let positionProperty = this.sampledPositionProperty(position, start, [0,num]);
        this.createModel(start, stop, positionProperty);
        this.addnewEvent()
        this.viewer.clock.startTime = start.clone();
        this.viewer.clock.stopTime = stop.clone();
        this.viewer.clock.currentTime = start.clone();
        this.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;//LOOP_STOP达到终止时间后重新循环,//CLAMPED达到终止时间后停止,//UNBOUNDED达到终止时间后继续读秒
        this.viewer.clock.shouldAnimate = true;
        return this.animateEntity
    },
    endMove() {
        if (this.animateEntity) {
            this.removeEvent();
            // this.viewer.entities.remove(this.animateEntity);
            // this.animateEntity = null;
            clearTimeout(this.timoutId);
            this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            if (this.trace) {
                this.trace = false
            }
        }
    },
    sampledPositionProperty(position, startTime, siteTimes) {
        let s = new Cesium.SampledPositionProperty();
        for (let a = 0; a < position.length; a++) {
            let r = Cesium.JulianDate.addSeconds(startTime, siteTimes[a], new Cesium.JulianDate);
            s.addSample(r, position[a]);
        }
        return s
    },
        //创建模型
    createModel(start, stop, positionProperty) {
        this.animateEntity = this.viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: start,
                stop: stop
            })]),
            position: positionProperty,
            orientation: new Cesium.VelocityOrientationProperty(positionProperty),
            model: {
                uri: "GroundVehicle.glb",
                scale: 60,
                lightColor: new Cesium.Cartesian3(100, 100, 100)
            },
            path: {
                leadTime: 0,
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: .1,
                    color: Cesium.Color.GREEN.withAlpha(.9)
                }),
                width: 30
            }
        })
    },
    addnewEvent() {
        this.viewer.clock.onTick.addEventListener(this.traceHandler, this.viewer);
    },
    //追踪
    traceHandler() {
        let e = MoveRourtesj.that.animateEntity.position.getValue(MoveRourtesj.that.viewer.clock.currentTime);
        let i = MoveRourtesj.that.animateEntity.orientation.getValue(MoveRourtesj.that.viewer.clock.currentTime);
        let t = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(i), e);
        //MoveRourtesj.that.viewer.camera.lookAtTransform(t, new Cesium.Cartesian3(0, 90, 500));
        let heading = Cesium.Math.toRadians(90.0);//航向
        let pitch = Cesium.Math.toRadians(-75.0);//俯仰
        let range = 7500.0;//范围
        MoveRourtesj.that.viewer.camera.lookAtTransform(t, new Cesium.HeadingPitchRange(heading, pitch, range));
    },
    removeEvent() {
        this.viewer.clock.onTick.removeEventListener(this.traceHandler, this.viewer);
        this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    },
}

export default MoveRourtesj