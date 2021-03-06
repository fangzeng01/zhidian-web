const HTTP_QZ= 'https://zhidian.dookbook.info'
var discipline_code = getQueryVariable('code')
var filter_page = 0
var filter_city_rank = ''
var filter_years = ''
var filter_industry = ''
var filter_salary = ''
var load_school_rank = false
var has_next_page = false
var order_by = 'required'
var reverse = '1'

/**
  * 获取URL查询参数
  * @param {String} param URL parameter name
  */
 function getQueryVariable (param) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === param) { return pair[1] }
  }
  return false
}

//切换
var tab = document.querySelectorAll('.tab li')
var ranking = document.querySelectorAll('.ranking');
for (var i = 0; i < tab.length; i++){
  tab[i].index = i;
  tab[i].onclick = function () {
    for (var j = 0; j< tab.length; j++) {
      tab[j].classList.remove('active')
    }
    for (var j=0; j<ranking.length; j++) { 
      ranking[j].style.display='none'
    }
    
    tab[this.index].classList.add('active')
    ranking[this.index].style.display='block'
    if(tab[this.index].classList.contains('tab_school') && !load_school_rank){
      getSchoolList()
    }
  }
}

// 筛选
var filter = document.querySelectorAll('.filter li')
var unfold = document.querySelectorAll('.unfold')

// 展开
for (var i=0; i<unfold.length; i++){
  unfold[i].index = i;
  unfold[i].onclick = function () {
    if (this.querySelector('em').innerHTML == '展开') {
      for (var j = 0; j< unfold.length; j++) {
        unfold[j].querySelector('em').innerHTML = '展开'
        filter[j].style.height='42px'
      }
      this.querySelector('em').innerHTML = '收起'
      filter[this.index].style.height='auto'
    } else {
      this.querySelector('em').innerHTML = '展开'
      filter[this.index].style.height='42px'
    }
  }
}

// 年限 薪酬 行业
for(var i=0; i<filter.length; i++){
  var spanbtn = filter[i].querySelectorAll('p span')
  for(var j=0; j<spanbtn.length; j++){
    spanbtn[j].onclick = function () {
      var current = this.parentElement.children
      for(var k=0; k<current.length; k++){
        current[k].classList.remove('active')
      }
      this.classList.add('active')
      if(this.classList.contains('filter_city_rank')){
        if(this.textContent === '不限'){
          filter_city_rank = ''
        } else {
          filter_city_rank = this.textContent
        }
      } else if(this.classList.contains('filter_years')){
        if(this.textContent === '不限'){
          filter_years = ''
        } else {
          filter_years = this.textContent
        }
      } else if(this.classList.contains('filter_industry')){
        if(this.textContent === '不限'){
          filter_industry = ''
        } else {
          filter_industry = this.textContent
        }
      }else if(this.classList.contains('filter_salary')){
        if(this.textContent === '不限'){
          filter_salary = ''
        } else if (this.textContent === '2k-5k') {
          filter_salary = '2000-5000'
        }else if (this.textContent === '5k-8k') {
          filter_salary = '5000-8000'
        }else if (this.textContent === '8k-12k') {
          filter_salary = '8000-12000'
        }else if (this.textContent === '12k-15k') {
          filter_salary = '12000-15000'
        }else if (this.textContent === '15k以上') {
          filter_salary = '5000-9999'
        }
      }

      filter_page = 0
      has_next_page = false
      getPositionList()
    }
  }
}

function listText(value, box){
  var xhr = new XMLHttpRequest()
  xhr.open('GET', HTTP_QZ + '/api/edu/university/disciplines/?q=' + value)
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var data = JSON.parse(xhr.responseText)
      if(data.code === 0) {
        if(data.hints == null || data.hints.length === 0){
          box.innerHTML = '<li><a href="#" class="search-results">暂无搜索结果</a></li>'
        } else {
          box.innerHTML = ''
          for(var i=0;i<data.hints.length;i++){
            box.innerHTML += '<ul><li><a href="https://zhidian.dookbook.info/report/content/?code='+data.hints[i].code+'">'+data.hints[i].name+'</a></li></ul>'
          }
        }
      } else {
        alert(data.errmsg)
      }
    } else {
      console.debug('fetchSearchHintList: connecting')
    }
  }
}


