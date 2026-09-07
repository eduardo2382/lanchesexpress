const BASE_URL = '/api'

async function request(endpoint, options = {}) {
  let resposta = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
  })

  if (!resposta.ok) {
    let corpo = await resposta.json().catch(() => ({}))
    let erroInfo = corpo.error || {}

    let erro = new Error(erroInfo.message || `Erro ${resposta.status} ao acessar ${endpoint}`);
    erro.status = resposta.status;
    erro.code = erroInfo.code;
    erro.details = erroInfo.details;

    throw erro;
}

  if (resposta.status === 204) return null
  return resposta.json()
}

export const api = {
    categorias: {
        listar: (filtros = {}) => {
            let query = new URLSearchParams(filtros).toString()
            return request(`/categoria/${query ? `?${query}` : ''}`)
        },
        detalhe: (id) => request(`/categoria/${id}`),
        criar: (dadosCategoria) => request('/categoria', {
            method: 'POST',
            body: JSON.stringify(dadosCategoria)
        }),
        atualizar: (id, dados) => request(`/categoria/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(dados)
        }),
        atualizarStatus: (id, status) => request(`/categoria/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({status: status})
        }),
        deletar: (id) => request(`/categoria/${id}`, {
            method: 'DELETE'
        })
    },
    insumos: {
        listar: (filtros = {}) => {
            let query = new URLSearchParams(filtros).toString()
            return request(`/insumo/${query ? `?${query}` : ''}`)
        },
        criar: (dadosInsumo) => request('/insumo', {
            method: 'POST',
            body: JSON.stringify(dadosInsumo)
        }),
        atualizarStatus: (id, status) => request(`/insumo/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({status: status})
        }),
        atualizar: (id, dados) => request(`/insumo/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(dados)
        }),
        deletar: (id) => request(`/insumo/${id}`, {
            method: 'DELETE'
        })
    }
}