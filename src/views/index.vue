<template>
	<div>
		<span v-on:click="ac()">{{ceshi}}</span>
		<span v-show="isshow">
			<input type="text" v-model="counts" v-on:blur="sq" ref="ipt">
		</span>
		<span v-on:click="asd()"></span>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				isshow:false,
				ceshi:'测试获取焦点',
				counts:''
			}
		},
		methods:{
			ac(){
				this.isshow=true;
				this.$nextTick(()=>{
					this.$refs.ipt.focus();
				})
				
			},
			asd(){
				
			}
		}
	}
</script>

<style>
</style>