const KEY_BD = '@horasextra'


var listaRegistros = {
    ultimoIdGerado:0,
    funcionarios:[]
}


var FILTRO = ''


function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}


function pesquisar(value){
    FILTRO = value;
    desenhar()
}


function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        var data = listaRegistros.funcionarios;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( funcionario => {
                return expReg.test( funcionario.nomes ) || expReg.test( funcionario.hora ) || expReg.test( funcionario.data )
            } )
        }
        data = data
        
    
            .map( funcionario => {
                return `<tr>
                        <td>${funcionario.id}</td>
                        <td>${funcionario.nomes}</td>
                        <td>${funcionario.hora}</td>
                        <td>${funcionario.data}</td>
                        
                        <td>
                            
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertFuncionario(nomes, hora, data,){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.funcionarios.push({
        id, nomes, hora, data
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function editFuncionario(id, nomes, hora, data){
    var funcionario = listaRegistros.funcionarios.find( funcionario => funcionario.id == id )
    funcionario.nomes = nomes;
    funcionario.hora = hora;
    funcionario.data = data;
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function deleteFuncionario(id){
    listaRegistros.funcionarios = listaRegistros.funcionarios.filter( funcionario => {
        return funcionario.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro? '+id)){
        deleteFuncionario(id)
    }
}


function limparEdicao(){
    document.getElementById('nomes').value = ''
    document.getElementById('hora').value = ''
    document.getElementById('data').value = ''
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const funcionario = listaRegistros.funcionarios.find( funcionario => funcionario.id == id )
            if(funcionario){
                
                document.getElementById('nomes').value = funcionario.hora
                document.getElementById('hora').value = funcionario.data
                document.getElementById('data').value = funcionario.data
            }
        }
        document.getElementById('hora').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nomes: document.getElementById('nomes').value,
        hora: document.getElementById('hora').value,
        data: document.getElementById('data').value,
    }
    if(data.id){
        editFuncionario(data.id, data.nomes, data.hora, data.data)
    }else{
        insertFuncionario( data.nomes, data.hora, data.data)
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})
function funcao_pdf() {
    var pegar_dados = document.getElementById('dados').innerHTML

    var janela = window.open('','', '');
    janela.document.write('<html><head>');
    janela.document.write('</head>');
    janela.document.write('<body');
    janela.document.write(pegar_dados);
    janela.document.write('</body> </html>');
    janela.document.close();
    janela.print();
}