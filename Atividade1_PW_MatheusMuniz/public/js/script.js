
var page = "add-task"; // página atual
var tasks = {} // variável local para armazenar o localStorage e permitir mudanças mais rápidas

window.onload = function() {
    /*
        inicia a página coletando os cards do localStorage
    */
    getLocal()
    drawPageCards()
}

function changeWindow(toPage){
    /*
        Altera entre as páginas A fazer e Arquivadas
    */  
    changeAddTask(original=true)

    if(toPage == page){
        return;
    }

    document.querySelector("section.page").classList.toggle("add-task")
    document.querySelector("section.page").classList.toggle("archive-title")
    page = toPage

    drawPageCards()
}

function getCardId(){
    /*
        Essa função permite que os cards tenham sempre id diferentes e ao mesmo tempo permite não ter um número sempre crescente desse id
    */
    var id = 0
    const integerArray = Object.keys(tasks).map(element => parseInt(element))
  
    while (integerArray.find(e => e === id) != null){
        id += 1
    }
    return id
}


function changeAddTask(original=false){
    if(!original){
        document.querySelector("section.page > .add-task > .add-task-form").style.display = "flex";
        document.querySelector("section.page > .add-task > .add-task-button").style.display = "none";
    }else{
        document.querySelector("section.page > .add-task > .add-task-form").style.display = "none";
        document.querySelector("section.page > .add-task > .add-task-button").style.display = "flex";
    }
}


function handleCheckbox(checkbox) {
    /*
        Garante que será selecionada apenas uma cor
    */
    var checkboxes = document.getElementsByName('colors');
    checkboxes.forEach(function(currentCheckbox) {
        if (currentCheckbox !== checkbox) {
            currentCheckbox.checked = false;
        }
    });
}


function setLocal(){
    /*
        Responsável por salvar a persistencia local
    */
    localStorage.setItem(`tasks`, JSON.stringify(tasks));
}


function getLocal(){
    /*
        Responsável por pegar os dados da persistencia local (localStorage)
    */
    var data = JSON.parse(localStorage.getItem(`tasks`))
    if(data == null){
        tasks = {}
        return
    }
    tasks = data
}


function drawPageCards(){
    /*
        Executa o desenho no DOM de cada um dos cards daquela página
    */
    document.querySelector("section.tasks").innerHTML = ""
    for(var id in tasks){
        drawCard(tasks[id])
    }
}


function drawCard(card){
    /*
        Função que cria os elementos do DOM e insere as subfunçoes necessárias para os clicks
    */
    if(page === "add-task"){
        if(card.archived){
            return
        }
    }else{
        if(!card.archived){
            return
        }
    }

    let divCard = document.createElement("div")
    divCard.classList.add("task-card")
    if(card.done){
        divCard.classList.add("done")
    }
    divCard.classList.add(card.color)
    divCard.id = card.id
    
    let header = document.createElement("div")
    header.className = "header"

    let span = document.createElement("span")
    
    let box = document.createElement("img")
    box.src = "public/assets/unchecked.png"
    if(page == "add-task"){
        box.onclick = function(){
            tasks[card.id].done = !tasks[card.id].done
            setLocal()

            divCard.classList.toggle("done")
            
            if(tasks[card.id].done){
                span.textContent = "Concluída"
                box.src = "public/assets/checked.png"
                arcDeleteIcon.src = "public/assets/archive-color.png"
            }else{
                span.textContent = "Não concluída"
                box.src = "public/assets/unchecked.png"
                arcDeleteIcon.src = "public/assets/archive-gray-scale.png"
            }
        }
    }

    header.appendChild(box)
    header.appendChild(span)

    let description = document.createElement("div")
    description.className = "description"
    description.textContent = card.description

    let archiveDelete = document.createElement("div")
    archiveDelete.className = "archive-delete"

    let arcDeleteIcon = document.createElement("img")
    arcDeleteIcon.onclick = function(){
        if(page == "archive-title"){
            removeCard(card.id)
        }else{
            if(tasks[card.id].done){
                moveToArchive(card.id)
            }
        }
    }
    
    archiveDelete.appendChild(arcDeleteIcon)
    
    divCard.appendChild(header)
    divCard.appendChild(description)
    divCard.appendChild(archiveDelete)
    
    if(tasks[card.id].done){
        span.textContent = "Concluída"
        box.src = "public/assets/checked.png"
        arcDeleteIcon.src = "public/assets/archive-color.png"
    }else{
        span.textContent = "Não concluída"
        box.src = "public/assets/unchecked.png"
        arcDeleteIcon.src = "public/assets/archive-gray-scale.png"
    }
    
    if(page == "archive-title"){
        arcDeleteIcon.src = "public/assets/trash-color.png"
    }

    document.querySelector("section.tasks").appendChild(divCard)    
}


function moveToArchive(id){
    document.getElementById(id).remove()
    tasks[id].archived = true
    setLocal()
}


function removeCard(id){
    document.getElementById(id).remove()
    delete tasks[id]
    setLocal()
}


document.getElementById("addButton").addEventListener("click", function(e){
    /*
        eventListener para o botão de adicionar task
    */ 

    // previne a atualização da página
    e.preventDefault();

    // obtem a cor selecionada
    let checkboxes = document.getElementsByName("colors")
    var color = null;
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            color = checkbox.value;
        }
    });

    // obtem a descrição inserida
    var description = document.getElementById("description")


    // faz a validação das entradas e emite uma mensagem de erro para cada uma
    if (description.value === "") {
        alert("Você deve fornecer uma descrição")
        return
    } else if (color === null) {
        alert("Você deve fornecer uma cor")
        return
    }

    // pega um id que não existe
    let id = getCardId()

    // criar o objeto do novo card
    let cardData = {
        done:false,
        archived:false,
        description:description.value,
        color:color,
        id:parseInt(id, 10),
    }

    // limpa os valores de input
    description.value = ""
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            checkbox.checked = false
        }
    });

    // adiciona o novo card tanto no localStorage quando na variável local, além de desenha o novo card no DOM
    tasks[id] = cardData
    setLocal()
    drawCard(cardData)
})