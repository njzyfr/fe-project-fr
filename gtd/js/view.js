

var data = ManiDatabase(),
	doc = document;
/*
初始化分类列表栏
 */
function initCateList() {
	var cate = JSON.parse(localStorage.cate),
		cateChild = JSON.parse(localStorage.cateChild),
		task = JSON.parse(localStorage.task);
	//所有未完成任务数
	var taskNum = doc.querySelectorAll('.taskNum')[0],
		taskNumber = data.queryUnTaskAll();
	taskNum.innerHTML = ' (' + taskNumber +  ') ';

	//重新渲染分类列表项
	var list = doc.querySelectorAll('.cate')[0],
		tempStr = '';
	var defaultStr = '<li><h2 data-cate=' + cate[0].id + '><i class="fa fa-folder-open-o"></i>' + cate[0].name + '<span> (' + data.queryUnTaskLenByCate(cate[0].id) + ')</span></h2><ul class="cateChild"><li><h3 data-cateChild=' + cateChild[0].id + '><i class="fa fa-file-o"></i>' + cateChild[0].name + '<span> (' + data.queryUnTaskLenByCateChild(cateChild[0].id) + ')</span></h3></li></ul></li>';
	tempStr += defaultStr;
	
	for(var i = 1, len = cate.length; i < len; i++) {
		var liStr ='';
		if(!cate[i].cid.length) {
			liStr = '<li><h2 data-cate=' + cate[i].id + '><i class="fa fa-folder-open-o"></i>' + cate[i].name + '<span> (' + data.queryUnTaskLenByCate(cate[i].id) + ')</span><i class="fa fa-times"></i></h2></li>';
		}else {
			liStr = '<li><h2 data-cate=' + cate[i].id + '><i class="fa fa-folder-open-o"></i>' + cate[i].name + '<span> (' + data.queryUnTaskLenByCate(cate[i].id) + ')</span><i class="fa fa-times"></i></h2><ul class="cateChild">';
			for( var j = 0, lenChild = cate[i].cid.length; j < lenChild; j++) {
				var innerLiStr = '';
				innerLiStr = '<li><h3 data-cateChild='+ cate[i].cid[j]+ '><i class="fa fa-file-o"></i>' + data.queryCateChildNameByChildId(cate[i].cid[j]) + '<span> (' + data.queryUnTaskLenByCateChild(cate[i].cid[j]) + ')</span><i class="fa fa-times"></i></h3></li>';
				liStr += innerLiStr;
			}
			liStr += '</ul></li>';
		}
		tempStr += liStr;
	}	
	list.innerHTML = tempStr;
}
/*
初始化新增分类的模态框
 */
function initModal() {
	doc.querySelectorAll('.cateNameInput')[0].value ='';
	doc.querySelectorAll('.infoCate')[0].innerHTML = '';
	var cate = JSON.parse(localStorage.cate);
	var select = doc.querySelectorAll('#modalSelect')[0],
		optStr = '';
	optStr += '<option value="-1">新增主分类</option>';
	for(var i = 1, len = cate.length; i < len; i++) {
		optStr += '<option value=' + cate[i].id +'>' + cate[i].name + '</option>';
	}
	select.innerHTML = optStr;
	doc.querySelectorAll('.mask')[0].style.display = 'block';
}

/*
点击模态框确认按钮后页面显示
 */
function confirmModal() {
	var selectValue = document.querySelectorAll('#modalSelect')[0].value;
	if(selectValue == -1) {
		var newCateName = document.querySelectorAll('.cateNameInput')[0].value;
		if(!newCateName) {
			document.querySelectorAll('.infoCate')[0].innerHTML = '输入不能为空';
			return;
		}else {
			var flag = data.addCate(newCateName);
			if(!flag) {
				document.querySelectorAll('.infoCate')[0].innerHTML = '输入主分类名称重复';
				return;
			}else {
				document.querySelectorAll('.mask')[0].style.display = 'none';
				initAll();
				return;
			}	
		}
	}else {
		var newChildName = document.querySelectorAll('.cateNameInput')[0].value;
		if(!newChildName) {
			document.querySelectorAll('.infoCate')[0].innerHTML = '输入不能为空';
			return;
		}else {
			var flag = data.addCateChild(selectValue,newChildName);
			if(!flag) {
				document.querySelectorAll('.infoCate')[0].innerHTML = '输入子分类名称重复';
				return;
			}else {
				document.querySelectorAll('.mask')[0].style.display = 'none';
				initAll();
				return;
			}
		}
	}
}
/*
点击模态框取消按钮后页面显示
 */
