// ===================================================
// 1. DADOS DOS PRODUTOS
// ===================================================

const produtos = [
    { id: 1, nome: "Buquê Clássico de Rosas", preco: 99.90 },
    { id: 2, nome: "Orquídea Phalaenopsis", preco: 149.90 },
    { id: 3, nome: "Arranjo de Flores Silvestres", preco: 79.90 }
];

// ===================================================
// 2. FUNÇÕES BASE DO CARRINHO (Compartilhadas)
// ===================================================

function getCarrinho() {
    const carrinhoJSON = localStorage.getItem('myfloricultura_carrinho');
    return carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('myfloricultura_carrinho', JSON.stringify(carrinho));
}


// ===================================================
// 3. LÓGICA DA PÁGINA INICIAL (index.html)
// ===================================================

function configurarAdicionarAoCarrinho() {
    const botoesAdd = document.querySelectorAll('.add-carrinho');
    
    botoesAdd.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const produtoElemento = e.target.closest('.produto');
            const produtoId = parseInt(produtoElemento.dataset.id);

            const produtoParaAdicionar = produtos.find(p => p.id === produtoId);

            if (produtoParaAdicionar) {
                adicionarItem(produtoParaAdicionar);
                
                // Feedback visual
                e.target.textContent = 'Adicionado!';
                e.target.disabled = true;
                setTimeout(() => {
                    e.target.textContent = 'Adicionar ao Carrinho';
                    e.target.disabled = false;
                }, 1000);
            }
        });
    });
}

function adicionarItem(produto) {
    let carrinho = getCarrinho();
    const itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    salvarCarrinho(carrinho);
}


// ===================================================
// 4. LÓGICA DA PÁGINA DO CARRINHO (carrinho.html)
// ===================================================

const listaCarrinhoDOM = document.getElementById('lista-carrinho');
const subtotalDOM = document.getElementById('subtotal');
const totalDOM = document.getElementById('total-compra');

function renderizarCarrinho() {
    const carrinho = getCarrinho();
    
    if (listaCarrinhoDOM) listaCarrinhoDOM.innerHTML = ''; // Verifica se o elemento existe
    
    let subtotal = 0;

    if (carrinho.length === 0) {
        if (listaCarrinhoDOM) {
            // Cria a mensagem de carrinho vazio
            const msg = document.createElement('p');
            msg.id = 'carrinho-vazio-msg';
            msg.textContent = 'Seu carrinho está vazio.';
            listaCarrinhoDOM.appendChild(msg);
        }
        
        const btnFinalizar = document.getElementById('btn-finalizar-compra');
        if (btnFinalizar) btnFinalizar.disabled = true;

    } else {
        const btnFinalizar = document.getElementById('btn-finalizar-compra');
        if (btnFinalizar) btnFinalizar.disabled = false;
        
        carrinho.forEach(item => {
            const totalItem = item.preco * item.quantidade;
            subtotal += totalItem;

            const itemHTML = document.createElement('div');
            itemHTML.classList.add('item-carrinho');
            itemHTML.dataset.id = item.id;
            
            itemHTML.innerHTML = `
                <span>${item.nome} (${item.quantidade}x)</span>
                <span>R$ ${totalItem.toFixed(2).replace('.', ',')}</span>
                <button class="remover-item" data-id="${item.id}">Remover</button>
            `;
            
            if (listaCarrinhoDOM) listaCarrinhoDOM.appendChild(itemHTML);
        });

        document.querySelectorAll('.remover-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idParaRemover = parseInt(e.target.dataset.id);
                removerItem(idParaRemover);
                renderizarCarrinho();
            });
        });
    }

    // Atualiza o resumo financeiro
    const subtotalFormatado = subtotal.toFixed(2).replace('.', ',');
    if (subtotalDOM) subtotalDOM.textContent = `R$ ${subtotalFormatado}`;
    if (totalDOM) totalDOM.textContent = `R$ ${subtotalFormatado}`; 
}

function removerItem(id) {
    let carrinho = getCarrinho();
    const index = carrinho.findIndex(item => item.id === id);

    if (index !== -1) {
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade -= 1;
        } else {
            carrinho.splice(index, 1);
        }
    }
    
    salvarCarrinho(carrinho);
}


// ===================================================
// 5. LÓGICA DE FINALIZAÇÃO DE COMPRA (carrinho.html)
// ===================================================

function configurarFinalizacao() {
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    const secaoFinalizacao = document.getElementById('finalizacao-compra');
    const formFinalizar = document.getElementById('form-finalizar');
    const secaoCarrinho = document.getElementById('secao-carrinho');
    const secaoSucesso = document.getElementById('compra-sucesso');
    
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if (secaoCarrinho) secaoCarrinho.style.display = 'none';
            if (secaoFinalizacao) {
                secaoFinalizacao.style.display = 'block'; 
                secaoFinalizacao.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (formFinalizar) {
        formFinalizar.addEventListener('submit', (evento) => {
            evento.preventDefault();

            localStorage.removeItem('myfloricultura_carrinho');

            if (secaoFinalizacao) secaoFinalizacao.style.display = 'none'; 
            if (secaoSucesso) {
                secaoSucesso.style.display = 'block';
                secaoSucesso.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}


// ===================================================
// 6. LÓGICA DA PÁGINA DE CONTATO (contato.html)
// ===================================================

function configurarEnvioContato() {
    const formContato = document.querySelector('#formulario-contato form');
    const secaoFormulario = document.getElementById('formulario-contato');
    const secaoSucesso = document.getElementById('contato-sucesso');
    
    if (formContato) {
        formContato.addEventListener('submit', (evento) => {
            evento.preventDefault(); 
            
            // Esconde o formulário
            if (secaoFormulario) secaoFormulario.style.display = 'none';

            // Mostra a mensagem de sucesso
            if (secaoSucesso) {
                secaoSucesso.style.display = 'block';
                secaoSucesso.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ===================================================
// 7. LÓGICA DO BOTÃO VOLTAR AO TOPO
// ===================================================

function configurarBotaoVoltarAoTopo() {
    const btnTopo = document.getElementById("btn-top");

    if (!btnTopo) return; 

    // 1. Mostrar/Esconder o botão ao rolar
    window.onscroll = function() {
        // Mostra o botão se o scroll vertical for maior que 100px
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            btnTopo.style.display = "block";
        } else {
            btnTopo.style.display = "none";
        }
    };

    // 2. Comportamento de clique (rolar suavemente)
    btnTopo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// ===================================================
// 8. INICIALIZAÇÃO
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a lógica da página correta
    if (document.body.id === 'index-page') {
        configurarAdicionarAoCarrinho();
    }

    if (document.body.id === 'carrinho-page') {
        renderizarCarrinho();
        configurarFinalizacao();
    }
    
    // Inicializa a lógica de contato
    if (document.querySelector('#formulario-contato')) {
        configurarEnvioContato();
    }

    // Inicializa o botão de voltar ao topo em todas as páginas
    configurarBotaoVoltarAoTopo();
});