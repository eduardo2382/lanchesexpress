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
    let erro = await resposta.json().catch(() => ({}))
    throw new Error(erro.mensagem || `Erro ${resposta.status} ao acessar ${endpoint}`)
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
        atualizar: (id, dados) => request('/categoria', {
            method: 'PATCH',
            body: JSON.stringify(dados)
        }),
        deletar: (id) => request('/categoria', {
            method: 'DELETE'
        })
    }
}