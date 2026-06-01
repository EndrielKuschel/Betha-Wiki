// ==========================================================================
// VARIÁVEL GLOBAL
// ==========================================================================
let categoriaAtual = 'mensagens';

// ==========================================================================
// LÓGICA DE COPIAR TEXTO
// ==========================================================================
function copiarTexto(idElemento, botao) {
    const elemento = document.getElementById(idElemento);
    
    let texto = elemento.innerHTML;
    // Transforma os <br> do HTML em quebras de linha reais para preservar o Markdown/Jira
    texto = texto.replace(/<br\s*[\/]?>/gi, "\n");
    
    // Limpa outras tags HTML residuais
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = texto;
    const textoLimpo = tempDiv.textContent || tempDiv.innerText || "";
    
    navigator.clipboard.writeText(textoLimpo).then(() => {
        const textoOriginal = botao.innerText;
        
        botao.innerText = "✓ Copiado!";
        botao.classList.add("copiado");
        
        setTimeout(() => {
            botao.innerText = textoOriginal;
            botao.classList.remove("copiado");
        }, 1800);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}

// ==========================================================================
// LÓGICA DO TEMA (DARK MODE)
// ==========================================================================
const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    themeToggleBtn.classList.add('animated');
    setTimeout(() => {
        themeToggleBtn.classList.remove('animated');
    }, 500); 
});

// ==========================================================================
// LÓGICA DE FILTRO POR CATEGORIAS (MENU LATERAL)
// ==========================================================================
function filtrarCategoria(categoria, elementoClicado) {
    categoriaAtual = categoria;
    
    // Reseta a barra de pesquisa
    document.getElementById('search-input').value = '';
    
    // Atualiza o estilo dos links do menu
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    elementoClicado.classList.add('active');

    // Títulos dinâmicos e descrições
    const pageTitle = document.getElementById('page-title');
    const pageDesc = document.getElementById('page-desc');
    
    if (categoria === 'mensagens') {
        pageTitle.innerText = "Mensagens Padrões";
        pageDesc.innerText = "Clique no botão para copiar o template com a formatação correta para o chamado.";
    } else if (categoria === 'templates') {
        pageTitle.innerText = "Templates de Abertura";
        pageDesc.innerText = "Estruturas prontas para abertura de incidentes e envio para outras equipes.";
    } else if (categoria === 'links') {
        pageTitle.innerText = "Central de Ajuda";
        pageDesc.innerText = "Links úteis e documentações para dúvidas recorrentes dos clientes.";
    } else if (categoria === 'scripts') {
        pageTitle.innerText = "Scripts Úteis";
        pageDesc.innerText = "Chaves de importação de scripts para correções de dados e rotinas.";
    } else if (categoria === 'relatorios') {
        pageTitle.innerText = "Relatórios Úteis";
        pageDesc.innerText = "Chaves de importação de relatórios customizados.";
    }

    // Chama a função de busca com o input vazio para resetar os cards da tela
    buscarCards(''); 
}

// ==========================================================================
// FUNÇÃO AUXILIAR: REMOVER ACENTOS
// ==========================================================================
function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ==========================================================================
// LÓGICA DA BUSCA GLOBAL
// ==========================================================================
function buscarCards(termoForcado = null) {
    // Pega o termo da barra ou do bot, remove acentos e joga para minúsculo
    let termoBruto = termoForcado !== null ? termoForcado : document.getElementById('search-input').value;
    const termo = removerAcentos(termoBruto.toLowerCase().trim());
    
    const cards = document.querySelectorAll('.card');
    const pageTitle = document.getElementById('page-title');
    const pageDesc = document.getElementById('page-desc');

    // Se a barra estiver vazia, restaura a visualização da aba atual
    if (termo === '') {
        cards.forEach(card => {
            card.style.display = card.getAttribute('data-category') === categoriaAtual ? 'flex' : 'none';
        });

        if (categoriaAtual === 'mensagens') {
            pageTitle.innerText = "Mensagens Padrões";
            pageDesc.innerText = "Clique no botão para copiar o template com a formatação correta para o chamado.";
        } else if (categoriaAtual === 'templates') {
            pageTitle.innerText = "Templates de Abertura";
            pageDesc.innerText = "Estruturas prontas para abertura de incidentes e envio para outras equipes.";
        } else if (categoriaAtual === 'links') {
            pageTitle.innerText = "Central de Ajuda";
            pageDesc.innerText = "Links úteis e documentações para dúvidas recorrentes dos clientes.";
        } else if (categoriaAtual === 'scripts') {
            pageTitle.innerText = "Scripts Úteis";
            pageDesc.innerText = "Chaves de importação de scripts para correções de dados e rotinas.";
        } else if (categoriaAtual === 'relatorios') {
            pageTitle.innerText = "Relatórios Úteis";
            pageDesc.innerText = "Chaves de importação de relatórios customizados e visões específicas.";
        }
        
        // Devolve o destaque azul para o menu lateral correto
        document.querySelectorAll('.nav-link').forEach(link => {
            if(link.getAttribute('onclick').includes(categoriaAtual)) {
                link.classList.add('active');
            }
        });
        return 0;
    }

    // Modo Busca Global
    let encontrados = 0;
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    pageTitle.innerText = "Resultados da Busca";
    pageDesc.innerText = `Buscando por "${termoBruto}" em toda a Wiki...`;

    cards.forEach(card => {
        // Tira os acentos também do conteúdo dos cards para comparar
        const textoCard = removerAcentos(card.innerText.toLowerCase());
        
        // Compara com as palavras-chave
        if (textoCard.includes(termo)) {
            card.style.display = 'flex';
            encontrados++;
        } else {
            card.style.display = 'none';
        }
    });

    return encontrados;
}

