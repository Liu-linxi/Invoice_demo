/* eslint-disable */
import {
	saveAs
} from 'file-saver'
// import XLSX from 'xlsx'
import XLSX from "xlsx-style";

function generateArray(table) {
	var out = [];
	var rows = table.querySelectorAll('tr');
	var ranges = [];
	for (var R = 0; R < rows.length; ++R) {
		var outRow = [];
		var row = rows[R];
		var columns = row.querySelectorAll('td');
		for (var C = 0; C < columns.length; ++C) {
			var cell = columns[C];
			var colspan = cell.getAttribute('colspan');
			var rowspan = cell.getAttribute('rowspan');
			var cellValue = cell.innerText;
			if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

			//Skip ranges
			ranges.forEach(function(range) {
				if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e
					.c) {
					for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
				}
			});

			//Handle Row Span
			if (rowspan || colspan) {
				rowspan = rowspan || 1;
				colspan = colspan || 1;
				ranges.push({
					s: {
						r: R,
						c: outRow.length
					},
					e: {
						r: R + rowspan - 1,
						c: outRow.length + colspan - 1
					}
				});
			};

			//Handle Value
			outRow.push(cellValue !== "" ? cellValue : null);

			//Handle Colspan
			if (colspan)
				for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
		}
		out.push(outRow);
	}
	return [out, ranges];
};

