const loginButton = document.getElementById('in');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
let userMenuListenerAttached = false;

function activate(email){
  if (!userMenuListenerAttached) {
    loginButton.addEventListener('click', () => {
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    });
    loginButton.textContent = email + ' ▾';
    profileButton.style.display = 'inline-block';
    logoutButton.style.display = 'inline-block';

    profileButton.addEventListener('click', () => {
      window.location.href = 'file:///E:/TSU/Front/lab2/rof/profile.html'
    });

    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
        window.location.href = 'file:///E:/TSU/Front/lab2/log/login.html'
    });
    userMenuListenerAttached = true;
  }
}

window.addEventListener('load', () => {
  const authToken = localStorage.getItem('token');
  if (authToken) {
    email=localStorage.getItem('email')
    document.getElementById('in').textContent=email;
    activate(email);
  } else {
  }
});

$( function() { 
  $( "#birthdate" ).datepicker({ 
    dateFormat: "dd.mm.yy",
    changeMonth: true, 
    changeYear: true, 
    yearRange: "1900:2024",
  }); 
} ); 

$(function() { 

  $("#phone").keyup(function() { 
      let phone = $(this).val().replace(/\D/g, "");
      phone = phone.substring(0, 12);
      let formattedPhone = ""; 
      
      if (phone.length > 0) { 
        formattedPhone += "+7 ("; 
      }

        if (phone.length >= 4) { 
          formattedPhone += phone.substring(1, 4) + ") "; 
        } else { 
          formattedPhone += phone.substring(1, phone.length); 
        } 
        if (phone.length >= 7) { 
          formattedPhone += phone.substring(4, 7) + "-"; 
        } else if (phone.length > 4) { 
            formattedPhone += phone.substring(4, phone.length); 
        } 
        if (phone.length >= 9) { 
          formattedPhone += phone.substring(7, 9) + "-"; 
        } else if (phone.length > 7) { 
            formattedPhone += phone.substring(7, phone.length) ; 
        } 
        if (phone.length >= 11) { 
          formattedPhone += phone.substring(9, 11); 
        } else if (phone.length > 9) { 
            formattedPhone += phone.substring(9, phone.length); 
        } 
      $(this).val(formattedPhone); 
    }); 
  }
);

function formatDate(dateString) {
  const parts = dateString.split('.');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Месяцы в JavaScript нумеруются с 0
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day, 12, 0, 0, 0); // Устанавливаем нужное время

  const isoDateString = date.toISOString(); // Преобразуем в ISO 8601

  return isoDateString;
}
function register(){ 
  const fio = document.getElementById('fio').value;
  const birthdate = formatDate(document.getElementById('birthdate').value);
  const gender = document.getElementById('gender').value; 
  const phone = document.getElementById('phone').value;  
  const email = document.getElementById('email').value; 
  const password = document.getElementById('password').value; 

  if (email === '' || password === '') { 
    alert('Пожалуйста, заполните все поля!'); 
    return; 
  } 
  
  fetch('https://blog.kreosoft.space/api/account/register', { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json' 
    }, 
    body: JSON.stringify({ fullName: fio, password: password, email: email, birthdate: birthdate, gender: gender, phoneNumber: phone}) 
  }) 
  .then(response => { 
    if (!response.ok) { 
      return response.text().then(text => { throw new Error(text) }); 
    } 
    return response.json();
  }) 
  .then(data => { 
    
    console.log('Успешный вход:', data); 
    const token = data.token; 
    if (token) {  
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      window.location.href = 'file:///E:/TSU/Front/lab2/post/post.html';
      activate(email);
    } else {  
      console.error('Токен не найден в заголовке ответа.');  
    }  
  }) 
  .catch(error => { 
    console.error('Ошибка входа:', error); 
    alert('Ошибка входа: ' + error.message); 
  }); 
}