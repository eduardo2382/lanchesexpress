/**
 * modal.js
 * Sistema de modais reutilizável — client/public/shared/js/modal.js
 *
 * Uso:
 *   import { ModalSpinner, ModalConfirmar, ModalInput } from '/shared/js/modal.js';
 *
 *   const spinner = new ModalSpinner('Salvando...');
 *   spinner.open();
 *   await fetch(...);
 *   spinner.close();
 *
 *   const confirmou = await new ModalConfirmar({
 *     titulo: 'Excluir categoria',
 *     mensagem: 'Essa ação não pode ser desfeita.',
 *   }).open();
 *   if (confirmou) { ... }
 *
 *   const novoNome = await new ModalInput({
 *     titulo: 'Editar nome',
 *     valorInicial: categoria.nome,
 *   }).open();
 *   if (novoNome !== null) { ... }
 */

// Contador global de modais abertos, usado para empilhar z-index
// quando um modal abre outro (ex: confirmação dentro de edição).
let modaisAbertos = 0;

export class Modal {  
  constructor(app, { fechavel = true } = {}) {
    this.fechavel = fechavel;
    this.overlay = null;
    this.app = app
  }

  render() {
    throw new Error('render() deve ser implementado pela subclasse');
  }

  /**
   * Monta e insere o modal no DOM.
   * Subclasses que precisam retornar um valor (confirmar/input) devem
   * sobrescrever open() para envolver esta chamada numa Promise.
   */
  open() {
    if (this.overlay) return; // evita abrir duplicado

    modaisAbertos += 1;

    this.overlay = document.createElement('div');
    this.overlay.className =
      'fixed inset-0 flex items-center justify-center bg-black/50 p-4';
    this.overlay.style.zIndex = String(1000 + modaisAbertos);
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');

    const conteudo = this.render();
    this.overlay.appendChild(conteudo);

    if (this.fechavel) {
      // clique no overlay (fora do card) fecha o modal
      this.overlay.addEventListener('click', (evento) => {
        if (evento.target === this.overlay) this.close();
      });
    }

    this.app.appendChild(this.overlay);
    this.app.classList.add('overflow-hidden');
  }

  /**
   * Remove o modal do DOM e limpa listeners.
   * Subclasses com Promise devem chamar super.close() dentro do seu close(resultado).
   */
  close() {
    if (!this.overlay) return;

    this.overlay.remove();
    this.overlay = null;

    modaisAbertos = Math.max(0, modaisAbertos - 1);
    if (modaisAbertos === 0) {
      this.app.classList.remove('overflow-hidden');
    }
  }
}

/**
 * Modal de carregamento. Não é fechável por ESC/clique fora —
 * só fecha via chamada explícita de .close(), quando a operação terminar.
 */
export class ModalSpinner extends Modal {
  constructor(app, mensagem = 'Carregando...') {
    super(app, { fechavel: false });
    this.mensagem = mensagem;
  }