/**
 * 函数防抖，debounce
 * 基本思路就是把多个信号合并为一个信号
 * 
 * @param {*} func 
 * @param {*} delay 
 */
function debounce(func, delay) {
  var timer = null
  return function(e) {
      console.log("clear", timer, e.target.value)
      var context = this, args = arguments
      clearTimeout(timer)

      console.log("new event", timer, e.target.value)
      timer = setTimeout(function(){
        func.apply(context, args)
      }, delay)
  }
}

/**
 * 节流，throttle
 * 强制函数以固定的速率执行，比较适合应用于动画相关的场景
 * 如：resize, touchmove, mousemove, scroll
 * 
 * @param {*} func 
 * @param {*} threshhold 
 */
function throttle(func, threshhold) {
  var timer = null;
  var start = new Date;
  var threshhold = threshhold || 160

  return function () {
    var context = this, args = arguments, curr = new Date() - 0
    clearTimeout(timer)  //总是干掉事件回调

    if(curr - start >= threshhold){ 
      console.log("now", curr, curr - start)//注意这里相减的结果，都差不多是160左右
      func.apply(context, args) //只执行一部分方法，这些方法是在某个时间段内执行一次
      start = curr
    }else{
      //让方法在脱离事件后也能执行一次
      timer = setTimeout(function(){
        func.apply(context, args) 
      }, threshhold);
    }
  }
}


var difference = document.querySelector('section input[type="text"]')
var cXial = document.querySelector('.c-xial')
difference.oninput = debounce(function(e) {
  if(this.value == ''){
    cXial.style.display = "none"
  } else {
    cXial.style.display = "block"
  }
  listText(this.value, cXial)
}, 240)

difference.onclick = function (event) {
  event.stopPropagation()
  if(this.value == '') {
    cXial.style.display = "none"
  } else {
    cXial.style.display = "block"
    listText(this.value, cXial)
  }
}

document.body.onclick = function () {
  cXial.style.display = "none"
}

var qiehua = document.querySelectorAll('.qiehua li')
var record = document.querySelectorAll('.record');
for (var i = 0; i < qiehua.length; i++){
  qiehua[i].index = i;
  qiehua[i].onclick = function () {
    for (var j = 0; j< qiehua.length; j++) {
      qiehua[j].className=''
    }
    for (var i=0; i<record.length; i++) { 
      record[i].style.display='none'
    }
    
    qiehua[this.index].className='active'
    record[this.index].style.display='block'
  }
}

document.querySelector('.shangyiye').onclick = function () {
  goBack()
}

function goBack(){
  if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE
    if(history.length > 0){
      window.history.go( -1 );
    }else{
      window.location.href = "/";
    }
  }else{ //非IE浏览器
    if (navigator.userAgent.indexOf('Firefox') >= 0 ||
      navigator.userAgent.indexOf('Opera') >= 0 ||
      navigator.userAgent.indexOf('Safari') >= 0 ||
      navigator.userAgent.indexOf('Chrome') >= 0 ||
      navigator.userAgent.indexOf('WebKit') >= 0){

      if(window.history.length > 1){
        window.history.go( -1 );
      }else{
        window.location.href = "/";
      }
    }else{ //未知的浏览器
      window.history.go( -1 );
    }
  }
}


var tabTbody = document.querySelector('table tbody')
getPositionList()



/**
 * 获取职位列表
 */
function getPositionList() {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', HTTP_QZ + '/api/report/positions/?discipline_code='+discipline_code+'&city_rank='+filter_city_rank+'&page='+filter_page+'&years='+filter_years+'&industry='+filter_industry+'&salary='+filter_salary+'&order='+order_by+'&reverse='+reverse)
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      showLoading(false)
      var data = JSON.parse(xhr.responseText)
      if(data.code === 0) {
        filter_page = data.page
        if(data.page === 0){
          tabTbody.innerHTML = ''
        }
        has_next_page = data.has_next_page
        if(data.data.length === 0 && data.page === 0) {
          tabTbody.innerHTML = '<tr><td colspan="4"><div class="no-data"><img src="/static/img/no-data.jpg" alt="暂无数据"><p>暂无职位信息</p></div></td></tr>'
        } else {
          for(var i=0; i<data.data.length; i++){
            tabTbody.innerHTML += '<tr><td>'+data.data[i].name+'</td><td>'+data.data[i].industry+'</td><td>'+data.data[i].required+'</td><td>'+data.data[i].salary+'</td></tr>'
          }
        }
      } else {
        alert(data.errmsg)
      }
    }else {
      console.debug('获取职位列表: 正在连接中')
      showLoading(true)
    }
  }
}

