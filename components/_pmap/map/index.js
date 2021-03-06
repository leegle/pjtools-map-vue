/**
 * @文件说明: 动态扩展PJtools.Map地图Class对象的函数方法
 * @创建人: pjtools@vip.qq.com
 * @创建时间: 2020-03-21 14:36:36
 */

import source from './source';
import layer from './layer';
import layerGroup from './layerGroup';
import feature from './feature';
import resource from './resource';
import event from './event';
import proj4 from './proj4';
import control from './control';
import interaction from './interaction';
import marker from './marker';
import popup from './popup';

export default {
  // 地图“数据源”管理相关功能方法
  ...source,
  // 地图“图层”管理相关功能方法
  ...layer,
  // 地图“图层组”管理相关功能方法
  ...layerGroup,
  // 地图“要素”管理相关功能方法
  ...feature,
  // 地图“资源”管理相关功能方法
  ...resource,
  // 地图“事件”管理相关功能方法
  ...event,
  // 地图“Proj4”管理相关功能方法
  ...proj4,
  // 地图“控件”管理相关功能方法
  ...control,
  // 地图“交互组件”管理相关功能方法
  ...interaction,
  // 地图“Marker标注”管理相关功能方法
  ...marker,
  // 地图“Popup弹框”管理相关功能方法
  ...popup,
};
