
const cpuSelect = document.getElementById('cpu');
const ramSelect = document.getElementById('ram');
const storageSelected = document.querySelectorAll('input[name="storage"]');


document.addEventListener('DOMContentLoaded', async () => {

    drawServers();

    const formBtn = document.getElementById('addbtn');
    document.getElementById('form').addEventListener('submit',async (e) => {
          e.preventDefault();
          refreshPrice();
          console.log('Agregando nuevo servidor');
          await addServer();
          
    });

});

cpuSelect.addEventListener('change', refreshPrice);
ramSelect.addEventListener('change', refreshPrice);
storageSelected.forEach(input => input.addEventListener('change', refreshPrice));



async function getServers(){

    const response = await fetch('https://694a518e1282f890d2d84beb.mockapi.io/tecpecsdata/computers');
    const data = await response.json();

    return data;
}

async function drawServers(){

    const data = await getServers();
    const lista = document.getElementById('cards');

    lista.innerHTML = '';

    for(const server of data){

        const div = document.createElement('div');
        div.className = `card mb-3 w-75`;
        div.dataset.id = server.id;
        div.innerHTML = `<div class="card-body">
                            <h5 class="card-title">${server.name}</h5>
                            <p class="card-text mb-1"><strong>Procesador:</strong> ${server.cpu} núcleos</p>
                            <p class="card-text mb-1"><strong>RAM:</strong> ${server.ram} GB</p>
                            <p class="card-text mb-1"><strong>Almacenamiento:</strong> ${server.storage}</p>
                            <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 deletebtn">
                                <i class="bi bi-trash-fill"></i>
                            </button>
                        </div>
                        `;        
        lista.appendChild(div);
        const deleteBtn = div.querySelector('.deletebtn');
        deleteBtn.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const id = card.dataset.id;
        deleteServer(id);
        div.remove();
    });

    }

}

async function addServer(){

    const name = document.getElementById('name').value;
    const cpu = document.getElementById('cpu').value;
    const ram = document.getElementById('ram').value;
    const storage = document.querySelector('input[name="storage"]:checked')?.value;

    const cpuPrice = Number(cpuSelect.options[cpuSelect.selectedIndex].dataset.price);
    const ramPrice = Number(ramSelect.options[ramSelect.selectedIndex].dataset.price);
    const storagePrice = Number(storageSelected[0].dataset.price);

    if(cpuPrice + ramPrice + storagePrice > 700){
        alert('El precio total del servidor supera el presupuesto');
        return;
    }

    console.log('Agregando nuevo servidor');




    const data = {
        name: name,
        cpu: cpu,
        ram: ram,
        storage: storage
    };
    console.log(data);

    try{
        await fetch('https://694a518e1282f890d2d84beb.mockapi.io/tecpecsdata/computers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }catch(err){
        console.error(err);
    }

    drawServers();
    document.querySelector("form").reset();
}

async function deleteServer(id){

     try {
        const response = await fetch(`https://694a518e1282f890d2d84beb.mockapi.io/tecpecsdata/computers/${id}`, { 
            method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar');
        const serverDeleted = await response.json();
        console.log('Servidor eliminado correctamente:', serverDeleted.name);
    } catch (err) {
        console.error(err);
    }


}

const storagePrice = Number(document.querySelector('input[name="storage"]:checked')?.dataset.price);

function refreshPrice(){
    
    let ramPrice = 0;
    let cpuPrice = 0;

    const cpuSelectedOption = cpuSelect.options[cpuSelect.selectedIndex];
    cpuPrice = Number(cpuSelectedOption.dataset.price);

    const ramSelectedOption = ramSelect.options[ramSelect.selectedIndex];
    ramPrice = Number(ramSelectedOption.dataset.price);

    const storageChecked = document.querySelector('input[name="storage"]:checked');
    const storagePrice = storageChecked ? Number(storageChecked.dataset.price) : 0;

    const price = cpuPrice + ramPrice + storagePrice;
    document.getElementById('price').textContent = "Total: " + price + " €";
} 