<cn>
#### ScrollZoom地图旋转倾斜
对地图全局旋转倾斜交互进行禁用/启用控制。
</cn>

<us>
#### basic
xx.
</us>

```tpl
<template>
	<div class="component-wrapper-container">
		<pj-map bordered height="520" 
				config="../MapConfig/examples/basic.json" 
				@loaded="handleMapLoaded">
		</pj-map>
		<div class="map-toolbar-container">
			<a-button-group>
				<a-button :disabled="disabled" type="primary" @click="toggleMapHandler(true)">启用</a-button>
				<a-button :disabled="disabled" type="primary" @click="toggleMapHandler(false)">禁用</a-button>
			</a-button-group>
		</div>
	</div>
</template>

<script>
  export default {
		data () {
			return {
				iMapApi: null,
				disabled: true,
			}
		},
		methods: {
			// 执行地图Map渲染完成时回调
			handleMapLoaded(iMapApi) {
				this.iMapApi = iMapApi;
				// 解除Butoon组件禁用状态
				this.disabled = false;
			},

			// 切换禁/启用地图交互功能
			toggleMapHandler(enable) {
				// 地图滚轮缩放对象
				const scrollZoom = this.iMapApi.Handlers.scrollZoom;
				// 判断交互功能的禁/启用
				if (enable) {
					scrollZoom.enable();
				} else {
					scrollZoom.disable();
				}
			},
		}
	}
</script>

<style scoped>
	.component-wrapper-container {
		position: relative;
	}
	.map-toolbar-container {
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>
```
