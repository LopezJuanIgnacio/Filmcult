window.onload = ()=>{
    document.querySelector("#cosoEste").classList.add("disabled")
    document.querySelector("#cartelera").classList.add("disabled")
    var container = document.createElement("div")
    container.classList.add("container-fluid", "pt-5", "mt-5")
    var titulo = document.createElement("h1")
    titulo.textContent = "Bienvenidos a nuestra cartelera semanal"
    titulo.classList.add("titulo", "text-center", "mt-5", "mb-5")
    container.appendChild(titulo);
    var tabla = document.createElement("table") 
    tabla.classList.add("table", "table-responsive", "mb-5" ,"ml-md-5","pl-md-4") 
    var thead = document.createElement("thead")
    thead.classList.add("thead-dark")
    var tr = document.createElement("tr")
    tr.innerHTML=`<th scope="col">Dia</th>`
    for(var i = 0; i < 5; i++){
        var th =document.createElement("th")
        th.textContent = `Hora ${i+1}`
        tr.appendChild(th)
    }
    thead.appendChild(tr)
    var tbody = document.createElement("tbody")
    tbody.classList.add("text-white", "footerColor")
    var database = firebase.database();
    for(let i = 0; i <= 6; i++){
        database.ref(`${i}/`).on("value",(e)=>{
            const datos = e.val();
            var tr = document.createElement("tr")
            var th = document.createElement("th")
            th.scope = "row";
            th.textContent = datos["dia"]
            tr.appendChild(th)
            for(var i = 1; i < 6; i++){
                var th = document.createElement("th")
                th.scope = "col";
                th.textContent = datos[`hora ${i}`]
                tr.appendChild(th)
            }
            tbody.appendChild(tr)
        })
    }

    tabla.appendChild(thead)
    tabla.appendChild(tbody)
    container.appendChild(tabla)
    document.body.insertBefore(container, document.querySelector("#login"))
} 