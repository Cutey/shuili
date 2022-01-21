import WKT from "terraformer-wkt-parser"
const terraformer = {
   terraformerinit(type,data){
       let creatdata = null
        if(type == 'wkt'){
            creatdata= terraformer.towkt(data)
        }else if(type == 'geojson'){
            creatdata= terraformer.togeojson(data)
        }
        return creatdata
    },
    togeojson(wkts){
        let wktdata = WKT.parse(wkts)
        return wktdata
    },
    towkt(data){
        let wktdata = WKT.convert(data)
        return wktdata
    }
    
}

export default terraformer