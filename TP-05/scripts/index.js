window.onload = ()=>{
    for(let i = 1;i <= 6;i++){
        let card = document.querySelector(`.card${i}`)
        firebase.storage().ref(`img/`).child(`review${i}.png`).getDownloadURL().then(function(url) {
            card.style.backgroundImage = `url("${url}")`
            firebase.database().ref(`reviews/review${i}`).on("value",e=>{
                const datos = e.val()
                document.querySelector(`#card${i}h`).innerText = datos["titulo"]
                document.querySelector(`#card${i}p`).innerText = datos["descripcion"]
                document.querySelector(`#card${i}a`).href = `reviews/review${i}.html`
            })
        })
    }
    for(let i = 1;i <= 7;i++){
        firebase.storage().ref(`img/`).child(`film${i}.png`).getDownloadURL().then(function(url) {
            document.querySelector(`.cImg${i}`).src = url
        })
    }
}