function cancelModal() {
	document.querySelectorAll('.mask')[0].style.display = 'none';
}

/*清除分类列表的active*/
function clearCateActive() {
	var h2Elements = document.querySelectorAll('.cateList')[0].getElementsByTagName('h2');
	var h3Elements = document.querySelectorAll('.cateList')[0].getElementsByTagName('h3');
	for(var i = 0, lenh2 = h2Elements.length; i < lenh2; i++) {
		removeClass(h2Elements[i], 'active');
	}
	for(var j = 0, lenh3 = h3Elements.length; j < lenh3; j++) {
		removeClass(h3Elements[j], 'active');
	}
}
/*清楚状态标签的active*/
function clearTagActive() {
	var tagElements = document.querySelectorAll('.statusTag');
	for(var i = 0, len = tagElements.length; i < len; i++) {
		removeClass(tagElements[i], 'active');
	}
}
/*点击左侧分类列表，分类列表变化*/
function toggleCate(element) {
	//点击主分类，子分类展开或收起
	var icon = element.getElementsByTagName('i')[0],
		child = element.parentNode.childNodes[1];
	// console.log(icon);
	if(icon) {	
		if(icon.className == 'fa fa-folder-o') {
			removeClass(icon, 'fa fa-folder-o');
			addClass(icon, 'fa fa-folder-open-o');
			
			if(child) {
				child.style.display = 'block';
			}
		}else if(icon.className == 'fa fa-folder-open-o') {
			removeClass(icon, 'fa fa-folder-open-o');
			addClass(icon, 'fa fa-folder-o');
			if(child) {
				child.style.display = 'none';
			}
		}
	}
}
/*点击主分类，高亮*/
function setLightCate(element) {
	clearCateActive();
	addClass(element, 'active');
	toggleCate(element);
}
/*点击子分类高亮*/
function setLightCateChild(element) {
	clearCateActive();
	addClass(element, 'active');
}
/*点击任务高亮*/ 
function setLightTask(element) {
	var tasks = document.querySelectorAll('.taskList')[0].getElementsByTagName('h4');
	for(var i = 0, len = tasks.length; i < len; i++) {
		removeClass(tasks[i], 'active');
	}
	addClass(element, 'active');
}
/*点击左侧分类列表中间任务列表的显示*/
/*点击主分类*/
function initTaskListByCate(id, currStatus) {
	var taskArr = data.queryTaskByCate(currStatus, id);
	// console.log(taskArr);
	var dateTask = data.createDateData(taskArr);
	// console.log(dateTask);
	var taskList = document.querySelectorAll('.taskList')[0];
	var tempStr = '<ul>';
	for(var i = 0, len = dateTask.length; i < len; i++) {
		var liStr = '<li class="dateList"><p class="dateName">' + dateTask[i].date + '</p><ul>';
		for(var j = 0, lenChild = dateTask[i].task.length; j < lenChild; j++) {
			var innerLiStr = '<li><h4 data-task=' + dateTask[i].task[j].id + ' class=' + dateTask[i].task[j].finish + '>' + dateTask[i].task[j].name + '<i class="fa fa-times"></i></h4></li>';
			liStr += innerLiStr;
		}
		liStr += '</ul>';
		tempStr += liStr;
	}
	tempStr += '</ul>';
	taskList.innerHTML = tempStr;
	// console.log(dateTask);
	if(dateTask.length > 0) {
		// setLightTask(document.querySelectorAll('.taskList')[0].getElementsByTagName('h4')[0]);
		return dateTask[0].task[0];
	}else {
		return null;
	}	
}
/*点击子分类*/
function initTaskListByCateChild(id, currStatus) {
	var taskArr = data.queryTaskByCateChild(currStatus, id);
	// console.log(taskArr);
	var dateTask = data.createDateData(taskArr);
	// console.log(dateTask);
	var taskList = document.querySelectorAll('.taskList')[0];
	var tempStr = '<ul>';
	for(var i = 0, len = dateTask.length; i < len; i++) {
		var liStr = '<li class="dateList"><p class="dateName">' + dateTask[i].date + '</p><ul>';
		for(var j = 0, lenChild = dateTask[i].task.length; j < lenChild; j++) {
			var innerLiStr = '<li><h4 data-task=' + dateTask[i].task[j].id + ' class=' + dateTask[i].task[j].finish + '>' + dateTask[i].task[j].name + '<i class="fa fa-times"></i></h4></li>';
			liStr += innerLiStr;
		}
		liStr += '</ul>';
		tempStr += liStr;
	}
	tempStr += '</ul>';
	taskList.innerHTML = tempStr;
	if(dateTask.length > 0) {
		// setLightTask(document.querySelectorAll('.taskList')[0].getElementsByTagName('h4')[0]);
		return dateTask[0].task[0];
	}else {
		return null;
	}
}
/*右侧任务显示*/
function initDetail(detail) {
	document.querySelectorAll('.taskDisplay')[0].style.display = 'block';
	document.querySelectorAll('.taskEdit')[0].style.display = 'none';
	document.querySelectorAll('.taskName')[0].innerHTML = '任务名称：' + detail.name;
	if(detail.finish == 'finished') {
		document.querySelectorAll('.manipulate')[0].style.display = 'none';
	}else if(detail.finish == 'unfinished') {
		document.querySelectorAll('.manipulate')[0].style.display = 'inline-block';
	}
	document.querySelectorAll('.taskDate')[0].innerHTML = '任务日期：' + detail.date;
	document.querySelectorAll('.taskContent')[0].innerHTML = '<p>' + detail.content + '</p>';
}

