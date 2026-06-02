// ==========================================================================
// VARIÁVEL GLOBAL
// ==========================================================================
// Busca a última aba salva no navegador. Se não tiver nenhuma, o padrão é 'mensagens'
let categoriaAtual = localStorage.getItem('abaSelecionada') || 'mensagens'; 

// Executa automaticamente ao carregar a página para abrir na aba certa após o F5
document.addEventListener("DOMContentLoaded", () => {
    // Procura o link do menu que corresponde à aba salva
    const linkAtivo = Array.from(document.querySelectorAll('.nav-link')).find(link => 
        link.getAttribute('onclick').includes(categoriaAtual)
    );
    
    // Força o clique simulado para abrir a aba salva com toda a estilização correta
    if (linkAtivo) {
        filtrarCategoria(categoriaAtual, linkAtivo);
    }
});

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

    localStorage.setItem('abaSelecionada', categoria);
    
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
        pageTitle.innerText = "Templates Padrões";
        pageDesc.innerText = "Estruturas prontas para abertura de incidentes e envio para outras equipes.";
    } else if (categoria === 'links') {
        pageTitle.innerText = "Central de Ajuda";
        pageDesc.innerText = "Links úteis e documentações para dúvidas recorrentes dos clientes.";
    } else if (categoria === 'scripts') {
        pageTitle.innerText = "Scripts";
        pageDesc.innerText = "Chaves de importação de scripts para correções de dados e rotinas.";
    } else if (categoria === 'relatorios') {
        pageTitle.innerText = "Relatórios";
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
            pageTitle.innerText = "Templates Padrões";
            pageDesc.innerText = "Estruturas prontas para abertura de incidentes e envio para outras equipes.";
        } else if (categoriaAtual === 'links') {
            pageTitle.innerText = "Central de Ajuda";
            pageDesc.innerText = "Links úteis e documentações para dúvidas recorrentes dos clientes.";
        } else if (categoriaAtual === 'scripts') {
            pageTitle.innerText = "Scripts";
            pageDesc.innerText = "Chaves de importação de scripts para correções de dados e rotinas.";
        } else if (categoriaAtual === 'relatorios') {
            pageTitle.innerText = "Relatórios";
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

    if (msgLimpa.match(/\b(oi|ola|bom dia|boa tarde|boa noite|opa)\b/)) {
        respostaBot = "Olá! Como posso ajudar a acelerar seu atendimento hoje? Me diga o que precisa procurar (Ex: férias, lentidão, irrf).";
        adicionarBalaoChat(respostaBot, 'bot-message');
        return;
    }

    if (msgLimpa.match(/\b(beethoven|ia|inteligencia artificial)\b/)) {
        respostaBot = "O Beethoven é o nosso Assistente Inteligente! Use o botão com brilho (✨) no menu lateral esquerdo para abrir o chat dele e gerar scripts do zero.";
        adicionarBalaoChat(respostaBot, 'bot-message');
        return;
    }

    if (msgLimpa.match(/\b(obrigado|vlw|valeu|top|show|obg)\b/)) {
        respostaBot = "Por nada! Estou sempre por aqui se precisar agilizar seu suporte. 🚀";
        adicionarBalaoChat(respostaBot, 'bot-message');
        return;
    }

    // Motor de intenções
    const intencoes = [
        {
            padrao: /(encerrar|finalizar|concluir|fechar|sem resposta|nao responde|lgpd)/,
            termoBusca: "encerramento", 
            resposta: "Precisa finalizar um chamado? Separei as mensagens de encerramento padrão para você:"
        },
        {
            padrao: /(lento|lentidao|travando|caiu|fora do ar|instabilidade|demorando)/,
            termoBusca: "instabilidade", 
            resposta: "O cliente está relatando problemas de performance? Veja as mensagens e templates sobre instabilidade/lentidão:"
        },
        {
            padrao: /(ferias|coletivas|cancelamento de ferias|gozo)/,
            termoBusca: "ferias",
            resposta: "Encontrei estes artigos na Central de Ajuda sobre Férias:"
        },
        {
            padrao: /(imposto de renda|irrf|comprovante|rendimento|dirf|molestia|redutor)/,
            termoBusca: "irrf",
            resposta: "Assuntos relacionados a Imposto de Renda e Rendimentos. Veja os relatórios e artigos que encontrei:"
        },
        {
            padrao: /(13|decimo|decimo terceiro|adiantamento 13)/,
            termoBusca: "13",
            resposta: "Buscando sobre 13º salário? Aqui estão os scripts e artigos relacionados:"
        },
        {
            padrao: /(licenca|premio|averbacao)/,
            termoBusca: "premio",
            resposta: "Aqui estão os scripts para tratamento de Licença Prêmio e Averbações:"
        },
        {
            padrao: /(api|integracao|service layer|endpoint)/,
            termoBusca: "api",
            resposta: "Para desenvolvimento e integrações, consulte estas documentações de APIs:"
        },
        {
            padrao: /(diaria|diarias|viagem)/,
            termoBusca: "diaria",
            resposta: "Precisa importar ou tratar diárias? Veja os scripts disponíveis:"
        },
        {
            padrao: /(ausencia|afastamento|faltas)/,
            termoBusca: "afastamento",
            resposta: "Separei os scripts para exclusão ou importação de afastamentos/ausências:"
        }
    ];

    let intencaoIdentificada = false;

    // Tenta bater a frase do usuário com as regras de negócio
    for (let intencao of intencoes) {
        if (msgLimpa.match(intencao.padrao)) {
            const searchBar = document.getElementById('search-input');
            searchBar.value = intencao.termoBusca;

            const qtdEncontrada = buscarCards(intencao.termoBusca);
            
            respostaBot = `${intencao.resposta} (Encontrei ${qtdEncontrada} resultados 👇)`;
            adicionarBalaoChat(respostaBot, 'bot-message');
            intencaoIdentificada = true;
            break;
        }
    }

    // Fallback
    if (!intencaoIdentificada) {
        // Remove stop words básicas apenas se não achou intenção
        const stopWords = ["o", "a", "os", "as", "um", "uma", "como", "qual", "quero", "saber", "sobre", "de", "do", "da", "em", "no", "na", "para", "por", "com", "me", "ajuda", "tem", "algum", "alguma", "fazer", "onde", "acho", "eu", "ver"];
        const palavrasChave = msgLimpa.split(' ').filter(p => !stopWords.includes(p) && p.length > 2);
        let termoBusca = palavrasChave.join(' ') || msgLimpa;

        const searchBar = document.getElementById('search-input');
        searchBar.value = termoBusca; 
        const qtdEncontrada = buscarCards(termoBusca);

        if (qtdEncontrada > 0) {
            respostaBot = `Pronto! Encontrei ${qtdEncontrada} resultado(s) sobre "${termoBusca}". Os cards já estão separados na sua tela. 👇`;
        } else {
            respostaBot = `Poxa, não encontrei nada exato sobre "${termoBusca}". Tente usar palavras como "férias", "IRRF", "api" ou "lentidão".`;
            searchBar.value = '';
            buscarCards(''); // Restaura a tela original
        }
        adicionarBalaoChat(respostaBot, 'bot-message');
    }
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

// ==========================================================================
// LÓGICA DO MENU MOBILE
// ==========================================================================
const mobileBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');

if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    
    // Fecha o menu automaticamente quando clica em uma aba no celular
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
}