const baseUrl = 'http://192.168.1.131:3000';

// Carregar a lista de produtos ao iniciar a página
// Verifica se está na página de produtos antes de chamar renderizarProdutos
if (document.getElementById('produtos-container')) {
    renderizarProdutos();
}


// Função para renderizar a lista de produtos
async function renderizarProdutos() {
    try {
        const response = await fetch(`${baseUrl}/produtos`);
        const produtos = await response.json();
        
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    
        const container = document.getElementById('produtos-container');
 
        container.innerHTML = ''; // Limpa o conteúdo antes de preencher
    
        produtos.forEach(produto => {
            // Garantir que preco seja um número
            const preco = parseFloat(produto.preco);
    
            const produtoCard = document.createElement('div');
            produtoCard.classList.add('produto-card');
    
            produtoCard.innerHTML = `
                <div class="info">
                    <strong>ID:</strong> ${produto.id} <br>
                    <strong>Nome:</strong> ${produto.nome} <br>
                    <strong>Descrição:</strong> ${produto.descricao} <br>
                    <strong>Preço:</strong> R$${preco.toFixed(2)} <br>
                </div>
                <div class="actions">
                    <button class="editar" onclick='editarProduto(${JSON.stringify(produto)})'>Editar</button>
                    <button class="excluir" onclick="confirmarExcluir(${produto.id})">Excluir</button>
                </div>
            `;
        
            container.appendChild(produtoCard);
        });
    } catch (error) {
        alert(`Não foi possível carregar os produtos. ${error}`)
    }
}

// Função para editar produto (passando os dados via URL)
function editarProduto(produto) {
    const id = encodeURIComponent(produto.id);
    const nome = encodeURIComponent(produto.nome);
    const descricao = encodeURIComponent(produto.descricao);
    const preco = encodeURIComponent(produto.preco);

    window.location.href = `atualizarProduto.html?id=${id}&nome=${nome}&descricao=${descricao}&preco=${preco}`;
}

// Função para confirmar exclusão
function confirmarExcluir(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        excluirProduto(id);
    }
}

// Função para excluir produto
async function excluirProduto(id) {
    try {
        const response = await fetch(`${baseUrl}/produtos/${id}`, {method: 'DELETE',});

        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);

    } catch (error) {
        alert("Não foi possível excluir o produto.")
    }
    renderizarProdutos();
}



// Função para criar produto
async function criarProduto() {
    try {
        const nome = document.getElementById('produto-nome').value;
        const descricao = document.getElementById('produto-descricao').value;
        const preco = parseFloat(document.getElementById('produto-preco').value); // Converte para float
    
        const response = await fetch(`${baseUrl}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                descricao,
                preco
            })
        });

        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        
        alert('Produto adicionado com sucesso!');
        window.location.href = 'produtos.html'; // Redireciona de volta para a página de produtos
        
    } catch (error) {
        alert("Não foi possível criar o produto.")
    }
}

// Função para carregar os dados do produto na página de atualização
async function carregarDadosProduto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const nome = params.get('nome');
    const descricao = params.get('descricao');
    const preco = params.get('preco');

    // Preenche os campos do formulário com os dados do produto
    if (id && nome && descricao && preco) {
        document.getElementById('produto-nome').value = decodeURIComponent(nome);
        document.getElementById('produto-descricao').value = decodeURIComponent(descricao);
        document.getElementById('produto-preco').value = decodeURIComponent(preco);
    } else {
        console.error("Parâmetros não encontrados na URL");
    }
}

// Função para atualizar produto
async function atualizarProduto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const nome = document.getElementById('produto-nome').value;
    const descricao = document.getElementById('produto-descricao').value;
    const preco = parseFloat(document.getElementById('produto-preco').value); // Converte para float

    await fetch(`${baseUrl}/produtos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            descricao,
            preco
        })
    });

    //alert('Produto atualizado com sucesso!');
    window.location.href = 'produtos.html'; // Redireciona de volta para a página de produtos
}

// Chama a função para carregar os dados do produto ao carregar a página de edição
if (window.location.pathname.includes('atualizarProduto.html')) {
    carregarDadosProduto();
}
