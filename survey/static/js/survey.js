var profession = document.querySelectorAll('input[name="selectProfessionalReasons"]')
var career = document.querySelectorAll('input[name="choosingEmploymentConsiderations"]')
var employment = document.querySelectorAll('input[name="understandProfessionalInformation"]')
var age = document.querySelectorAll('input[name="grade"]')
var treatment = document.querySelectorAll('input[name="understandFutureSalary"]')
var professionNum = 0
var careerNum = 0
var employmentNum = 0
var ageChecked = null
var treatmentChecked = null
var universityCollegeId = null
var disciplineId = null
var startedTime = new Date().getTime()


function chooseUniversity(id, text){
  universityCollegeId = id
  document.getElementById("university-text").value=text;
  document.querySelector('#university-list').innerHTML = ''
}

function chooseDiscipline(id, text){
  disciplineId = id
  document.getElementById("professional-text").value=text;
  document.querySelector('#professional-list').innerHTML = ''
}

function showUniversityList(searchText, box){
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/api/universityCollege/list?search='+searchText)
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var data = JSON.parse(xhr.responseText)
      if(data.code === 200) {
        if(!data.data.list.length){
          box.innerHTML = '<li><a href="#" class="search-results">暂无搜索结果</a></li>'
        } else {
          box.innerHTML = ''
          for(var i=0; i<data.data.list.length; i++){
            box.innerHTML += '<li onclick= chooseUniversity('+data.data.list[i].id+',"'+data.data.list[i].name+'");>'+data.data.list[i].name+'</li>'
          }
        }
      } else {
        alert(data.errmsg)
      }
    }
  }
}

function showDisciplineList(searchText, box){
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/api/discipline/list?search='+searchText)
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var data = JSON.parse(xhr.responseText)
      if(data.code === 200) {
        if(!data.data.list.length){
          box.innerHTML = '<li><a href="#" class="search-results">暂无搜索结果</a></li>'
        } else {
          box.innerHTML = ''
          for(var i=0; i<data.data.list.length; i++){
            box.innerHTML += '<li onclick= chooseDiscipline('+data.data.list[i].id+',"'+data.data.list[i].name+'");>'+data.data.list[i].name+'</li>'
          }
          
        }
      } else {
        alert(data.errmsg)
      }
    }
  }
}

// 1.您就读的大学名称
document.querySelector('#university-text').onclick = function (e) {
  e.stopPropagation()
  document.querySelector('#university-error').style.display = 'none'
  if(this.value == ''){
    document.querySelector('#university-list').style.display = 'none'
  } else {
    document.querySelector('#university-list').style.display = 'block'
  }
}

document.querySelector('#university-text').oninput = function (e) {
  e.stopPropagation()
  var _box = document.querySelector('#university-list')
  if(this.value == ''){
    _box.style.display = 'none'
  } else {
    showUniversityList(this.value, _box)
    _box.style.display = 'block'
  }
}

document.querySelector('#professional-text').oninput = function (e) {
  e.stopPropagation()
  var _box = document.querySelector('#professional-list')
  if(this.value == ''){
    _box.style.display = 'none'
  } else {
    showDisciplineList(this.value, _box)
    _box.style.display = 'block'
  }
}

// document.body.onclick = function () {
//   document.querySelector('#university-list').style.display = 'none'
//   document.querySelector('#professional-list').style.display = 'none'
// }

// 2.您就读的年级
for(var i=0; i<age.length; i++){
  age[i].index = i
  age[i].onclick = function () {
    for (var j=0; j<age.length; j++) {
      age[j].parentElement.classList.remove('checked')
    }
    age[this.index].parentElement.classList.add('checked')
    ageChecked = age[this.index].checked
    if(ageChecked){
      document.querySelector('#age-error').style.display = 'none'
    }
  }
}

// 3.您的专业是
document.querySelector('#professional-text').onclick = function () {
  document.querySelector('#professional-error').style.display = 'none'
}