function confirmAddTask(currCateChild) {
	var name = document.querySelectorAll('.taskNameInput')[0].value;
	var date = document.querySelectorAll('.taskDateInput')[0].value;
	var content = document.querySelectorAll('.taskContentInput')[0].value;
	var infoTask = document.querySelectorAll('.infoTask')[0];
	if(!name) {
		infoTask.innerHTML = '标题不能为空';
		return;
	}else if(!date) {
		infoTask.innerHTML = '日期不能为空';
		return;
	}else if(!content) {
		infoTask.innerHTML = '内容不能为空';
		return;
	}else {
		var taskObj = {};
		taskObj.name = name;
		taskObj.date = date;
		taskObj.content = content;
		if(currDetail == 1) {
			taskObj.id = currTask;
			var flag = data.updateTaskDetail(taskObj);
			if(!flag) {
				infoTask.innerHTML = '任务名称重复';
				return;
			}else {
				document.querySelectorAll('.taskDisplay')[0].style.display = 'block';
				document.querySelectorAll('.taskEdit')[0].style.display = 'none';
				initAll();
			}
		}else if(currDetail == 2) {
			var task = JSON.parse(localStorage.task);
			taskObj.pid = currCateChild;
			taskObj.id =  task[task.length -1].id + 1;
			taskObj.finish = 'unfinished';
			var flag = data.addTask(taskObj);
			if(!flag) {
				infoTask.innerHTML = '任务名称重复';
				return;
			}else {
				document.querySelectorAll('.taskDisplay')[0].style.display = 'block';
				document.querySelectorAll('.taskEdit')[0].style.display = 'none';
				initAll();
				return;
			}
		}		

		// currDetail = 0;
		// initCateList();
		// currCate = -1;
		// currCateChild = -1;
		// currTask = 0;
		// initTaskListByCate(currCate,currStatus);
		// initDetail(JSON.parse(localStorage.task)[0]);

	}
}
/*初始化整个页面*/
/*只要是对数据库数据产生改变的操作全部初始化页面，即左侧所有任务高亮，中间所有标签高亮，右侧显示说明*/
function initAll() {
	currCate = -1;
	currCateChild = -1;
	currStatus = 0;
	currTask = 0;
	currDetail = 0;
	setLightCate(document.querySelectorAll('.allTask')[0]);
	initCateList();
	clearTagActive();
	addClass(document.querySelectorAll('.statusTag')[0], 'active');
	initTaskListByCate(currCate, currStatus);
	setLightTask(document.querySelectorAll('.taskList')[0].getElementsByTagName('h4')[0]);
	initDetail(JSON.parse(localStorage.task)[0]);
}