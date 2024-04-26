<template>
	<el-container class="home">
		<el-header class="header">
			<div>首页单页面导航</div>
		</el-header>
		<el-main>
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="销项发票" name="first">
					<button-search @func="allSearch"> </button-search>
					<el-row :gutter="0">
						<el-col :span="8" :offset="16">
							<div class="btn-group">
								<el-button type="text" size="medium" @click="addEdit()">
									新增发票
									<slot name="right">
										<i class="el-icon-arrow-down"></i>
									</slot>
								</el-button>
								<el-upload action="#" class="inline">
									<el-button size="medium">导入
										<slot name="right">
											<i class="el-icon-arrow-down"></i>
										</slot>
									</el-button>
								</el-upload>
								<el-button size="medium" @click="export_data()">导出
									<slot name="right">
										<i class="el-icon-arrow-down"></i>
									</slot>
								</el-button>
								<el-button size="medium">
									生成凭证
								</el-button>
							</div>

						</el-col>
					</el-row>
					<el-table border class="mt-3" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
						style="width: 100%" @selection-change="handleSelectionChange">
						<!-- <el-table border class="mt-3" :data="tableDatas" style="width: 100%"
						@selection-change="handleSelectionChange" :key="Math.random()"> -->
						<el-table-column type="selection" width="45" align="center">
						</el-table-column>
						<el-table-column prop="a1" align="center" label="发票类型">
						</el-table-column>
						<el-table-column prop="a2" align="center" label="开票日期">
						</el-table-column>
						<el-table-column prop="a3" align="center" label="发票号码">
						</el-table-column>
						<el-table-column prop="a4" align="center" label="客户">
						</el-table-column>
						<el-table-column prop="a5" align="center" label="金额">
						</el-table-column>
						<el-table-column align="center" label="税率">
							<template slot-scope="scope">
								{{scope.row.a6*100}}%
							</template>
						</el-table-column>
						<el-table-column prop="a7" align="center" label="税额">
							<!-- 	<template slot-scope="scope">
								{{(scope.row.a5*scope.row.a6).toFixed(2)}}
							</template> -->
						</el-table-column>
						<el-table-column prop="a8" align="center" label="税价合计">
							<!-- <template slot-scope="scope">
								{{(scope.row.a5*scope.row.a6+scope.row.a5).toFixed(2)}}
							</template> -->
						</el-table-column>
						<el-table-column prop="a9" align="center" label="发票状态">
						</el-table-column>
						<el-table-column align="center" label="凭证号">
							<template slot-scope="scope">
								<div class="blue-text">
									{{scope.row.a10}}
								</div>
							</template>
						</el-table-column>
						<el-table-column align="center" label="操作">
							<template slot-scope="scope">
								<el-button type="text" size="medium" icon="el-icon-edit"
									@click="Edit(scope.$index, scope.row)">
									<slot name="right">
										<i class="el-icon-arrow-down"></i>
									</slot>
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination :current-page="currentPage" :page-sizes="[5,10, ,15, 20, 25]" :page-size="pageSize"
						layout="total, sizes, prev, pager, next, jumper" :total="tableData.length"
						@size-change="handleSizeChange" @current-change="handleCurrenChange">
					</el-pagination>
				</el-tab-pane>
				<el-tab-pane label="进项发票" name="second">进项发票</el-tab-pane>
				<el-tab-pane label="其他发票" name="third">其他发票</el-tab-pane>
			</el-tabs>
		</el-main>
		<el-dialog :title="centerDialogVisibleTitle" :visible.sync="centerDialogVisible" center :show-close="false">
			<el-form :model="form" :rules="rules" ref="form" label-width="80px" size="medium">
				<el-form-item label="发票类型" prop="a1">
					<el-input v-model="form.a1"></el-input>
				</el-form-item>
				<el-form-item label="开票日期" prop="a2">
					<el-date-picker v-model="form.a2" type="date" placeholder="选择日期" format="yyyy-MM-dd "
						value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="发票号码" prop="a3">
					<el-input v-model="form.a3"></el-input>
				</el-form-item>
				<el-form-item label="客户" prop="a4">
					<el-input v-model="form.a4"></el-input>
				</el-form-item>
				<el-form-item label="金额" prop="a5">
					<el-input v-model="form.a5" type="number"></el-input>
				</el-form-item>
				<el-form-item label="税率" prop="a6">
					<el-input v-model="form.a6" type="number"></el-input>
				</el-form-item>
				<el-form-item label="发票状态" prop="a9">
					<el-input v-model="form.a9"></el-input>
				</el-form-item>
				<el-form-item label="凭证号" prop="a10">
					<el-input v-model="form.a10"></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addData">{{editText}}</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
	import buttonSearch from "@/components/common/button-search.vue"
	export default {
		components: {
			buttonSearch
		},
		data() {
			return {
				activeName: 'first',
				search: '',
				tableData: [],
				currentPage: 1,
				pageSize: 5,
				multipleSelection: '',
				centerDialogVisible: false,
				centerDialogVisibleTitle: '增加',
				form: {
					a1: '',
					a2: '',
					a3: '',
					a4: '',
					a5: '',
					a6: '',
					a7: '',
					a8: '',
					a9: '',
					a10: ''
				},
				rules: {
					a1: [{
						required: true,
						message: '请输入发票类型',
						trigger: 'blur'
					}],
					a2: [{
						required: true,
						message: '请选择开票日期',
						trigger: 'blur'
					}],
					a3: [{
						required: true,
						message: '请输入发票号码',
						trigger: 'blur'
					}],
					a4: [{
						required: true,
						message: '请输入客户名',
						trigger: 'blur'
					}],
					a5: [{
						required: true,
						message: '请输入金额',
						trigger: 'blur'
					}],
					a6: [{
						required: true,
						message: '请输入税率',
						trigger: 'blur'
					}],
					a9: [{
						required: true,
						message: '请输入发票状态',
						trigger: 'blur'
					}],
					a10: [{
						required: true,
						message: '请输入凭证号',
						trigger: 'blur'
					}]
				},
				editIndex:'',
				editText:'确定'
			}
		},
		methods: {
			handleClick(tab, event) {
				// console.log(tab, event);
			},
			allSearch(data) {
				this.search = data;
				// console.log(this.search)
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				// console.log(this.multipleSelection);
			},

			addData() {
				if(this.editText=='修改'){
					this.form.a6 = parseFloat(this.form.a6 / 100);
					this.form.a7 = parseFloat(this.form.a5 * this.form.a6).toFixed(2);
					this.form.a8 = (parseFloat(this.form.a7) + parseFloat(this.form.a5)).toFixed(2);
					this.tableData[this.editIndex]=this.form;
					this.centerDialogVisible = false;
					return;
				}
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.form.a6 = parseFloat(this.form.a6 / 100);
						this.form.a7 = parseFloat(this.form.a5 * this.form.a6).toFixed(2);
						this.form.a8 = (parseFloat(this.form.a7) + parseFloat(this.form.a5)).toFixed(2);
						this.tableData.push(this.form);
						this.centerDialogVisible = false;
						this.form = {
							a1: '',
							a2: '',
							a3: '',
							a4: '',
							a5: '',
							a6: '',
							a7: '',
							a8: '',
							a9: '',
							a10: ''
						}
					} else {
						this.$message.error('请输入必填项');
						return false;
					}
				});
			},
			addEdit() {
				this.form = {
					a1: '',
					a2: '',
					a3: '',
					a4: '',
					a5: '',
					a6: '',
					a7: '',
					a8: '',
					a9: '',
					a10: ''
				}
				this.editText="增加";
				this.centerDialogVisibleTitle="确认";
				this.centerDialogVisible = true;
			},
			Edit(e, a) {
				this.form = {
					a1: '',
					a2: '',
					a3: '',
					a4: '',
					a5: '',
					a6: '',
					a7: '',
					a8: '',
					a9: '',
					a10: ''
				}
				console.log(e);
				this.editIndex=e;
				if(this.currentPage>1){
					this.editIndex=(this.currentPage-1)*this.pageSize+e;
				}
				this.editText="修改";
				this.centerDialogVisibleTitle="修改数据";
				console.log(this.editIndex);
				console.log(this.tableData);
				// 利用 JSON.stringify 将 js 对象序列化（JSON字符串），再使用 JSON.parse 来反序列化（还原） js 对象。序列化的作用是存储和传输
				// 解决表单的数据被改变，表格中相对应的数据也会直接跟着改变
				this.form=JSON.parse(JSON.stringify(this.tableData[this.editIndex]));
				this.form.a6=this.form.a6*100;
				this.centerDialogVisible = true;
				// console.log(a);
			},
			handleSizeChange(val) {
				// console.log(`每页${val}条`);
				this.currentPage = 1;
				this.pageSize = val;
				// this.tableDatas
			},
			handleCurrenChange(val) {
				// console.log(`当前页：${val}`);
				this.currentPage = val;
			},
			//导出报表使用的数据json
			formatJson(filterVal, jsonData) {
				// console.log(jsonData)
				return jsonData.map(v => filterVal.map(j => {
					if (j === 'timestamp') {
						// return parseTime(v[j])
						return v[j]
					} else {
						return v[j]
					}
				}))
			},
			//导出报表方法
			export_data() {
				if(this.tableData.length==0){
					this.$message.error('暂无数据')
					return;
				}
				//当前时间获取
				import('@/vendor/Export2ExcelStyle').then(excel => {
					const tHeader = ['发票类型', '开票日期', '发票号码', '客户', '金额', '税率', '税额', '税价合计', '发票状态']; //表头
					const filterVal = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9']; //表头对应字段
					var list = this.tableData;
					const data = this.formatJson(filterVal, list)
					excel.export_json_to_excel({
						title: ["发票明细(单位：元)"],
						header: tHeader,
						data,
						headerStyle: ['A2', 'I2'], //自定义列标题左右样式
						SheetJS: '发票明细', //工作簿名字
						merges: ["A1:I1"], //控制表名字从几到达几。
						bottomTips: ["报表生成时间：" + this.$util.getCurrentDate(2), '', '', '', '', '', '', '',
							''
						],
						filename: "发票明细",
						autoWidth: true,
						bookType: 'xlsx'
					})
				})
			},
		}
	}
</script>
<style scoped>
	.header {
		line-height: 60px;
		text-align: center;
	}

	.home {
		width: 80%;
		margin: 0 auto;
	}

	/deep/ .el-tabs__item.is-top:nth-child(2) {
		padding-left: 20px;
	}

	/deep/ .el-tabs__item.is-top:last-child {
		padding-right: 20px;
	}

	/deep/ .el-tabs__item.is-active {
		color: #ffffff;
		background-color: #409EFF;
		border-radius: 5px 5px 0 0;
	}

	.btn-group {
		margin: 20px 0;
	}

	.blue-text {
		text-decoration: underline;
		color: #409EFF;
	}

	.inline {
		display: inline-block;
		margin: 0 10px;
	}
</style>
