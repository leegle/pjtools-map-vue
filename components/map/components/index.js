/**
 * @文件说明: 定义地图Map组件的内部子级组件
 * @创建人: pjtools@vip.qq.com
 * @创建时间: 2020-03-11 22:39:51
 */

import { default as PreLoading } from './pre-loading';
import { default as Message } from './message';
import { default as ElementWrapper } from './element-wrapper';
import { default as ComponentWrapper } from './component-wrapper';
import { default as Switcher } from './switcher';

const MapUiComponents = {
  Switcher,
};

export { PreLoading, Message, ElementWrapper, ComponentWrapper, MapUiComponents };
