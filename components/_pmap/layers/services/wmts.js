/**
 * @文件说明: Services.WMTS - WMTS服务
 * @创建人: pjtools@vip.qq.com
 * @创建时间: 2020-03-25 16:58:54
 */

import assign from 'lodash/assign';
import { isBooleanFlase, isEmpty } from '../../../_util/methods-util';
import { defaultServicesSourceOptions, defaultServicesLayerOptions, getServicesLayerSource, getServicesBaseLayer } from './index';

const defaultServicesOptions = {
  // 版本号
  version: null,
  // 图层名标识
  layerName: null,
  // 图层矩阵集名
  layerMatrixSet: null,
  // 图层样式名
  styleName: null,
  // 图片格式，可选值：[ image/tile | image/png | image/jpeg ]
  format: null,
};

/**
 * 解析WMTS类型的服务地址获取图层服务数据信息
 */
const fetchWMTSCapabilities = (own, url, options) => {
  const { GeoGlobe } = own.exports;
  const isProxyUrl = isBooleanFlase(options.proxy) ? false : true;

  return new Promise((resolve, reject) => {
    let capabilitiesUrl = `${url}${url.indexOf('?') === -1 ? '?' : '&'}SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities`;
    isProxyUrl && (capabilitiesUrl = `${own.proxyURL}${capabilitiesUrl}`);

    // 请求图层数据信息
    GeoGlobe.Request.GET({
      url: capabilitiesUrl,
      success: data => {
        const opts = {};
        try {
          // 获取WMTS服务的Capabilities信息
          let capabilities = !data.responseXML || !data.responseXML.documentElement ? data.responseText : data.responseXML;
          capabilities = new GeoGlobe.Format.WMTSCapabilities.v1_0_0().read(capabilities);
          // 图层标识
          const defaultLayer = capabilities.contents.layers && capabilities.contents.layers[0];
          const defaultLayerName = defaultLayer.identifier;
          opts.layerName = !isEmpty(options.layerName) ? options.layerName : defaultLayerName;
          // 图片格式
          opts.formats = defaultLayer.formats;
          opts.format = opts.formats[0] || 'image/tile';
          // 矩阵集名称
          const matrixSet = capabilities.contents.tileMatrixSets;
          const defaultMatrixSet = matrixSet[defaultLayer.tileMatrixSetLinks[0].tileMatrixSet];
          opts.matrixSet = !isEmpty(options.layerMatrixSet) ? options.layerMatrixSet : defaultMatrixSet.identifier;
          // 图层样式名称
          const defaultStyleName = defaultLayer.styles[0].identifier;
          opts.styleName = !isEmpty(options.styleName) ? options.styleName : defaultStyleName;
          // 版本号
          const version = capabilities.serviceIdentification.serviceTypeVersion;
          opts.version = !isEmpty(options.version) ? options.version : version;
          // 矩形范围
          const bounding = defaultLayer.bounds;
          const defaultBounds = [
            [Number(bounding._sw.lng), Number(bounding._sw.lat)],
            [Number(bounding._ne.lng), Number(bounding._ne.lat)],
          ];
          opts.tileBBox = defaultBounds;
          // 层级
          const tileMatrix = defaultMatrixSet.matrixIds;
          const zoom = [];
          const scales = [];
          let tileSize = 256;
          tileMatrix.forEach((item, idx) => {
            const currentZoom = parseInt(item.identifier, 10);
            zoom.push(currentZoom);
            scales.push({ zoom: currentZoom, scale: Number(item.scaleDenominator) });
            if (idx === 0) {
              tileSize = Number(item.tileWidth);
            }
          });
          opts.tileSize = tileSize;
          opts.scales = scales;
          opts.zoom = zoom;
          opts.minZoom = zoom[0];
          opts.maxZoom = zoom[zoom.length - 1];
          // CRS
          opts.crs = defaultMatrixSet.supportedCRS.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3');
          // 金字塔顶级范围
          const origin = [tileMatrix[0].topLeftCorner.lat, tileMatrix[0].topLeftCorner.lng];
          // 根据图层的最小比例尺获取分辨率
          const resolution = GeoGlobe.Util.getResolutionFromScale(scales[0].scale, 'm');
          // 计算最大分辨率
          const maxResolution = resolution * Math.pow(2, opts.minZoom);
          // 金字塔顶层左上角第一个瓦片的左上角X轴
          const topTileFromX = Number(origin[0]);
          // 金字塔顶层左上角第一个瓦片的左上角Y轴
          const topTileFromY = Number(origin[1]);
          // 金字塔顶层左上角第一个瓦片的右下角X轴
          const topTileToX = topTileFromX + maxResolution * 256;
          // 金字塔顶层左上角第一个瓦片的右下角Y轴
          const topTileToY = topTileFromY - maxResolution * 256;
          opts.topTileExtent = [topTileFromX, topTileToY, topTileToX, topTileFromY];
        } catch (e) {
          console.error(e);
          reject();
        }
        resolve(opts);
      },
      failure: () => {
        console.error(`WMTS服务地址[${url}]数据解析失败.`);
        reject();
      },
    });
  });
};

