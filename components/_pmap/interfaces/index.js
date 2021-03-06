/**
 * @文件说明: 构建Map.Interfaces地图交互接口对象
 * @创建人: pjtools@vip.qq.com
 * @创建时间: 2020-05-21 10:09:45
 */

import BasicMapApi from '../util/basicMapApiClass';
import Fullscreen from './fullscreen';
import Draw from './draw';
import Measure from './measure';

class Interfaces extends BasicMapApi {
  /**
   * 获取地图“全屏”实例对象
   */
  fullscreen() {
    return new Fullscreen(this.iMapApi);
  }

  /**
   * 获取地图“绘制矢量图形”实例对象
   * @param {Object} options “绘制”交互的初始参数选项
   */
  draw(options = {}) {
    return new Draw(this.iMapApi, options);
  }

  /**
   * 获取地图“测量”实例对象
   */
  measure() {
    return new Measure(this.iMapApi);
  }
}

export default Interfaces;
