import mapUtil from "@/utils/Openlayer-utils";
import { WKT, GeoJSON, MVT } from 'ol/format';
import { format } from 'ol/coordinate';
import { XYZ, ImageWMS, TileWMS, Vector as vectorSource, ImageStatic as Static, VectorTile as VectorTileSource } from 'ol/source';