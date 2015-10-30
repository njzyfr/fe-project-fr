

function $(selector) {

}

// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener);
    } else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    }
}
// 实现对click事件的绑定
function addClickEvent(element, listener) {
    addEvent(element, "click", listener);
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    var oldClassName = element.className; //获取旧的样式类
    element.className = oldClassName === "" ? newClassName : oldClassName + " " + newClassName;
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    var originClassName = element.className; //获取原先的样式类
    var pattern = new RegExp("\\b" + oldClassName + "\\b"); //使用构造函数构造动态的正则表达式
    element.className = originClassName.replace(pattern, '').trim();
}