function datenum(v, date1904) {
	if (date1904) v += 1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {
		s: {
			c: 10000000,
			r: 10000000
		},
		e: {
			c: 0,
			r: 0
		}
	};
	for (var R = 0; R != data.length; ++R) {
		for (var C = 0; C != data[R].length; ++C) {
			if (range.s.r > R) range.s.r = R;
			if (range.s.c > C) range.s.c = C;
			if (range.e.r < R) range.e.r = R;
			if (range.e.c < C) range.e.c = C;
			var cell = {
				v: data[R][C]
			};
			if (cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({
				c: C,
				r: R
			});

			if (typeof cell.v === 'number') cell.t = 'n';
			else if (typeof cell.v === 'boolean') cell.t = 'b';
			else if (cell.v instanceof Date) {
				cell.t = 'n';
				cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			} else cell.t = 's';

			ws[cell_ref] = cell;
		}
	}
	if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

function Workbook() {
	if (!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

export function export_table_to_excel(id) {
	var theTable = document.getElementById(id);
	var oo = generateArray(theTable);
	var ranges = oo[1];

	/* original data */
	var data = oo[0];
	var ws_name = "SheetJS";

	var wb = new Workbook(),
		ws = sheet_from_array_of_arrays(data);

	/* add ranges to worksheet */
	// ws['!cols'] = ['apple', 'banan'];
	ws['!merges'] = ranges;

	/* add worksheet to workbook */
	wb.SheetNames.push(ws_name);
	wb.Sheets[ws_name] = ws;

	var wbout = XLSX.write(wb, {
		bookType: 'xlsx',
		bookSST: false,
		type: 'binary'
	});

	saveAs(new Blob([s2ab(wbout)], {
		type: "application/octet-stream"
	}), "test.xlsx")
}

// 主要修改内容在这里
export function export_json_to_excel({
	title, // 新增的参数，表格标题
	SheetJS,
	multiHeader = [],
	header,
	headerStyle,
	bottomTips,
	data,
	filename,
	merges = [],
	autoWidth = true,
	bookType = 'xlsx'
} = {}) {
	/* original data */
	filename = filename || 'excel-list'
	data = [...data]
	data.unshift(header);

	for (let i = multiHeader.length - 1; i > -1; i--) {
		data.unshift(multiHeader[i])
	}
	data.unshift(title); // 自定义表格标题
	data.push(bottomTips);
	// console.log(data);
	var ws_name = SheetJS;
	var wb = new Workbook(),
		ws = sheet_from_array_of_arrays(data);

	if (merges.length > 0) {
		if (!ws['!merges']) ws['!merges'] = [];
		merges.forEach(item => {
			ws['!merges'].push(XLSX.utils.decode_range(item))
		})
	}

	if (autoWidth) {
		/*设置worksheet每列的最大宽度*/
		const colWidth = data.map(row => row.map(val => {
			/*先判断是否为null/undefined*/
			if (val == null) {
				return {
					'wch': 10
				};
			}
			// else if(val.toString().charCodeAt(0) >= 25253){
			// 	return {
			// 		'wch': 10
			// 	};
			// }
			else if(val.toString().indexOf("请勿编辑")>0||val.toString().indexOf("生成时间")>0){
				return {
					'wch': 15
				};
			}
			/*再判断是否为中文*/
			else if (val.toString().charCodeAt(0) > 255) {
				return {
					'wch': val.toString().length * 2
				};
			} else {
				return {
					'wch': val.toString().length
				};
			}
		}))
		/*以主表第二行为初始值，因为我的第一行是表格标题，会比较长，所以以主表第二行为初始值*/
		/*以第一行为初始值*/
		let result = colWidth[1];
		for (let i = 1; i < colWidth.length; i++) {
			for (let j = 0; j < colWidth[i].length; j++) {
				if (result[j]['wch'] < colWidth[i][j]['wch']) {
					result[j]['wch'] = colWidth[i][j]['wch'];
				}
			}
		}
		ws['!cols'] = result;
	}

	/* add worksheet to workbook */
	wb.SheetNames.push(ws_name);
	wb.Sheets[ws_name] = ws;


	var dataInfo = wb.Sheets[wb.SheetNames[0]];
	// 设置单元格框线
	const borderAll = {
		top: {
			style: "thin",
			color: {
				rgb: "5186e8"
			}
		},
		bottom: {
			style: "thin",
			color: {
				rgb: "5186e8"
			}
		},
		left: {
			style: "thin",
			color: {
				rgb: "5186e8"
			}
		},
		right: {
			style: "thin",
			color: {
				rgb: "5186e8"
			}
		}
	};

	// 给所有单元格加上边框，内容居中，字体，字号，标题表头特殊格式部分后面替换
	for (var i in dataInfo) {
		if (
			i == "!ref" ||
			i == "!merges" ||
			i == "!cols" ||
			i == "!rows" ||
			i == "A1"
		) {} else {
			dataInfo[i + ""].s = {
				border: borderAll,
				alignment: {
					horizontal: "center",
					vertical: "center"
				},
				font: {
					name: "微软雅黑",
					sz: 10,
					color: {
						rgb: "333f4f"
					}
				}
			};
		}
	}

	// 设置表格样式
	const arrabc = ["A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z"
	]
	// 底部操作
	//合并单元起
	let start = 'A' + data.length;
	// 获取列下标
	let endindex = bottomTips.length - 1;
	let end = arrabc[endindex] + data.length;
	let mergess = [];
	// 自定义底部合并单元格
	if (data[data.length - 1].length > 0) {
		mergess.push(start + ":" + end);
		mergess.forEach(item => {
			//合并单元格
			ws['!merges'].push(XLSX.utils.decode_range(item))
		})
	}
	//自定义底部合并最左侧单元格样式
	dataInfo[start].s = {
		border: {
			left: {
				style: "thin",
				color: {
					rgb: "5186e8"
				}
			},
			bottom: {
				style: "thin",
				color: {
					rgb: "5186e8"
				}
			}
		},
		font: {
			name: "微软雅黑",
			sz: 11,
			color: {
				rgb: "333f4f"
			}
		},
		alignment: {
			horizontal: "right",
			vertical: "center"
		}
	}
	// 给标题、表格描述信息、表头等部分加上特殊格式
	arrabc.some(function(v) {
		for (let j = 1; j < multiHeader.length + 3; j++) {
			const _v = v + j
			if (dataInfo[_v]) {
				dataInfo[_v].s = {};

				// 标题部分A1-Z1
				if (j == 1) {
					dataInfo[v + j].s = {
						font: {
							name: "微软雅黑",
							sz: 16,
							color: {
								rgb: "ffffff" //标题颜色
							},
							bold: true,
							italic: false,
							underline: false
						},
						fill: { //背景颜色
							fgColor: {
								rgb: "5081EB"
							},
						},
						alignment: {
							horizontal: "center",
							vertical: "center"
						}
					};
				}
				// 表头部分,根据表头特殊格式设置
				else {
					// multiHeader.length = 0 时表头没有合并单元格，表头只占1行A2-Z2
					if (multiHeader.length == 0) {
						const fv = v + (multiHeader.length + 2)
						dataInfo[fv].s = {
							border: borderAll,
							font: {
								name: "微软雅黑",
								sz: 11,
								bold: true
							},
							fill: {
								fgColor: {
									rgb: "BCD7EF"
								},
							},
							alignment: {
								horizontal: "center",
								vertical: "center"
							}
						}
					}
					// multiHeader.length = 1 时表头有合并单元格，表头只占2行A2-Z2，A3-Z3，这是没有描述信息只有表头合并的
					else if (multiHeader.length == 1) {
						dataInfo[v + j].s = {
							border: borderAll,
							font: {
								// name: "微软雅黑",
								sz: 11,
							},
							alignment: {
								horizontal: "center",
								vertical: "center"
							},
							fill: {
								fgColor: {
									rgb: "55ff7f"
								}
							},
						}
					}
					// multiHeader.length>1 时表头有合并单元格，表头多行
					else {
						dataInfo[v + j].s = {
							// border: borderAll,
							font: {
								name: "微软雅黑",
								sz: 11,
							},
							alignment: {
								horizontal: "left",
								vertical: "center"
							},
							fill: {
								fgColor: {
									rgb: "ffaaff"
								}
							},
						}
					}
				}
				// multiHeader.length + 2 是表头的最后1行
				dataInfo[v + (multiHeader.length + 2)].s = {
					// border: borderAll,
					font: {
						name: "微软雅黑",
						sz: 12,
					},
					alignment: {
						horizontal: "center",
						vertical: "center"
					},
					fill: {
						fgColor: {
							rgb: "bdd7ee"
						}
					},
				}
			}
		}
	});
	// 列标题左侧数据自定义
	dataInfo[headerStyle[0]].s = {
		border: {
			left: {
				style: "thin",
				color: {
					rgb: "5186e8"
				}
			}
		},
		font: {
			name: "微软雅黑",
			sz: 11,
		},
		alignment: {
			horizontal: "center",
			vertical: "center"
		},
		fill: {
			fgColor: {
				rgb: "bdd7ee"
			}
		},
	}
	//列标题右侧数据自定义
	dataInfo[headerStyle[1]].s = {
		border: {
			right: {
				style: "thin",
				color: {
					rgb: "5186e8"
				}
			}
		},
		font: {
			name: "微软雅黑",
			sz: 11,
		},
		alignment: {
			horizontal: "center",
			vertical: "center"
		},
		fill: {
			fgColor: {
				rgb: "bdd7ee"
			}
		},
	}
	var wbout = XLSX.write(wb, {
		bookType: bookType,
		bookSST: false,
		type: "binary"
	});
	saveAs(
		new Blob([s2ab(wbout)], {
			type: "application/octet-stream"
		}),
		`${filename}.${bookType}`
	);
}
