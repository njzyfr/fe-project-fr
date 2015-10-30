//*******数据库设计************

/**
 *
 * 使用数据库的思想，构建3张表。
 * cateJson 分类
 * cateChildJson 子分类
 * taskJson 任务
 *
 * 分类表 cate
 * ----------------------
 * id* | name | child(fk)
 * ----------------------
 *
 * 子分类表 cateChild
 * ----------------------------
 * id* | pid | name | child(fk)
 * ----------------------------
 *
 * 任务表 task
 * ------------------------------------------
 * id* | pid | finish | name | date | content
 * ------------------------------------------
 */

/*
初始化数据库即初始化localStorage
 */
function initDataBase() {
	// localStorage.clear();
	if(!localStorage.cate || !localStorage.cateChild || !localStorage.task) {
		var cateJson = [{
			"id": 0,
			"name":"默认分类",
			"cid": [0]
		}
		// ,{
		// 	"id": 1,
		// 	"name":"百度",
		// 	"cid": []			
		// }
		// ,{
		// 	"id": 2,
		// 	"name":"腾讯",
		// 	"cid": [1, 2]
		// }
		// ,{
		// 	"id": 3,
		// 	"name":"网易",
		// 	"cid": [3]			
		// }
		];

		var cateChildJson = [{
			"id": 0,
			"pid": 0,
			"name": "默认子分类",
			"cid":[0]
		}
		// ,{
		// 	"id": 1,
		// 	"pid": 2,
		// 	"name": "CSS",
		// 	"cid":[1,2,3]
		// }
		// ,{
		// 	"id": 2,
		// 	"pid": 2,
		// 	"name": "jade",
		// 	"cid":[]			
		// }
		// ,{
		// 	"id": 3,
		// 	"pid": 3,
		// 	"name": "java",
		// 	"cid":[]			
		// }
		];

		var taskJson = [{
			"id": 0,
			"pid": 0,
			"finish": 'finished',
			"name": "使用说明",
			"date": "2015-10-22",
			"content": "本应用为离线应用，数据将存储在本地硬盘<br>左侧为分类列表<br>中间为当前分类下的任务列表<br>右侧为任务详情<br>可以添加删除分类，添加任务，修改任务，以及给任务标记是否完成等功能<br>"
		}
		// ,{
		// 	"id": 1,
		// 	"pid": 1,
		// 	"finish": 'unfinished',
		// 	"name": "css1",
		// 	"date": "2015-10-22",
		// 	"content": "本应用为离线应用"			
		// }
		// ,{
		// 	"id": 2,
		// 	"pid": 1,
		// 	"finish": 'unfinished',
		// 	"name": "css2",
		// 	"date": "2015-10-24",
		// 	"content": "本应用为离线"			
		// },
		// {
		// 	"id": 3,
		// 	"pid": 1,
		// 	"finish": 'finished',
		// 	"name": "css3",
		// 	"date": "2015-10-24",
		// 	"content": "本应用为离线"		
		// }
		];
		localStorage.cate = JSON.stringify(cateJson);//把JSON数据转换为字符串，存储在localStorage里
		localStorage.cateChild = JSON.stringify(cateChildJson);
		localStorage.task = JSON.stringify(taskJson);
	}
}

/*
操作数据库，增删改查
 */
