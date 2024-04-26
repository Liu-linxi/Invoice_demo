<template>
	<div>
		<el-form inline ref="form" :model="form" label-width="80px">
			<el-form-item label="开票日期" class="">
				<el-date-picker size="medium" v-model="form.time" type="daterange" range-separator="至"
					start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="发票号码" class="">
				<el-input v-model="form.code" placeholder="发票号码" size="medium"></el-input>
			</el-form-item>
			<el-form-item label="发票类型" class="">
				<el-select v-model="form.type" size="medium" placeholder="全部">
					<el-option label="全部" value="shanghai"></el-option>
					<el-option label="未开具发票" value="shanghai"></el-option>
					<el-option label="增值税发票" value="beijing"></el-option>
				</el-select>
			</el-form-item>
			<!-- -->
			<template v-if="search">
				<el-form-item label="发票状态" class="">
					<el-select v-model="form.state" size="medium" placeholder="全部">
						<el-option label="全部" value="shanghai"></el-option>
						<el-option label="状态一" value="shanghai"></el-option>
						<el-option label="状态二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="客户名称" class="">
					<el-select v-model="form.name" size="medium" placeholder="客户档案" @blur="sendMsg">
						<el-option label="全部" value="shanghai"></el-option>
						<el-option label="状态一" value="shanghai"></el-option>
						<el-option label="状态二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
			</template>
			<el-form-item class="right" v-if="!search">
				<el-button type="info" size="medium" @click="hideseach">
					高级搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="icon">
			<i class="el-icon-top" v-if="search" @click="hideseach"></i>
		</div>
	</div>
</template>

<script scoped>
	export default {
		data() {
			return {
				form: {
					time: "",
					name: "",
					code: "",
					type: "",
					state: "",
					name: ""
				},
				search: false
			};
		},
		methods: {
			hideseach() {
				this.search = !this.search
			},
			sendMsg() {
				this.$emit('func', this.form)
			}

		}
	};
</script>

<style scoped>
	/deep/ .el-tabs__item.is-top:nth-child(2) {
		padding-left: 20px !important;
	}

	/deep/ .el-tabs__item.is-top:last-child {
		padding-right: 20px !important;
	}

	/deep/ .el-tabs__item.is-active {
		background-color: #409EFF;
		color: #fff;
		border-radius: 5px 5px 0 0 !important;
	}

	.right {
		float: right;
	}

	.icon {
		color: #409EFF;
		text-align: center;
		font-size: 30px;
		cursor: pointer;
		border-bottom: 1px solid #dcdfe6;
	}
</style>