// 4.您选择这个专业的原因是
for(var i=0; i<profession.length; i++){
  profession[i].onclick = function () {
    if(this.value === '其他' && this.checked) {
      document.querySelector('#profession-text').style.display = 'block'
      document.querySelector('#profession-text').required = 'required'
    } else if(this.value === '其他' && !this.checked){
      document.querySelector('#profession-text').style.display = 'none'
      document.querySelector('#profession-text').required = ''
    }

    if(this.parentElement.classList.toggle('checked')) {
      this.parentElement.classList.add('checked')
      professionNum++
    } else {
      this.parentElement.classList.remove('checked')
      professionNum--
    }

    if(professionNum !== 0){
      document.querySelector('#profession-error').style.display = 'none'
    }
    if(professionNum == 3) {
      for(var j=0; j<profession.length; j++){
        if(!profession[j].checked) {
          profession[j].disabled = 'disabled'
          profession[j].parentElement.classList.add('disabled')
        }
      }
    } else {
      for(var j=0; j<profession.length; j++){
        if(!profession[j].checked) {
          profession[j].disabled = ''
          profession[j].parentElement.classList.remove('disabled')
        }
      }
    }
  }

}

document.querySelector('#profession-text').onclick = function() {
  document.querySelector('#profession-text-error').style.display = 'none'
}

// 5.择业时，您考量最多的是
for(var i=0; i<career.length; i++){
  career[i].onclick = function () {
    if(this.value === '其他' && this.checked) {
      document.querySelector('#career-text').style.display = 'block'
      document.querySelector('#career-text').required = 'required'
    } else if(this.value === '其他' && !this.checked){
      document.querySelector('#career-text').style.display = 'none'
      document.querySelector('#career-text').required = ''
    }
    if(this.parentElement.classList.toggle('checked')) {
      this.parentElement.classList.add('checked')
      careerNum++
    } else {
      this.parentElement.classList.remove('checked')
      careerNum--
    }
    if(careerNum !== 0){
      document.querySelector('#career-error').style.display = 'none'
    }
    if(careerNum == 3) {
      for(var j=0; j<career.length; j++){
        if(!career[j].checked) {
          career[j].disabled = 'disabled'
          career[j].parentElement.classList.add('disabled')
        }
      }
    } else {
      for(var j=0; j<career.length; j++){
        if(!career[j].checked) {
          career[j].disabled = ''
          career[j].parentElement.classList.remove('disabled')
        }
      }
    }
  }
}

document.querySelector('#career-text').onclick = function() {
  document.querySelector('#career-text-error').style.display = 'none'
}

// 6.您了解自己专业匹配的市场岗位和未来薪资待遇吗？
for(var i=0; i<treatment.length; i++){
  treatment[i].index = i
  treatment[i].onclick = function () {
    if(this.value == '其他' && this.checked) {
      document.querySelector('#treatment-text').style.display = 'block'
      document.querySelector('#treatment-text').required = 'required'
    } else {
      document.querySelector('#treatment-text').style.display = 'none'
      document.querySelector('#treatment-text').required = ''
    }
    for (var j=0; j<treatment.length; j++) {
      treatment[j].parentElement.classList.remove('checked')
    }
    treatment[this.index].parentElement.classList.add('checked')
    treatmentChecked = treatment[this.index].checked
    if(treatmentChecked){
      document.querySelector('#treatment-error').style.display = 'none'
    }
  }
}

document.querySelector('#treatment-text').onclick = function() {
  document.querySelector('#treatment-text-error').style.display = 'none'
}

// 7.曾经从哪些渠道了解过专业与就业相关的信息
for(var i=0; i<employment.length; i++){
  employment[i].onclick = function () {
    if(this.value === '其他' && this.checked) {
      document.querySelector('#employment-text').style.display = 'block'
      document.querySelector('#employment-text').required = 'required'
    } else if(this.value === '其他' && !this.checked){
      document.querySelector('#employment-text').style.display = 'none'
      document.querySelector('#employment-text').required = ''
    }
    if(this.parentElement.classList.toggle('checked')) {
      this.parentElement.classList.add('checked')
      employmentNum++
    } else {
      this.parentElement.classList.remove('disabled')
      employmentNum--
    }
    if(employmentNum !== 0){
      document.querySelector('#employment-error').style.display = 'none'
    }
  }
}

document.querySelector('#employment-text').onclick = function() {
  document.querySelector('#employment-text-error').style.display = 'none'
}

