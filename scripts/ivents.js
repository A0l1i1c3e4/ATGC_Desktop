const iventsContainer = document.getElementById('ivents-container'); 
const iventsTemplate = document.getElementById('ivents-template');
const paginationContainer = document.getElementById('pagination'); 

const loginButton = document.getElementById('in');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
let userMenuListenerAttached = false;

let currentPage = 1; 
let pageSize = 5; 
let pagecount;
let currentFilters = {}; 
let currentSorting = ''; 

function activate(email){
  if (!userMenuListenerAttached) {
    loginButton.addEventListener('click', () => {
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    });
    loginButton.textContent = email + ' ▾';
    profileButton.style.display = 'inline-block';
    logoutButton.style.display = 'inline-block';

    profileButton.addEventListener('click', () => {
      window.location.href = '../pages/profile.html'
    });

    logoutButton.addEventListener('click', () => {
      fetch('http://localhost:8080/auth/logout', {  
        method: 'DELETE',  
        headers: {  
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },  
      })  
      .catch(error => {  
        console.error('Ошибка выхода из профиля:', error);  
        alert('Ошибка выхода из профиля: ' + error.message);  
      });  
      localStorage.removeItem('token');
      window.location.href = '../pages/login.html'
    });
    userMenuListenerAttached = true;
  }
}

function goLeft(flag){
  if(flag == 0){
    currentPage = 1;
    loadIvents();
  }else if (currentPage - flag > 0){
    currentPage -= flag;
    loadIvents();
  }
}
function goRight(flag){
  if(flag == 0){
    currentPage = pagecount;
    loadIvents();
  }else if (currentPage + flag <= pagecount){
    currentPage += flag;
    loadIvents();
  }
  
}

function paginationBTN(){
  const button1 = document.createElement('button');
  button1.textContent = '<<';
  button1.id = 'button1';
  button1.addEventListener("click", ()=>{goLeft(0)});
  const button2 = document.createElement('button');
  button2.textContent = currentPage - 2;
  button2.id = 'button2';
  button2.addEventListener("click", ()=>{goLeft(2)});
  const button3 = document.createElement('button');
  button3.textContent = currentPage - 1;
  button3.id = 'button3';
  button3.addEventListener("click", ()=>{goLeft(1)});
  const button4 = document.createElement('button');
  button4.textContent = currentPage;
  button4.id = 'button4';
  const button5 = document.createElement('button');
  button5.textContent = currentPage +1;
  button5.id = 'button5';
  button5.addEventListener("click", ()=>{goRight(1)});
  const button6 = document.createElement('button');
  button6.textContent = currentPage + 2;
  button6.id = 'button6';
  button6.addEventListener("click", ()=>{goRight(2)});
  const button7 = document.createElement('button');
  button7.textContent = '>>';
  button7.id = 'button7';
  button7.addEventListener("click", ()=>{goRight(0)});
  PaginachionContainer.appendChild(button1);
  PaginachionContainer.appendChild(button2);
  PaginachionContainer.appendChild(button3);
  PaginachionContainer.appendChild(button4);
  PaginachionContainer.appendChild(button5);
  PaginachionContainer.appendChild(button6);
  PaginachionContainer.appendChild(button7);
}

function editPaginationBTN(){
  if (currentPage + 1 < pagecount){
    document.getElementById('button6').textContent=currentPage + 2; 
    document.getElementById('button6').style.display = 'inline-block';
  }else{
    document.getElementById('button6').style.display='none';
  }
  if (currentPage < pagecount){
    document.getElementById('button5').textContent=currentPage + 1; 
    document.getElementById('button5').style.display = 'inline-block';
  }else{
    document.getElementById('button5').style.display='none';
  }
  document.getElementById('button4').textContent=currentPage; 
  if (currentPage > 1){
    document.getElementById('button3').textContent=currentPage - 1; 
    document.getElementById('button3').style.display = 'inline-block';
  }else{
    document.getElementById('button3').style.display='none';
  }
  if (currentPage > 2){
    document.getElementById('button2').textContent=currentPage - 2; 
    document.getElementById('button2').style.display = 'inline-block';
  }else{
    document.getElementById('button2').style.display='none';
  }
}

function formatDate(dateString) { 
  const date = new Date(dateString); 
  const year = date.getFullYear(); 
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0'); 
 
  return `${year}-${month}-${day}`; 
} 
 
window.addEventListener('load', () => {
  const authToken = localStorage.getItem('token');
  if (authToken) {
    console.log('Токен получен из localStorage:', localStorage.getItem('token'));
    email=localStorage.getItem('email')
    document.getElementById('in').textContent=email;
    activate(email);
  } else {
    console.log('Токен не найден в localStorage.');
    window.location.href = '../pages/login.html'
  }
  paginationBTN();
  editPaginationBTN();
  loadIvents()
});

function loadIvents() {

  iventsContainer.innerHTML = '';
  pageSize = document.getElementById('iventscount').value;

  
  fetch('http://localhost:8080/promotions', { 
    method: 'GET', 
    headers: { 
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json' 
    },      
  })
  .then(response => { 
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text) }); 
    } 
    return response.json();
  }) 
  .then(data => {
    console.log(data);
    /*pagecount = data.totalPagesCount;
    const ivents = data.list;*/
    data.forEach(ivents => {
      const iventsBlock = iventsTemplate.content.cloneNode(true);
      
      iventsBlock.querySelector('.description').textContent =  `Описание: ${ivents.reason}`;
      iventsBlock.querySelector('.type').textContent = `Скидка: ${ivents.value}  ${ivents.type} на плотформе ${ivents.platformFor}`;
      iventsBlock.querySelector('.startDate').textContent =  `Дата начала: ${formatDate(ivents.start_date)}`;
      iventsBlock.querySelector('.endDate').textContent =  `Дата окончания: ${formatDate(ivents.end_date)}`;
      iventsBlock.querySelector('.ivents-block .img').src = `http://localhost:8080/files/${ivents.imageId}`;
      iventsBlock.querySelector('.ivents-block .img').alt = ivents.id; 
      
      iventsBlock.querySelector('.ivents-block').addEventListener('click', () => { 
        localStorage.setItem('selectedivents', ivents.id); 
        window.location.href = '../pages/ivent.html'; 
      });
      iventsContainer.appendChild(iventsBlock);     
    });
    editPaginationBTN();
  })
  .catch(error => { 
    console.error('Ошибка получения листа:', error); 
    alert('Ошибка получения листа: ' + error);
  }); 
}