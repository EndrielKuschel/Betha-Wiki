# 📚 Betha Wiki - Central de Conhecimento e Suporte

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

## 📖 Conheça a Betha Wiki
No ambiente de suporte e atendimento, agilidade e padronização são essenciais. A **Betha Wiki** é uma central de conhecimento em formato de *Single Page Application* (SPA) estática, desenvolvida para ser o braço direito do analista de suporte.

Criada com **HTML, CSS e JavaScript puros**, o projeto organiza scripts, relatórios, templates de mensagens e links úteis em uma interface moderna, rápida e responsiva. Sem depender de bancos de dados complexos, a Betha Wiki utiliza o próprio navegador do usuário para lembrar de suas preferências, garantindo uma experiência fluida e personalizada.

---

## ✨ Funcionalidades Principais

* **Busca em Tempo Real (Live Search):** Mecanismo de busca instantâneo que filtra os cards de conteúdo pela descrição ou título, sem necessidade de recarregar a página.
* **Beethoven (Agente Integrado):** Um assistente virtual (chatbot) embutido diretamente na interface para auxiliar o analista com dúvidas rápidas, mantendo o usuário focado sem precisar trocar de aba.
* **Modo Claro/Escuro Inteligente:** Sistema de temas estruturado com Variáveis CSS. A preferência de leitura (Dark/Light mode) é salva automaticamente no `localStorage` do navegador.
* **Assinatura Automática:** Um campo onde o analista insere seu nome uma única vez. A aplicação memoriza o dado via `localStorage` e o injeta dinamicamente na área de transferência durante a cópia de mensagens.
* **Cópia com 1-Clique (One-Click Copy):** Caixas de código estruturadas e botões que copiam relatórios e templates diretamente para a área de transferência, fornecendo feedback visual imediato de "Copiado!".
* **UI/UX Moderna e Responsiva:** Design elegante utilizando conceitos de *Glassmorphism*, categorias separadas por *badges* de cores exclusivas e menu lateral adaptável para dispositivos móveis.

---

## 🏗️ Arquitetura e Estrutura de Arquivos

O código foi projetado visando facilidade de manutenção e um *Design System* escalável através de variáveis nativas.

| Arquivo | Responsabilidade |
| :--- | :--- |
| `index.html` | Estrutura semântica da página, abrigando a *sidebar*, os *cards* de conteúdo, o modal do agente Beethoven e a barra de pesquisa. |
| `style.css` | Motor visual do projeto. Contém o *Design System* (paleta de cores, espaçamentos, bordas dinâmicas), regras de transição de temas e adaptações responsivas (`@media queries`). |
| `script.js` | Camada de interatividade. Gerencia o comportamento do motor de busca, a leitura/gravação no `localStorage`, as funções do `clipboard API`, lógica do chatbot e a alternância do Dark Mode. |

---

## 🚀 Como Utilizar

Como a Betha Wiki é uma aplicação puramente *Client-Side* (roda diretamente no navegador), não é necessária a instalação de bibliotecas, dependências como *Node.js* ou servidores locais, basta acessar: [Betha Wiki](https://github.com/EndrielKuschel/Betha-Wiki)

### Opção 1: Uso Local
1. Faça o clone deste repositório:
   ```bash
   git clone https://github.com/SeuUsuario/betha-wiki.git