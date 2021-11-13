const i = document.title
const guardarComentario = ()=>{
    firebase.auth().onAuthStateChanged(user=>{
        const textArea = document.querySelector("#textArea");
        if(/^.{4,255}$/.test(textArea.value)){
            document.querySelector(".errorComentario").classList.add('d-none')
            let datoss = {
                nombre: user.displayName,
                texto: textArea.value,
                uid: user.uid,
                urlFoto: user.photoURL
            }
            let newPostKey = firebase.database().ref().child('posts').push().key;
            firebase.database().ref(`reviews/review${i}/comentarios/${newPostKey}`).set(datoss)
        }else document.querySelector(".errorComentario").classList.remove('d-none')
    })
}
const borrarComentario = (id)=> firebase.database().ref(`reviews/review${i}/comentarios/${id}`).set({
    nombre: null,
    texto: null,
    urlFoto: null,
    uid: null
})
window.addEventListener("DOMContentLoaded", ()=>{
    firebase.auth().onAuthStateChanged((user) => {
        firebase.storage().ref(`img/`).child(`review${i}.png`).getDownloadURL().then(function(url){
            firebase.database().ref(`reviews/review${i}`).on("value", async (e)=>{
                const datos = e.val()
                document.querySelector(".container-fluid").setAttribute("style","font-size:1.5em")
                document.querySelector("#img").src = url
                document.title = datos["titulo"]
                document.querySelector("#titulo").innerText = datos["titulo"]
                document.querySelector("#descripcion").innerText = datos["descripcion"]
                let comentarios = datos["comentarios"]
                let divComentarios = document.querySelector("#comentarios")
                let j =0;
                divComentarios.innerHTML = ""
                for(comentario in comentarios){
                    let nombre = comentarios[comentario]["nombre"]
                    let texto = comentarios[comentario]["texto"]
                    let url = comentarios[comentario]["urlFoto"]
                    let id = comentarios[comentario]["uid"]
                    let media = document.createElement("div")
                    media.setAttribute("style","background-color:#69318986")
                    media.setAttribute("id",`comentario${j}`)
                    media.classList.add("media","ml-5", "mb-5")
                    let img = document.createElement("img")
                    img.classList.add("perfil","rounded-circle", "align-self-start", "mr-3")
                    img.setAttribute("style", "cursor: default")
                    img.src = url
                    media.appendChild(img)
                    let mediaBody = document.createElement("div")
                    mediaBody.classList.add("media-body")
                    let titulo = document.createElement("h6")
                    let descripcion = document.createElement("p")
                    titulo.innerText = nombre
                    descripcion.innerText = texto
                    mediaBody.appendChild(titulo)
                    mediaBody.appendChild(descripcion)
                    if(user){
                        if(user.uid == id){
                            let btn = document.createElement("button")
                            btn.innerText = "Borrar"
                            btn.setAttribute("data-id", comentario)
                            btn.classList.add("btn-cerrar", "btn-borrar")
                            btn.setAttribute("style","font-size:0.55em")
                            mediaBody.appendChild(btn)
                        }
                    }
                    media.appendChild(mediaBody)
                    divComentarios.appendChild(media)
                    j++;
                    const btnsBorrar = document.querySelectorAll(".btn-borrar")
                    btnsBorrar.forEach(btn=>{
                        btn.addEventListener("click", async (e)=>{
                            console.log(e.target.dataset.id)
                            await borrarComentario(e.target.dataset.id)
                        })
                    })
                }
                if(j == 0) document.querySelector("#msg").classList.remove("d-none")
                if(user == null)document.querySelector("#form").remove()
            })
        })
    })
})
const comentarios = document.querySelector("#comentarios")
const textArea = document.querySelector("#textArea");
textArea.setAttribute("style", "background-color:#69318986")
document.querySelector("#enviarComentario").addEventListener("click", async (e)=>{
    e.preventDefault();
    guardarComentario();
})
