const validar = (expresion, input, campo)=>{
    var error = document.querySelector(`.error${campo}`);
    const nombre = input;
    if(nombre.value === "" || nombre.value === null || expresion.test(input.value) == false){
        error.classList.replace("d-none", "d-block")
        campos[campo] = false;
    }else{
        error.classList.replace("d-block", "d-none")
        campos[campo] = true;
    } 
}
const logearte = async (e)=>{
    switch(e.target.name){
        case "username":
            validar(expresiones.usuario, e.target, "Usuario");
        break;
        case "password":
            validar(expresiones.password, e.target, "Contra");
        break;
        case "mail":
            validar(expresiones.mail, e.target, "Mail");
        break;
        case "password2":
            validar(expresiones.password, e.target, "Contra2");
        break;
        case "mail2":
            validar(expresiones.mail, e.target, "Mail2");
        break;
        case "File":
            validar(expresiones.file, e.target, "File");
        break;
        case "Comentario":
            validar(expresiones.comentario, e.target, "Comentario");
        break
    }
}
const campos = {
	Usuario: false,
	Contra: false,
	Mail: false,
    Contra2: false,
    Mail2: false,
    File: false,
    Comentario: false
}
document.querySelector("#btn-login").addEventListener("click", ()=>{
    $("#login").modal('show');
    document.querySelector("#registro").addEventListener("click",()=>{
        $("#registracion").modal('show');
    })
})
const expresiones = {
	usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
	password: /^.{6,12}$/, // 6 a 12 digitos.
	mail: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, //algo@algo.algo
    file: /^[a-zA-Z0-9_.+-]/,
    comentario: /^.{4,255}$/
}
const form = document.querySelector("#form")
const formReg = document.querySelector("#formReg")
const inputs = document.querySelectorAll("#form input")
const inputsReg = document.querySelectorAll("#formReg input")
document.querySelector(".file").addEventListener("change", logearte)
inputs.forEach((input)=>{
    input.addEventListener("keyup", logearte);
    input.addEventListener("blur", logearte);
})
inputsReg.forEach((input)=>{
    input.addEventListener("keyup", logearte);
    input.addEventListener("blur", logearte);
})
const cargar = ar =>{
    const reader = new FileReader();
    reader.readAsArrayBuffer(ar)
    reader.addEventListener("load", e=>{
        if(document.querySelector(".imgResultado") !== null) document.querySelector(".imgResultado").remove()
        let file = new Blob([new Uint8Array(e.currentTarget.result)],{type: "image"})
        let url = URL.createObjectURL(file)
        let img = document.createElement("img")
        img.setAttribute("src", url)
        img.setAttribute("Width", "400rem")
        img.setAttribute("height", "400rem")
        img.classList.add("imgResultado", "ml-5")
        document.querySelector(".divImgResultado").appendChild(img)
    })
}
document.querySelector(".file").addEventListener("change",(e)=>{
    cargar(document.querySelector(".file").files[0])
})
form.addEventListener("submit", async e =>{
    e.preventDefault();
    if(campos.Contra && campos.Mail){
        let email = document.querySelector("#email").value;
        let contra = document.querySelector("#password").value;
        firebase.auth().signInWithEmailAndPassword(email, contra)
        .then((userCredential) => {
            var user = userCredential.user;
            document.querySelector('.mensaje-exito').classList.remove("d-none");
            document.querySelector('.mensaje-fallo').classList.add('d-none')
            setTimeout(() => {
                location.reload();
		    }, 2000);
        })
        .catch((e) => {
            document.querySelector('.mensaje-fallo').classList.remove('d-none')
            console.log(e)
        });
	}else{document.querySelector('.mensaje-fallo').classList.remove('d-none');}
})
formReg.addEventListener("submit", async e =>{
    e.preventDefault();
    if(campos.Contra2 && campos.Mail2 && campos.Usuario && campos.File){
        let email = document.querySelector("#email2").value;
        let contra = document.querySelector("#password2").value;
        let nombre = document.querySelector("#username").value;
        let file = document.querySelector(".file").files[0]
        console.log("fase 1")
        let upload = firebase.storage().ref(`imgPerfil/${file.name}`).put(file)
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,function(snapshot){
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                break;
            }
        },function(error){
            console.log(error)
            document.querySelector(".errorFile").classList.add("d-none")
        },function(){
            firebase.storage().ref(`imgPerfil/`).child(file.name).getDownloadURL().then((url)=>{
                console.log("fase 3")
                firebase.auth().createUserWithEmailAndPassword(email, contra)
                .then((userCredential) => {
                    console.log("fase 4")
                    var user = userCredential.user;
                    user.updateProfile({
                        displayName: nombre,
                        photoURL: url
                    }).then(function() {
                        firebase.database().ref('usuarios/' + `user${user.uid}`).set({
                            uid: user.uid,
                            username: nombre,
                            email: email,
                            profile_picture : url
                        }).then(()=>{
                            document.querySelector('.mensaje-exito2').classList.remove("d-none");
                            document.querySelector('.mensaje-fallo2').classList.add('d-none')
                            document.querySelector(".errorFile").classList.add("d-none")
                            setTimeout(() => {
                                location.reload();
                            }, 2000);
                        }).catch(function(error) {
                            document.querySelector('.mensaje-fallo2').classList.remove('d-none')
                            console.log(error.message)
                        });
                    }).catch(function(error) {
                        document.querySelector('.mensaje-fallo2').classList.remove('d-none')
                        console.log(error.message)
                    });
                })
            })
        })
	}else{document.querySelector('.mensaje-fallo2').classList.remove('d-none');}
})
window.addEventListener("load",()=>{
    firebase.storage().ref(`img/`).child(`FondoConPochoclos.png`).getDownloadURL().then(function(url) {
        document.body.style.backgroundImage = `url("${url}")`
    })
    firebase.storage().ref(`img/`).child(`FilmCult Icono v2.png`).getDownloadURL().then(function(url) {
        document.querySelector(".logo").src = url
    })
    firebase.storage().ref(`img/`).child(`FilmCult Icono.png`).getDownloadURL().then(function(url) {
        document.querySelector(".logo2").src = url
        document.querySelector("#logo2").src = url
    })
    firebase.auth().onAuthStateChanged((user) => {
        if(navigator.platform == "MacIntel")console.log("tenes una mac? gastastaste lo que vale un tesla en una compu que tiene el rendimiento de una play 3????")
        if (user) {
            console.log("hay usuario")
            var nombre = user.displayName;
            var src = user.photoURL;
            var nav = document.querySelector("#nav")
            nav.removeChild(document.querySelector("#btn-login"))
            var div = document.createElement("div")
            var modal = document.createElement("div")
            var modalContent = document.createElement("div")
            var modalDialog = document.createElement("div")
            var footer = document.createElement("div")
            var btn = document.createElement("button")
            var img = document.createElement("img")
            modalContent.innerHTML = `
            <div class="modal-header modalColor">
                <h4 class="modal-title">Bienvenido ${nombre}</h4>
                <img src= "${src}" class="perfil rounded-circle">
            </div>
            <div class="modal-body ">
                <p class="text-dark">Nombre: ${nombre}</p>
                <p class="text-dark">Mail: ${user.email}</p>
                <p class="text-dark">ID: ${user.uid}</p>
            </div>`
            modal.classList.add("modalCuenta", "modal", "fade");
            modalContent.classList.add("modal-content")
            modalDialog.classList.add("modal-dialog")
            img.src = src;
            img.classList.add("rounded-circle", "perfil", "ml-5")
            img.addEventListener("click", ()=>{
                $(".modalCuenta").modal('show');
            })
            btn.classList.add("btn-cerrar-sesion")
            btn.innerText= "Cerrar sesion"
            footer.classList.add("modal-footer", "footerColor2")
            div.appendChild(img)
            nav.insertBefore(div, document.querySelector(".navbar-toggler"))
            footer.appendChild(btn)
            modalContent.appendChild(footer)
            modalDialog.appendChild(modalContent)
            modal.appendChild(modalDialog)
            document.body.appendChild(modal)
            btn.addEventListener("click", ()=>{
                firebase.auth().signOut().then(()=>{
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                })
                .catch(e=>{
                    console.log(e)
                })
            })
        } else console.log("no hay usuario")
    });
})