// ==========================================================================
// LÓGICA DO CHATBOT FLUTUANTE 
// ==========================================================================
function toggleChat() {
    const chatWindow = document.getElementById('chatbot-window');
    chatWindow.classList.toggle('open');
    
    // Foca no input automaticamente ao abrir o chat
    if (chatWindow.classList.contains('open')) {
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 300); // Aguarda a animação de abertura terminar
    }
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        enviarMensagemChat();
    }
}

function enviarMensagemChat() {
    const inputField = document.getElementById('chat-input');
    const userText = inputField.value.trim();
    
    if (userText === '') return;

    adicionarBalaoChat(userText, 'user-message');
    inputField.value = '';

    const idDigitando = mostrarDigitando();

    setTimeout(() => {
        removerDigitando(idDigitando);
        processarRespostaBot(userText);
    }, 1200);
}

function processarRespostaBot(mensagem) {

    let msgLimpa = removerAcentos(mensagem.toLowerCase()).replace(/[?,.!]/g, '');
    let respostaBot = "";

    // -Saudações e Contexto Conversacional
    if (msgLimpa.match(/\b(oi|ola|bom dia|boa tarde|boa noite|opa)\b/)) {
        respostaBot = "Olá! Como posso ajudar a acelerar seu atendimento hoje? Me diga o que precisa procurar.";
        adicionarBalaoChat(respostaBot, 'bot-message');
        return;
    }

    if (msgLimpa.match(/\b(beethoven|ia|inteligencia artificial)\b/)) {
        respostaBot = "O Beethoven é o nosso Assistente Inteligente! Use o botão destacado no menu esquerdo para abrir o chat dele e gerar scripts do zero.";
        adicionarBalaoChat(respostaBot, 'bot-message');
        return;
    }

    if (msgLimpa.match(/\b(obrigado|vlw|valeu|top|show|obg)\b/)) {
        respostaBot = "Por nada! Estou sempre por aqui se precisar. 🚀";
        adicionarBalaoChat(respostaBot, 'bot-message');
        return;
    }

    // Extração de Palavras-Chave
    // Lista de palavras que o bot vai ignorar para focar no que importa
    const stopWords = ["o", "a", "os", "as", "um", "uma", "como", "qual", "quero", "saber", "sobre", "de", "do", "da", "em", "no", "na", "para", "por", "com", "me", "ajuda", "tem", "algum", "alguma", "fazer", "onde", "acho", "eu", "ver"];
    
    const arrayPalavras = msgLimpa.split(' ');
    
    // Filtra deixando apenas palavras úteis com mais de 2 letras
    const palavrasChave = arrayPalavras.filter(palavra => !stopWords.includes(palavra) && palavra.length > 2);
    
    let termoBusca = palavrasChave.join(' ');
    if (termoBusca === '') {
        termoBusca = msgLimpa; // Se filtrou tudo, tenta usar o texto original
    }

    // Joga o termo purificado na barra de pesquisa
    const searchBar = document.getElementById('search-input');
    searchBar.value = termoBusca; 
    
    const qtdEncontrada = buscarCards(termoBusca);

    if (qtdEncontrada > 0) {
        respostaBot = `Pronto! Encontrei ${qtdEncontrada} resultado(s) sobre "${termoBusca}" em toda a Wiki. Os cards já estão separados na sua tela. 👇`;
    } else {
        respostaBot = `Poxa, não encontrei nada exato sobre "${termoBusca}". Tente usar palavras-chave mais diretas como "senha", "relatório", "dba" ou verifique se não há erros de digitação.`;
        searchBar.value = '';
        buscarCards(''); // Restaura a tela se não achou
    }

    adicionarBalaoChat(respostaBot, 'bot-message');
}

// ==========================================================================
// FUNÇÕES DE INTERFACE DO CHATBOT
// ==========================================================================
function adicionarBalaoChat(texto, classeTipo) {
    const chatMessages = document.getElementById('chat-messages');
    const novaMensagem = document.createElement('div');
    novaMensagem.classList.add('message', classeTipo);
    novaMensagem.innerText = texto;
    chatMessages.appendChild(novaMensagem);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function mostrarDigitando() {
    const chatMessages = document.getElementById('chat-messages');
    const digitandoDiv = document.createElement('div');
    const uniqueId = 'typing-' + Date.now();
    
    digitandoDiv.id = uniqueId;
    digitandoDiv.classList.add('typing-indicator');
    digitandoDiv.innerHTML = '<span></span><span></span><span></span>';
    
    chatMessages.appendChild(digitandoDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return uniqueId;
}

function removerDigitando(id) {
    const digitandoDiv = document.getElementById(id);
    if (digitandoDiv) {
        digitandoDiv.remove();
    }
}