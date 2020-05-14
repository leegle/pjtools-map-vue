/**
 * @文件说明: 构建Map.Handlers地图内置交互对象
 * @创建人: pjtools@vip.qq.com
 * @创建时间: 2020-05-14 11:41:07
 */

import BasicMapApi from '../util/basicMapApiClass';
import DragPan from './dragPan';

class Handlers extends BasicMapApi {
  /**
   * Handlers地图内置交互
   * 其中包括：[ dragPan | boxZoom | dragRotate | scrollZoom | keyboard | doubleClickZoom | touchZoomRotate ]
   * @param {MapApi} iMapApi 地图Api实例化对象
   */
  constructor(...arg) {
    super(...arg);
  }

  /**
   * 获取 dragRotate 拖拽旋转交互对象（操作：Ctrl + 鼠标拖拽旋转 | 鼠标反键旋转）
   * @readonly
   */
  get dragRotate() {
    const map = this.iMapApi && this.iMapApi.map;
    return map && map.dragRotate;
  }

  /**
   * 获取 scrollZoom 鼠标滚轮缩放交互对象（操作：鼠标中键滚轮）
   * @readonly
   */
  get scrollZoom() {
    const map = this.iMapApi && this.iMapApi.map;
    return map && map.scrollZoom;
  }

  /**
   * 获取 boxZoom 键盘+鼠标组合拉框放大交互对象（操作：Shift + 拉框放大）
   * @readonly
   */
  get boxZoom() {
    const map = this.iMapApi && this.iMapApi.map;
    return map && map.boxZoom;
  }

  /**
   * 获取 keyboard 键盘快捷组合键交互对象
   * 键盘组合键说明：
   * +/= ：层级放大1级
   * -/— ：层级缩小1级
   * Shift + ：层级放大2级
   * Shift - ：层级缩小2级
   * 方向键上下左右：地图上下左右平移 100px 像素距离
   * Shift ↑ ：地图增加倾斜15度
   * Shift ↓ ：地图减少倾斜15度
   * Shift ← ：地图顺时针旋转10度
   * Shift → ：地图逆时针旋转10度
   * @readonly
   */
  get keyboard() {
    const map = this.iMapApi && this.iMapApi.map;
    return map && map.keyboard;
  }

  /**
   * 获取 doubleClickZoom 鼠标双击放大交互对象（操作：鼠标左键双击放大）
   * @readonly
   */
  get doubleClickZoom() {
    const map = this.iMapApi && this.iMapApi.map;
    return map && map.doubleClickZoom;
  }

  /**
   * 获取 touchZoomRotate 触摸屏双指缩放旋转交互对象（操作：触摸屏双指缩放与旋转）
   * @readonly
   */
  get touchZoomRotate() {
    const map = this.iMapApi && this.iMapApi.map;
    return map && map.touchZoomRotate;
  }

  /**
   * 获取 dragPan 地图漫游交互对象（操作：鼠标拖拽移动 | 触摸屏移动）
   * @readonly
   */
  get dragPan() {
    const map = this.iMapApi && this.iMapApi.map;
    if (!map) {
      return;
    }
    // 判断是否未实例化dragPan交互对象
    if (!map.pjDragPan) {
      map.pjDragPan = new DragPan(this.iMapApi);
    }
    return map.pjDragPan;
  }
}

export default Handlers;
