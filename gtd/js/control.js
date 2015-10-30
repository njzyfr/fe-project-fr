(function() {
	currCate = -1,
	currCateChild = -1,
	currTask = 0,
	currStatus = 0, //所有0，未完成1，已完成2
	currDetail = 0;//显示0，再编辑1，第一次写2

	initDataBase();

	initAll();

	//点击增加分类
	addClickEvent(document.querySelectorAll('.addCate')[0], function() {
		initModal();
	});
	//模态框点击确认按钮
	addClickEvent(document.querySelectorAll('.saveCate')[0], function() {
		confirmModal();
	});
	//模态框点击取消按钮
	addClickEvent(document.querySelectorAll('.cancelCate')[0], function() {
		cancelModal();
	});
	//点击删除x
	addClickEvent(document, function(event) {
		var element = event.target || event.srcElement;
		if(element.nodeType == 1) {
			var elementClass = element.className;
			if(elementClass === 'fa fa-times') {
				window.event ? window.event.cancelBubble = true : event.stopPropagation();
				var clicked = element.parentNode;
				// console.log(clicked);
				var cofirmDel = confirm("删除操作不可逆，是否确定删除？");
				if(cofirmDel) {
					if(clicked.tagName.toLowerCase() == 'h2') {
						var cateId = clicked.dataset.cate;
						data.delCate(cateId);
					}else if(clicked.tagName.toLowerCase() == 'h3') {
						var cateChildId = clicked.dataset.catechild,
							flagCate = true;
						data.delCateChild(cateChildId, flagCate);
					}else if(clicked.tagName.toLowerCase() == 'h4') {
						var taskId = clicked.dataset.task,
							flagChild = true;
						data.delTask(taskId, flagChild);
					}
					initAll();
				}
			}
		}
	});
	
	//点击增加任务
	addClickEvent(document.querySelectorAll('.addTask')[0], function() {
		currDetail = 2;
		if(currCateChild == -1) {
			alert('请选择子分类');
		}else {	
			document.querySelectorAll('.taskDisplay')[0].style.display = 'none';
			document.querySelectorAll('.taskEdit')[0].style.display = 'block';
			document.querySelectorAll('.taskNameInput')[0].value = '';
			document.querySelectorAll('.taskDateInput')[0].value = '';
			document.querySelectorAll('.taskContentInput')[0].value = '';
			document.querySelectorAll('.infoTask')[0].innerHTML = '';
		}
	});
	//点击确认增加任务
	addClickEvent(document.querySelectorAll('.saveTask')[0], function() {
		confirmAddTask(currCateChild);
	});
	//点击取消增加任务
	addClickEvent(document.querySelectorAll('.cancelTask')[0], function() {
		currDetail = 0;
		document.querySelectorAll('.taskDisplay')[0].style.display = 'block';
		document.querySelectorAll('.taskEdit')[0].style.display = 'none';
	});
	//点击标记完成
	addClickEvent(document.querySelectorAll('.fa-check-square-o')[0], function() {
		var confirmFinish = confirm('确定将任务标记为已完成吗？');
		if(confirmFinish) {
			data.updateTaskStatus(currTask);
			initAll();
		}
	});
	//点击修改任务
	addClickEvent(document.querySelectorAll('.fa-pencil-square-o')[0], function() {
		currDetail = 1;
		document.querySelectorAll('.taskDisplay')[0].style.display = 'none';
		document.querySelectorAll('.taskEdit')[0].style.display = 'block';
		var detail = data.queryTaskByTask(currTask);
		document.querySelectorAll('.taskNameInput')[0].value = detail.name;
		document.querySelectorAll('.taskDateInput')[0].value = detail.date;
		document.querySelectorAll('.taskContentInput')[0].value = detail.content;
		document.querySelectorAll('.infoTask')[0].innerHTML= '';		
	});

	//点击左侧分类列表,中间任务列表
	addClickEvent(document, function(event) {
		var element = event.target || event.srcElement;
		if(element.nodeType == 1) {
			if(element.tagName.toLowerCase() == 'h2') {
				//点击主分类
				var tempCate = currCate;
				currCate = element.dataset.cate;
				currCateChild = -1;
				//只改变主分类下子分类收缩或显示
				if(currCate == tempCate) {
					toggleCate(element);
				}else {
					setLightCate(element);
					var detail = initTaskListByCate(currCate,currStatus);
					if(detail) {
						currTask = detail.id;
						setLightTask(document.querySelectorAll('.taskList')[0].getElementsByTagName('h4')[0]);
						initDetail(detail);							
					}
				}				
			}else if(element.tagName.toLowerCase() == 'h3') {
				//点击子分类
				var tempCateChild = currCateChild;
				currCateChild = element.dataset.catechild;
				if(tempCateChild != currCateChild) {	
					setLightCateChild(element);
					var detail = initTaskListByCateChild(currCateChild,currStatus);
					if(detail) {
						currTask = detail.id;
						setLightTask(document.querySelectorAll('.taskList')[0].getElementsByTagName('h4')[0]);
						initDetail(detail);							
					}
				}
			}else if(element.tagName.toLowerCase() == 'h4') {
				//点击任务
				var tempTask = currTask;
				currTask = element.dataset.task;
				if(currTask != tempTask) {
					setLightTask(element);
					var detail = data.queryTaskByTask(currTask);
					initDetail(detail);
				}
			}
		}
	});
	//点击中间状态栏标签
	addClickEvent(document.querySelectorAll('.status')[0], function(event) {
		var element = event.target || event.srcElement;
		if(element.nodeType == 1) {
			if(element.tagName.toLowerCase() == 'li') {
				var tempStatus = currStatus;
				currStatus = element.dataset.status;
				if(currStatus != tempStatus){
					clearTagActive();
					addClass(element, 'active');
					if(currCateChild == -1) {
						// console.log(currStatus);
						var detail = initTaskListByCate(currCate,currStatus);
						if(detail) {
							currTask = detail.id;
							setLightTask(document.querySelectorAll('.taskList')[0].getElementsByTagName('h4')[0]);
							initDetail(detail);							
						}
					}else {
						var detail = initTaskListByCateChild(currCateChild,currStatus);
						if(detail) {
							currTask = detail.id;
							setLightTask(document.querySelectorAll('.taskList')[0].getElementsByTagName('h4')[0]);
							initDetail(detail);							
						}
					}
				}
			}
		}
	});
})();