// var formData2json = function (formData) {
//   var objData = {};

//   for (var entry of formData.entries()){
//     objData[entry[0]] = entry[1];
//   }
//   return JSON.stringify(objData);
// }


document.querySelector('input[type="submit"]').onclick = function(event){
  if(universityCollegeId == null){
    document.querySelector('#university-error').style.display = 'block'
    window.location.href = '#university'
    return false
  } else if(ageChecked === null){
    document.querySelector('#age-error').style.display = 'block'
    window.location.href = '#age'
    return false
  }else if(document.querySelector('#professional-text').value == ''){
    document.querySelector('#professional-error').style.display = 'block'
    window.location.href = '#professional'
    return false
  }else if(professionNum === 0){
    window.location.href = '#profession'
    document.querySelector('#profession-error').style.display = 'block'
    return false
  }else if(document.querySelector('#profession-text').value == '' && document.querySelector('#profession-text').required){
    window.location.href = '#profession'
    document.querySelector('#profession-text-error').style.display = 'block'
    return false
  }else if(careerNum === 0){
    window.location.href = '#career'
    document.querySelector('#career-error').style.display = 'block'
    return false
  }else if(document.querySelector('#career-text').value == '' && document.querySelector('#career-text').required){
    window.location.href = '#career'
    document.querySelector('#career-text-error').style.display = 'block'
    return false
  }else if(treatmentChecked === null){
    document.querySelector('#treatment-error').style.display = 'block'
    window.location.href = '#treatment'
    return false
  }else if(document.querySelector('#treatment-text').value == '' && document.querySelector('#treatment-text').required){
    window.location.href = '#treatment'
    document.querySelector('#treatment-text-error').style.display = 'block'
    return false
  }else if(employmentNum === 0){
    window.location.href = '#employment'
    document.querySelector('#employment-error').style.display = 'block'
    return false
  }else if(document.querySelector('#employment-text').value == '' && document.querySelector('#employment-text').required){
    window.location.href = '#employment'
    document.querySelector('#employment-text-error').style.display = 'block'
    return false
  }

  var selectProfessionalReasons = document.querySelectorAll('input[name="selectProfessionalReasons"]:checked')
  var _arrSelectProfessionalReasons = new Array()
  for(var i=0; i<selectProfessionalReasons.length; i++){
    _arrSelectProfessionalReasons.push(selectProfessionalReasons[i].value)
  }
  var choosingEmploymentConsiderations = document.querySelectorAll('input[name="choosingEmploymentConsiderations"]:checked')
  var _arrChoosingEmploymentConsiderations = new Array()
  for(var i=0; i<choosingEmploymentConsiderations.length; i++){
    _arrChoosingEmploymentConsiderations.push(choosingEmploymentConsiderations[i].value)
  }
  var understandProfessionalInformation = document.querySelectorAll('input[name="understandProfessionalInformation"]:checked')
  var _arrUnderstandProfessionalInformation = new Array()
  for(var i=0; i<understandProfessionalInformation.length; i++){
    _arrUnderstandProfessionalInformation.push(understandProfessionalInformation[i].value)
  }

  event.preventDefault()
  var reqData = JSON.stringify({
    'universityCollegeId': universityCollegeId,
    'weChatUserId': localStorage.getItem('uid'),
    'elapsedTime': startedTime,
    'employmentRelatedInformation': document.querySelector('#employmentRelatedInformation').value,
    'disciplineId': disciplineId,
    'grade': document.querySelector('input[name="grade"]:checked').value,
    'understandFutureSalary': document.querySelector('input[name="understandFutureSalary"]:checked').value,
    'selectProfessionalReasons': _arrSelectProfessionalReasons,
    'choosingEmploymentConsiderations': _arrChoosingEmploymentConsiderations,
    'understandProfessionalInformation': _arrUnderstandProfessionalInformation,
  })
  var xhr = new XMLHttpRequest()
  xhr.open('POST', '/api/employmentSurvey/add')
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(reqData)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var data = JSON.parse(xhr.responseText)
      if(data.code == 200) {
        window.location.href = '/survey/ok.html'
      } else {
        alert(data.msg)
        window.location.href = '/survey/1.html'
      }
    }
  }
}