/**
 * 获取学校列表
 */
var school = document.querySelector('.school')
function getSchoolList() {
  school.innerHTML = ''
  var xhr = new XMLHttpRequest()
  xhr.open('GET', HTTP_QZ + '/api/edu/university/rank/?discipline_code='+discipline_code)
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      showLoading(false)
      var data = JSON.parse(xhr.responseText)
      if(data.code === 0) {
        if(data.data.length === 0) {
          school.innerHTML = '<li class="zanwu"><div class="no-data"><img src="/static/img/no-data.jpg"><p>教育部暂无此专业评估报告</p></div></li>'
          document.querySelector('.load').style.display = 'none'
        } else {
          for(var i=0; i<data.data.length; i++){
            school.innerHTML += '<li><em>'+(i+1)+'</em><section class="fl info"><span>'+data.data[i].name+'</span><p><span name='+data.data[i].is_985+'>985</span><span name='+data.data[i].is_211+'>211</span><span name='+data.data[i].is_dual+'>双一流</span></p><section class="fenshu"><p>院校代码：'+data.data[i].code+'</p></section></section><section><p>'+data.data[i].rank+'</p><p>专业评估</p></section></li>'
          }
        }
        for(var i=0; i<school.querySelectorAll("li").length; i++){
          school.querySelectorAll("li")[i].addEventListener('click', function () {
            if (this.querySelector('.info section') != null) {
              if(this.querySelector('.info section').style.display != 'block'){
                this.querySelector('.info section').style.display = 'block'
              } else {
                this.querySelector('.info section').style.display = 'none'
              }
            }
          })
        }
      } else {
        alert(data.errmsg)
      }
    }else {
      console.debug('获取高校列表: 正在连接中')
      showLoading(true)
    }
  }
  load_school_rank = true
}

// 回到顶部
var backTop = document.querySelector(".top")
var  time = null;

backTop.addEventListener("click", function(){
  time = setInterval(function(){
    var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
    if(scrollTop === 0){
      clearInterval(time);
    }
    document.documentElement.scrollTop = scrollTop - 100
    document.body.scrollTop = scrollTop - 100
  }, 16);
})

window.onscroll=function(){
  var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
  var a = document.documentElement.scrollTop==0? document.body.clientHeight : document.documentElement.clientHeight;
  var b = document.documentElement.scrollTop==0? document.body.scrollTop : document.documentElement.scrollTop;
  var c = document.documentElement.scrollTop==0? document.body.scrollHeight : document.documentElement.scrollHeight
  if(a+b>c-80){
    if(has_next_page){
      filter_page += 1
      getPositionList()
      document.querySelector('.load').style.display = 'block'
      document.querySelector('.load').innerHTML = '<img src="/static/img/load.svg" alt="">加载中'
      document.querySelector('.load img').style.animation = 'load 2s infinite'
    } else {
      document.querySelector('.load').innerHTML = '—— 不止诗与远方 ——'
    }
  }
  if(scrollTop > 600){
    backTop.style.display = "block"
  } else {
    backTop.style.display = "none"
  }
}

/* 加载中显示加载浮窗 */
function showLoading(show){
  if(show){
    document.querySelector('.loading').style.display = 'block'
  } else {
    document.querySelector('.loading').style.display = 'none'
  }
}

/* 点击切换排序 */
function swapReverse(){
  if(reverse === '1'){
    reverse = '0'
  }else{
    reverse = '1'
  }
}
document.querySelector('#order_by_required').onclick = function() {
  order_by = 'required'
  swapReverse()
  filter_page = 0
  has_next_page = false
  getPositionList()
}
document.querySelector('#order_by_salary').onclick = function() {
  order_by = 'salary'
  swapReverse()
  filter_page = 0
  has_next_page = false
  getPositionList()
}