  render() {
    const card = document.createElement('div');
    card.className =
      'bg-white rounded-lg shadow-lg px-6 py-5 flex items-center gap-3';
    card.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span class="text-gray-700 text-sm">${this._escapar(this.mensagem)}</span>
    `;
    return card;
  }

  /** Permite trocar a mensagem sem fechar/reabrir o modal. */
  atualizarMensagem(mensagem) {
    this.mensagem = mensagem;
    if (this.overlay) {
      const span = this.overlay.querySelector('span');
      if (span) span.textContent = mensagem;
    }
  }

  _escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }
}

/**
 * Modal de confirmação. open() retorna uma Promise<boolean>:
 * true se confirmou, false se cancelou ou fechou (ESC/clique fora).
 */
export class ModalConfirmar extends Modal {
  constructor(app, {
    titulo,
    mensagem,
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar'
  }) {
    super(app, { fechavel: true });
    this.titulo = titulo;
    this.mensagem = mensagem;
    this.textoConfirmar = textoConfirmar;
    this.textoCancelar = textoCancelar;
    this._resolve = null;
  }

  open() {
    return new Promise((resolve) => {
      this._resolve = resolve;
      super.open();
    });
  }

  close(resultado = false) {
    if (this._resolve) {
      this._resolve(resultado);
      this._resolve = null;
    }
    super.close();
  }

  render() {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-lg w-full max-w-sm p-6';

    const corBotaoConfirmar = this.perigo
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-blue-600 hover:bg-blue-700';

    card.innerHTML = `
      <h2 class="text-lg font-semibold text-gray-900">${this._escapar(this.titulo)}</h2>
      <p class="mt-2 text-sm text-[#737373]">${this._escapar(this.mensagem)}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button type="button" data-acao="cancelar"
          class="px-4 py-2 text-sm rounded-md border border-[#E5E5E5] text-gray-700 active:bg-gray-50">
          ${this._escapar(this.textoCancelar)}
        </button>
        <button type="button" data-acao="confirmar"
          class="px-4 py-2 text-sm font-bold rounded-md text-white bg-black active:bg-white">
          ${this._escapar(this.textoConfirmar)}
        </button>
      </div>
    `;

    card.querySelector('[data-acao="cancelar"]').addEventListener('click', () => this.close(false));
    card.querySelector('[data-acao="confirmar"]').addEventListener('click', () => this.close(true));

    return card;
  }

  _escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }
}

/**
 * Modal com campo de texto (ex: editar nome de uma categoria).
 * open() retorna uma Promise<string|null>:
 * a string digitada se confirmou, null se cancelou ou fechou.
 */
export class ModalInput extends Modal {
  /**
   * @param {Object} opcoes
   * @param {string} opcoes.titulo
   * @param {string} [opcoes.valorInicial='']
   * @param {string} [opcoes.placeholder='']
   * @param {string} [opcoes.textoConfirmar='Salvar']
   * @param {string} [opcoes.textoCancelar='Cancelar']
   */
  constructor(app, {
    titulo,
    valorInicial = '',
    placeholder = '',
    textoConfirmar = 'Salvar',
    textoCancelar = 'Cancelar',
  }) {
    super(app, { fechavel: true });
    this.titulo = titulo;
    this.valorInicial = valorInicial;
    this.placeholder = placeholder;
    this.textoConfirmar = textoConfirmar;
    this.textoCancelar = textoCancelar;
    this._resolve = null;
    this._input = null;
  }

  open() {
    return new Promise((resolve) => {
      this._resolve = resolve;
      super.open();
      // foca e seleciona o texto assim que o modal entra no DOM
      this._input?.focus();
      this._input?.select();
    });
  }

  close(resultado = null) {
    if (this._resolve) {
      this._resolve(resultado);
      this._resolve = null;
    }
    super.close();
  }

  render() {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-lg w-full max-w-sm p-6';

    card.innerHTML = `
      <h2 class="text-lg font-semibold text-gray-900">${this._escapar(this.titulo)}</h2>
      <input type="text" data-campo="valor"
        class="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="${this._escapar(this.placeholder)}"
        value="${this._escapar(this.valorInicial)}">
      <div class="mt-6 flex justify-end gap-3">
        <button type="button" data-acao="cancelar"
          class="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
          ${this._escapar(this.textoCancelar)}
        </button>
        <button type="button" data-acao="confirmar"
          class="px-4 py-2 text-sm rounded-md text-white bg-black hover:bg-black">
          ${this._escapar(this.textoConfirmar)}
        </button>
      </div>
    `;

    this._input = card.querySelector('[data-campo="valor"]');

    const confirmar = () => this.close(this._input.value);

    card.querySelector('[data-acao="cancelar"]').addEventListener('click', () => this.close(null));
    card.querySelector('[data-acao="confirmar"]').addEventListener('click', confirmar);
    this._input.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter') confirmar();
    });

    return card;
  }

  _escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }
}