/**
 * @文件说明: Draw.Modes.Point 绘制“圆点”模式
 * @创建人: pjtools@vip.qq.com
 * @创建时间: 2020-05-27 15:36:56
 */

import assign from 'lodash/assign';
import Constants from '../constants';
import { isEscapeKey } from '../libs/common_selectors';

const DEFAULT_CURSOR_OPTIONS = {
  cursor: 'default',
  icon: 'highlight',
  content: '单击确定点位，ESC键取消',
};

// 绘制模式时的默认通用激活启动
export const defaultDrawSetupMethodsSetup = function(context, cursor) {
  // 设置绘图为非活动状态
  context.ctx.setActive(false);
  // 延时禁止地图双击缩放交互，避免绘制状态结束的双击触发
  window.setTimeout(() => {
    context.ctx.iMapApi.Handlers.doubleClickZoom.disable();
  }, 320);
  // 清空所有选中的要素
  context.clearSelectedFeatures();
  // 设置当前可活动操作的状态
  context.setActionableState({
    trash: true,
  });
  // 设置启动光标
  context.updateCursor(cursor);
};

// 绘制模式时的默认通用取消激活
export const defaultDrawSetupMethodsStop = function(context) {
  // 移除光标
  context.clearCursor();
  // 设置绘图为非活动状态
  context.ctx.setActive(false);
  // 延时恢复还原地图双击缩放交互，避免绘制状态结束的双击触发
  window.setTimeout(() => {
    context.ctx.iMapApi.Handlers.doubleClickZoom.enable();
  }, 300);
};

const PointMode = {};

// Mode模式的注册 - 激活入口
PointMode.onSetup = function(options = {}) {
  // 合并绘制Point模式的光标
  const cursorOptions = assign({}, DEFAULT_CURSOR_OPTIONS, (options && options.cursor) || {});
  options && (options.cursor = cursorOptions);
  // 执行默认初始化
  defaultDrawSetupMethodsSetup(this, options.cursor);

  return { options };
};

// 触发已绘制的所有Feature矢量要素对象进行显示渲染
PointMode.toDisplayFeatures = function(state, geojson, display) {
  // 判断是否存在当前绘制<活动状态>的Point要素
  if (state && state.point && geojson.id === state.point.id) {
    // 修改当前绘制的Feature为非活动状态
    if (geojson.properties['draw:active'] === Constants.activeStates.ACTIVE) {
      geojson.properties['draw:active'] = Constants.activeStates.INACTIVE;
      state.point.updateInternalProperty('active', Constants.activeStates.INACTIVE);
    }
    display(geojson);
    // 执行绘制完成
    this.onCompleted(geojson);
  } else {
    // 渲染数据
    display(geojson);
  }
};

// Mode模式 - 取消释放
PointMode.onStop = function(state) {
  // 判断绘制的Point要素是否无效
  if (state.point && !state.point.getCoordinate().length) {
    this.deleteFeature([state.point.id], { silent: true });
    delete state.point;
  }
  // 执行默认取消释放
  defaultDrawSetupMethodsStop(this);
};

// Mode模式 - 绘制完成
PointMode.onCompleted = function(geojson) {
  // 驱动事件回调
  this.ctx.api.fire(Constants.events.DRAW_COMPLETE, {
    mode: this.getMode(),
    feature: geojson,
  });
  // 切换到“选取”模式
  this.changeMode(Constants.modes.SELECT, {
    featureIds: [geojson.id],
  });
};

// Mode模式 - 绘制取消
PointMode.onCancel = function(state) {
  if (state.point) {
    this.deleteFeature([state.point.id], { silent: true });
    delete state.point;
  }
  // 驱动事件回调
  this.ctx.api.fire(Constants.events.DRAW_CANCEL, {
    mode: this.getMode(),
  });
  this.changeMode(Constants.modes.SELECT);
};

// 触发Tap/Click时的响应事件
PointMode.onTap = PointMode.onClick = function(state, e) {
  // 判断是否未构建<活动状态>的Point要素，则进行创建
  if (!state || !state.point) {
    const point = this.newFeature({
      geometry: {
        type: Constants.geojsonTypes.POINT,
        coordinates: [],
      },
    });
    state.point = point;
    this.addFeature(point);
  }
  // 更新当前绘制Point要素的空间坐标
  state.point.updateCoordinate(e.lngLat.lng, e.lngLat.lat);
  // 设置绘图为活动状态
  this.ctx.setActive(true);
};

/**
 * 触发键盘KeyUp时的响应事件
 */
PointMode.onKeyUp = function(state, e) {
  // 判断Esc键则取消
  isEscapeKey(e) && this.onCancel(state);
};

/**
 * 触发删除选中的Feature矢量要素
 */
PointMode.onTrash = function(state) {
  this.onCancel(state);
};

export default PointMode;
