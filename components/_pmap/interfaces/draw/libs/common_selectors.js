/**
 * @文件说明: 定义绘图的选中交互的函数方法
 * @创建人: pjtools@vip.qq.com
 * @创建时间: 2020-05-28 19:10:56
 */

import Constants from '../constants';

export function isOfMetaType(type) {
  return function(e) {
    const featureTarget = e.featureTarget;
    if (!featureTarget) return false;
    if (!featureTarget.properties) return false;
    return featureTarget.properties['draw:meta'] === type;
  };
}

export function isShiftMousedown(e) {
  if (!e.originalEvent) return false;
  if (!e.originalEvent.shiftKey) return false;
  return e.originalEvent.button === 0;
}

export function isActiveFeature(e) {
  if (!e.featureTarget) return false;
  if (!e.featureTarget.properties) return false;
  return (
    e.featureTarget.properties['draw:active'] === Constants.activeStates.ACTIVE && e.featureTarget.properties['draw:meta'] === Constants.meta.FEATURE
  );
}

export function isInactiveFeature(e) {
  if (!e.featureTarget) return false;
  if (!e.featureTarget.properties) return false;
  return (
    e.featureTarget.properties['draw:active'] === Constants.activeStates.INACTIVE &&
    e.featureTarget.properties['draw:meta'] === Constants.meta.FEATURE
  );
}

export function noTarget(e) {
  return e.featureTarget === undefined;
}

export function isFeature(e) {
  if (!e.featureTarget) return false;
  if (!e.featureTarget.properties) return false;
  return e.featureTarget.properties['draw:meta'] === Constants.meta.FEATURE;
}

export function isVertex(e) {
  const featureTarget = e.featureTarget;
  if (!featureTarget) return false;
  if (!featureTarget.properties) return false;
  return featureTarget.properties['draw:meta'] === Constants.meta.VERTEX;
}

export function isMidPoint(e) {
  const featureTarget = e.featureTarget;
  if (!featureTarget) return false;
  if (!featureTarget.properties) return false;
  return featureTarget.properties['draw:meta'] === Constants.meta.MIDPOINT;
}

export function isShiftDown(e) {
  if (!e.originalEvent) return false;
  return e.originalEvent.shiftKey === true;
}

// ESC键
export function isEscapeKey(e) {
  return e.keyCode === 27;
}

// Enter键
export function isEnterKey(e) {
  return e.keyCode === 13;
}

// Delete键
export function isDeleteKey(e) {
  return e.keyCode === 46;
}

export function isTrue() {
  return true;
}