/**
 * 解析WMTS类型的服务地址获取图层样式信息
 */
const fetchGeoTileLayerStyles = (own, id, url, layerOptions, options) => {
  const isProxyUrl = isBooleanFlase(options.proxy) ? false : true;
  // 拼接数据源的矢量瓦片服务地址
  const params = {};
  params.SERVICE = 'WMTS';
  params.REQUEST = 'GetTile';
  params.VERSION = layerOptions.version;
  params.LAYER = layerOptions.layerName;
  params.STYLE = layerOptions.styleName;
  params.TILEMATRIXSET = layerOptions.matrixSet;
  params.FORMAT = layerOptions.format;
  params.TILEMATRIX = '{z}';
  params.TILEROW = '{y}';
  params.TILECOL = '{x}';
  let wmtsUrl = '';
  Object.keys(params).map((key, idx) => {
    if (idx !== 0) {
      wmtsUrl += '&';
    }
    wmtsUrl += `${encodeURIComponent(key)}=${params[key]}`;
  });
  wmtsUrl = `${url}${url.indexOf('?') === -1 ? '?' : '&'}${wmtsUrl}`;
  isProxyUrl && (wmtsUrl = `${own.proxyURL}${wmtsUrl}`);
  // 构建数据源
  const source = getServicesLayerSource(options);
  source.tileSize = options.tileSize || layerOptions.tileSize || options.defaultTileSize;
  source.tiles = [wmtsUrl];
  source.zoomOffset = !isEmpty(options.zoomOffset) ? options.zoomOffset : 0;
  // 构建图层
  const layer = getServicesBaseLayer(options);
  layer.id = id;
  layer.source = source;
  layer.minzoom = !layer.minzoom || layer.minzoom < layerOptions.minZoom ? layerOptions.minZoom : layer.minzoom;
  layer.maxzoom = !layer.maxzoom || layer.maxzoom > layerOptions.maxZoom + 1 ? layerOptions.maxZoom + 1 : layer.maxzoom;
  layer.metadata = assign({}, layer.metadata, {
    serviceType: 'WMTS',
    serviceName: options.name || '',
    zoomOffset: source.zoomOffset || 0,
    ...layerOptions,
  });
  return layer;
};

class WMTS {
  constructor(iMapApi) {
    this.iMapApi = iMapApi;
    this.exports = iMapApi && iMapApi.exports ? iMapApi.exports : {};
    this.proxyURL = iMapApi.proxyURL || '';
    this.options = {
      ...defaultServicesSourceOptions,
      ...defaultServicesLayerOptions,
      ...defaultServicesOptions,
    };
  }

  /**
   * 获取解析WMTS服务的图层对象
   * @param {String} id 图层Id名称
   * @param {String} name 图层Name名
   * @param {String} url 服务地址
   * @param {Object} options 解析服务的参数选项
   */
  async getLayer(id, name = '', url, options = {}) {
    const opts = assign(this.options, options);
    // 获取服务信息
    const layerOptions = await fetchWMTSCapabilities(this, url, opts);
    // 获取WMTS图层
    return fetchGeoTileLayerStyles(this, id, url, layerOptions, { ...opts, name });
  }
}

export default WMTS;
