const form = document.querySelector('form')
const h2 = document.querySelector('h2')

function deposit(){
  form.action = '/bank/deposit'
  form.style.display = 'block'
  h2.innerHTML='存款'
}

function withdraw(){
  form.action = '/bank/withdraw'
  form.style.display = 'block'
  h2.innerHTML='提款'
}