function ManiDatabase() {
	//把localStorage里的内容转换为JSON数据，方便进行数组的操作
	var cate = JSON.parse(localStorage.cate),
		cateChild = JSON.parse(localStorage.cateChild),
		task = JSON.parse(localStorage.task);
	/*增*/
	/*增加主分类*/
	function addCate(name) {
		for(var i = 0, len = cate.length; i < len; i++) {
			if(name == cate[i].name) {
				return false;
			}
		}
		var newCate = {};
		newCate.id = cate[cate.length - 1].id + 1;
		newCate.name = name;
		newCate.cid = [];
		cate.push(newCate);
		localStorage.cate = JSON.stringify(cate);
		return true;

	}
	/*增加子分类*/
	function addCateChild(pid, name) {
		//判断输入的子分类名称是否重复
		//找到pid主分类对应的所有子分类名称
		var childArr = [];
		for(var i = 0, len = cateChild.length; i < len; i++) {
			if(pid == cateChild[i].pid) {
				childArr.push(cateChild[i].name);
			}
		}
		
		for(var j = 0, lenChild = childArr.length; j < lenChild; j++) {
			if(name == childArr[j]) {
				return false;
			}
		}
		//不重复后添加该子分类
		var newCateChild = {};
		newCateChild.id = cateChild[cateChild.length - 1].id + 1;
		newCateChild.pid = pid;
		newCateChild.name = name;
		newCateChild.cid = [];
		cateChild.push(newCateChild);
		localStorage.cateChild = JSON.stringify(cateChild);
		//更新子分类对应的主分类的cid信息
		for(var k = 0, lenCate = cate.length; k < lenCate; k++) {
			if(pid == cate[k].id) {
				cate[k].cid.push(newCateChild.id);
				localStorage.cate = JSON.stringify(cate);
				return true;
			}
		}
	}
	/*增加任务*/
	function addTask(taskObj) {
		//判断输入的任务名称是否重复
		//找到子分类对应的所有任务名称
		var taskArr = [];
		for(var i = 0, len = task.length; i < len; i++) {
			if(taskObj.pid == task[i].pid) {
				taskArr.push(task[i].name);
			}
		}

		for(var j = 0, lenTask = taskArr.length; j < lenTask; j++) {
			if(taskObj.name == taskArr[j]) {
				return false;//输入的任务名称重复
			}
		}
		//不重复后添加该任务
		task.push(taskObj);
		localStorage.task = JSON.stringify(task);
		//更新任务对应的子分类的cid信息
		for(var k = 0, lenChild = cateChild.length; k < lenChild; k++) {
			if(taskObj.pid == cateChild[k].id) {
				cateChild[k].cid.push(taskObj.id);
				localStorage.cateChild = JSON.stringify(cateChild);
				return true;
			}
		}
	}

	/*删*/
	/*删除主分类*/
	function delCate(id) {
		for(var i = 0, len = cate.length; i < len; i++) {
			if(id == cate[i].id) {
				var cateDel = cate.splice(i, 1);
				//删除对应的子分类
				var lenChild = cateDel[0].cid.length,
					flagCate = false;//在删除子分类时是否更新主分类
				if(lenChild){
					for(var j = 0; j < lenChild; j++) {
						delCateChild(cateDel[0].cid[j], flagCate);
					}
				}	
				localStorage.cate = JSON.stringify(cate);
				return;
			}
		}
		
	}
	/*删除子分类*/
	function delCateChild(id, flagCate) {
		for(var i = 0, len = cateChild.length; i < len; i++) {
			if(id == cateChild[i].id) {
				var childDel = cateChild.splice(i,1);
				//更新子分类对应主分类的cid信息
				if(flagCate) {
					updateCateByDel(childDel[0].pid, id);
				}
				//删除对应的task
				var lenTask = childDel[0].cid.length,
					flagChild = false;//删除任务时是否需要更新子分类
				if(lenTask) {
					for(var j = 0; j < lenTask; j++) {
						delTask(childDel[0].cid[j], flagChild);
					}
				}
				localStorage.cateChild = JSON.stringify(cateChild);
				return;		
			}
		}
	}
	/*删除task*/
	function delTask(id, flagChild) {
		for(var i = 0, len = task.length; i < len; i++) {
			if(id == task[i].id) {
				var taskDel = task.splice(i,1);
				if(flagChild) {
					updateCateChildByDel(taskDel[0].pid,id);
				}
				localStorage.task = JSON.stringify(task);
				return;
			}
		}
	}

	/*查*/
	/*查每个分类未完成任务数*/
	//查询所有未完成任务数
	function queryUnTaskAll() {
		var result = 0;
		for(var i = 0, len = cate.length; i < len; i++) {
			result += queryUnTaskLenByCate(cate[i].id);
		}
		return result;
	}
	//查询主分类未完成任务数
	function queryUnTaskLenByCate(id) {
		var cateChildArr = [],
			result = 0;
		for(var i = 0, len = cate.length; i < len; i++) {
			if(id == cate[i].id) {
				cateChildArr = cate[i].cid;
				 for(var j = 0, lenChild = cateChildArr.length; j < lenChild; j++) {
					result += queryUnTaskLenByCateChild(cateChildArr[j]);
				}
			return result;		
			}
		}
	}
	//查询子分类未完成任务数
	function queryUnTaskLenByCateChild(id) {
		var taskArr = [],
			result = 0;
		for(var i = 0, len = task.length; i < len; i++) {
			if(id == task[i].pid) {
				if(task[i].finish == 'unfinished') {
					result++;
				}
			}
		}
		return result;
	}
	//通过子分类id查询其名字
	function queryCateChildNameByChildId(id) {
		for(var i = 0, len = cateChild.length; i < len; i++) {
			if(id == cateChild[i].id) {
				return cateChild[i].name;
			}
		}
	}
	//由主分类id得到其下所有任务
	function queryTaskByCate(currStatus,id) {
		var taskArr = [];
		if(id == -1) {
			for(var i = 0, len = cate.length; i < len; i++) {
				for(var j = 0, lenChild = cate[i].cid.length; j < lenChild; j++) {
					var temp = queryTaskByCateChild(currStatus,cate[i].cid[j]);
					taskArr = taskArr.concat(temp);	
				}
			}
			return taskArr;	
		}else {	
			for(var i = 0, len = cate.length; i < len; i++) {
				if(id == cate[i].id) {
					for(var j = 0, lenChild = cate[i].cid.length; j < lenChild; j++) {
						var temp = queryTaskByCateChild(currStatus,cate[i].cid[j]);
						taskArr = taskArr.concat(temp);	
					}
					// console.log(taskArr);
					return taskArr;
				}
			}
		}
	}
	//由子分类id得到其下所有任务
	function queryTaskByCateChild(currStatus,id) {
		var taskArr = [];
		for(var i = 0, len = cateChild.length; i < len; i++) {
			if(id == cateChild[i].id) {
				for(var j = 0, lenChild = cateChild[i].cid.length; j < lenChild; j++) {
					var detail = queryTaskByTask(cateChild[i].cid[j]);
					if(currStatus == 0) {
						taskArr.push(detail);
					}else if(currStatus == 1) {
						if(detail.finish == 'unfinished') {
							taskArr.push(detail);
						}
					}else if(currStatus == 2) {
						if(detail.finish == 'finished') {
							taskArr.push(detail);
						}
					}	
				}
				return taskArr;
			}
		}	
	}
	//由任务id得到任务详细信息
	function queryTaskByTask(id) {
		for(var i = 0, len = task.length; i < len; i++) {
			if(id == task[i].id) {
				return task[i];
			}
		}
	}
	/*改*/
	/*更改任务的完成状态*/ 
	function updateTaskStatus(id) {
		for(var i = 0, len = task.length; i < len; i++) {
			if(id == task[i].id) {
				task[i].finish = 'finished';
			}
			localStorage.task = JSON.stringify(task);
		}
	}
	/*更改任务的信息*/
	function updateTaskDetail(taskObj) {
		var detail = queryTaskByTask(taskObj.id);
		var taskArr = [];
		for(var k = 0, lenTask = task.length; k < lenTask; k++) {
			if(detail.pid == task[k].pid) {
				taskArr.push(task[k]);
			}
		}
		for(var j = 0, lenTaskArr = taskArr.length; j < lenTaskArr; j++) {
			if(taskObj.name == taskArr[j].name && taskObj.name != detail.name) {
				return false;
			}
		}
		for(var i = 0, len = task.length; i < len; i++) {
			if(taskObj.id == task[i].id) {
				task[i].name = taskObj.name;
				task[i].date = taskObj.date;
				task[i].content = taskObj.content;
			}
			localStorage.task = JSON.stringify(task);
			return true;
		}
	}

	/*功能*/
	/*更新子分类对应主分类的cid信息*/
	function updateCateByDel(pid, id) {
		for(var i = 0, len = cate.length; i < len; i++) {
			if(pid == cate[i].id) {
				for(var j = 0, lenChild = cate[i].cid.length; j < lenChild; j++) {
					if(id == cate[i].cid[j]) {
						cate[i].cid.splice(j, 1);
						localStorage.cate = JSON.stringify(cate);
						return;
					}
				}
			}
		}
	}
	/*更新任务对应子分类的cid信息*/
	function updateCateChildByDel(pid,id) {
		for(var i = 0, len = cateChild.length; i < len; i++) {
			if(pid == cateChild[i].id) {
				for(var j = 0, lenTask = cateChild[i].cid.length; j < lenTask; j++) {
					if(id == cateChild[i].cid[j]) {
						cateChild[i].cid.splice(j,1);
						localStorage.cateChild = JSON.stringify(cateChild);
						return;
					}
				}
			}
		}
	}
	/*创建任务时间表*/
	function createDateData(taskArr) {
		var dateArr = [],
			dateTaskArr = [];
		for(var i = 0, len = taskArr.length; i < len; i++) {
			if(dateArr.indexOf(taskArr[i].date) == -1) {
				dateArr.push(taskArr[i].date);
			}
		}
		// console.log(dateArr);
		dateArr = dateArr.sort();
		// console.log(dateArr);
		for(var j = 0, lenDate = dateArr.length; j < lenDate; j++) {
			var dateTaskObj = {};
			dateTaskObj.date = dateArr[j];
			dateTaskObj.task = queryTaskByDate(dateArr[j], taskArr);
			dateTaskArr.push(dateTaskObj);
		}	
		// console.log(dateTaskArr);
		return dateTaskArr;
	}
	/*根据时间查找任务*/
	function queryTaskByDate(date, tasks) {
		var taskOneDate = [];
		for(var i = 0, len = tasks.length; i < len; i++) {
			if(date == tasks[i].date) {
				taskOneDate.push(tasks[i]);
			}
		}
		return taskOneDate;
	}

	return {
		addCate: function(name) {
			return addCate(name);
		},
		addCateChild: function(pid, name) {
			return addCateChild(pid, name);
		},
		addTask: function(taskObj) {
			return addTask(taskObj);
		},
		delCate: function(id) {
			return delCate(id);
		},
		delCateChild: function(id, flagCate) {
			return delCateChild(id, flagCate);
		},
		delTask: function(id, flagChild) {
			return delTask(id,flagChild);
		},
		queryUnTaskAll: function() {
			return queryUnTaskAll();
		},
		queryUnTaskLenByCate: function(id) {
			return queryUnTaskLenByCate(id);
		},
		queryUnTaskLenByCateChild: function(id) {
			return queryUnTaskLenByCateChild(id);
		},
		queryCateChildNameByChildId: function(id) {
			return queryCateChildNameByChildId(id);
		},
		queryTaskByCate: function(currStatus, id) {
			return queryTaskByCate(currStatus,id);
		},
		queryTaskByCateChild: function(currStatus, id) {
			return queryTaskByCateChild(currStatus,id);
		},
		queryTaskByTask: function(id) {
			return queryTaskByTask(id);
		},
		updateTaskStatus: function(id) {
			return updateTaskStatus(id);
		},
		updateTaskDetail: function(taskObj) {
			return updateTaskDetail(taskObj);
		},
		createDateData: function (taskArr) {
			return createDateData(taskArr);
		}
	}
}