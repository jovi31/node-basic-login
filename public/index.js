const popups = document.querySelectorAll('.popup')

popups.forEach(popup => {
  popup.onclick = function(e) {
    const parent = e.target.parentNode
    parent.removeChild(e.target)
  }
})

const userImgEditBtn = document.querySelector('#userImage > .img-edit-button')
if (userImgEditBtn) {
  const userImg = document.querySelector('#userImage > img')
  const imgUrlInput = document.querySelector('#userImage > input')

  userImgEditBtn.onclick = function(e) {
    e.preventDefault()
    imgUrlInput.classList.toggle('hide')
    imgUrlInput.focus()
  }

  imgUrlInput.onchange = function(e) {
    userImg.src = imgUrlInput.value
  }

  imgUrlInput.addEventListener('focusout', function(e) {
    this.classList.toggle('hide')
  })
}

const navigationLinks = document.querySelectorAll('.nav-itens a')
navigationLinks.forEach(link => {
  if(link.pathname === window.location.pathname) {
    link.classList.add('active-link')
  }
})