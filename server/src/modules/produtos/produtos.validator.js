const { ValidationError } = require('../../error/AppError.js')

const CAMPOS_PERMITIDOS_PRODUTO = ['produto_pai_id', 'categoria_id', 'nome', 'tipo', 'preco_base', 'vai_para_cozinha', 'status', 'insumos', 'grupos']
const CAMPOS_PERMITIDOS_GRUPO = ['nome', 'obrigatorio', 'tipo_selecao', 'tipo_preco', 'status']
const CAMPOS_PERMITIDOS_VARIACOES = ['nome', 'preco_base', 'atributos', 'insumos']
const TIPOS_VALIDOS = ['simples', 'montavel']
const STATUS_VALIDOS_QUERY = ['ativo', 'inativo', 'excluido']
const TIPO_SELECAO_VALIDOS = ['unica', 'multipla']
const TIPO_PRECO_VALIDOS = ['soma', 'nao_aplica']

const isLowercase = (str) => str === str.toLowerCase()

exports.validateCreateCampos = (body) => {
    let camposBody = body ? Object.keys(body) : []

    if(camposBody.length == 0) throw new ValidationError('Nenhum campo enviado')

    let camposInvalid = camposBody.filter((c) => !CAMPOS_PERMITIDOS_PRODUTO.includes(c))

    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if(!body.nome || body.nome.length == 0) throw new ValidationError('Nome do produto faltando!', {campo: 'nome', motivo: 'obrigatorio'})
    if(!isLowercase(body.nome)) throw new ValidationError('Nome do produto deve ser minusculo!', {campo: 'nome', motivo: 'invalido'})

    if(!body.categoria_id) throw new ValidationError('Id da categoria do produto faltando!', {campo: 'categoria_id', motivo: 'obrigatorio'})

    if(!body.tipo) throw new ValidationError('Tipo do produto faltando!', {campo: 'tipo', motivo: 'obrigatorio'})
    if(!TIPOS_VALIDOS.includes(body.tipo)) throw new ValidationError('Tipo do produto deve ser: simples ou montavel', {campo: 'tipo', motivo: 'invalido'})
    if(body.tipo === 'montavel' && !Array.isArray(body.grupos)) throw new ValidationError('Grupos é obrigatorio para produto montavel', {campo: 'grupos', motivo: 'obrigatorio'})

    if(body.preco_base && (typeof body.preco_base) != 'number') throw new ValidationError('Preco base deve ser um numero')

    if(!Array.isArray(body.insumos)) throw new ValidationError('Insumos deve ser uma lista', {campo: 'insumos', motivo: 'invalido'})   
}

exports.validateCreateVariavelCampos = (body) => {
    if(!body.nome || body.nome.length == 0) throw new ValidationError('Nome do produto faltando!', {campo: 'nome', motivo: 'obrigatorio'})
    if(!isLowercase(body.nome)) throw new ValidationError('Nome do produto deve ser minusculo!', {campo: 'nome', motivo: 'invalido'})

    if(!body.categoria_id) throw new ValidationError('Id da categoria faltando!', {campo: 'categoria_id', motivo: 'obrigatorio'})

    if(!body.variacoes || body.variacoes.length == 0) throw new ValidationError('Produto sem variacoes!')

    if(!Array.isArray(body.variacoes)) throw new ValidationError('Variacoes deve ser um array!', {campo: 'variacoes', motivo: 'invalido'})

    body.variacoes.forEach((variacao) => {
        this.validateVariacao(variacao)
    })
}

exports.validateVariacao = (variacao) => {
    let camposVar = Object.keys(variacao)

    if(camposVar.length == 0) throw new ValidationError('Nenhum campo da variacao enviado')

    let camposInvalid = camposVar.filter((c) => !CAMPOS_PERMITIDOS_VARIACOES.includes(c))

    let camposMissing = CAMPOS_PERMITIDOS_VARIACOES.filter((c) => !camposVar.includes(c) && c != 'insumos')

    if(camposInvalid.length > 0) throw new ValidationError(`Campos de variacao invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})
    if(camposMissing.length > 0) throw new ValidationError(`Campos de variacao faltantes: ${camposMissing.join(', ')}`, {campo: camposMissing, motivo: 'obrigatorio'})

    if((typeof variacao.nome) != 'string' || variacao.nome.length == 0) throw new ValidationError('Nome da variacao faltando!', {campo: 'nome', motivo: 'obrigatorio'})

    if((typeof variacao.preco_base) != 'number') throw new ValidationError('Preco base deve ser um numero!', {campo: 'preco_base', motivo: 'invalido'})

    if(variacao.atributos.length == 0) throw new ValidationError('Variacao sem atributos!')

    if(!Array.isArray(variacao.atributos)) throw new ValidationError('Atributos deve ser um array!', {campo: 'atributos', motivo: 'invalido'})
}

exports.validateUpdateCampos = (body) => {
    let camposBody = body ? Object.keys(body) : []
    if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar')

    let camposInvalid = camposBody.filter((c) => !CAMPOS_PERMITIDOS_PRODUTO.includes(c))
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if(camposBody.includes('insumos')) throw new ValidationError('Nao e possivel atualizar os insumos do produto', {campo: 'insumos', motivo: 'invalido'})
    if(camposBody.includes('grupos')) throw new ValidationError('Nao e possivel atualizar os grupos do produto', {campo: 'grupos', motivo: 'invalido'})

    if(!body.nome && !isLowercase(body.nome)) throw new ValidationError('Nome do produto deve ser minusculo!', {campo: 'nome', motivo: 'invalido'})

    if(body.status && !['ativo', 'inativo'].includes(body.status)) throw new ValidationError('Status deve ser: ativo ou inativo')

    if(body.vai_para_cozinha && (typeof body.vai_para_cozinha) !== 'boolean') throw new ValidationError('Vai para cozinha deve ser um booleano!')
    
    if(body.preco_base && (typeof body.preco_base) != 'number') throw new ValidationError('Preco base deve ser um numero')
}

exports.validateUpdateVariacaoCampos = (body) => {
    let camposBody = body ? Object.keys(body) : []
    if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar')

    let camposInvalid = camposBody.filter((c) => !['nome', 'preco_base', 'insumos', 'vai_para_cozinha', 'status'].includes(c))
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if(camposBody.includes('atributos')) throw new ValidationError('Nao é possivel atualizar os atributos do produto', {campo: 'atributos', motivo: 'invalido'})
    if(camposBody.includes('produto_pai_id')) throw new ValidationError('Nao é possivel atualizar o produto pai', {campo: 'produto_pai_id', motivo: 'invalido'})

    if(body.nome && !isLowercase(body.nome)) throw new ValidationError('Nome do produto deve ser minusculo!', {campo: 'nome', motivo: 'invalido'})

    if(body.status && !['ativo', 'inativo'].includes(body.status)) throw new ValidationError('Status invalido!', {campo: 'status', motivo: 'invalido'})

    if(body.vai_para_cozinha && (typeof body.vai_para_cozinha) !== 'boolean') throw new ValidationError('Vai para cozinha deve ser um booleano!')
    
    if(body.preco_base && (typeof body.preco_base) != 'number') throw new ValidationError('Preco base deve ser um numero')
}

exports.validateUpdateCamposGrupo = (body) => {
    let camposBody = body ? Object.keys(body) : []
    if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar')

    let camposInvalid = camposBody.filter((c) => !CAMPOS_PERMITIDOS_GRUPO.includes(c))
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if(body.nome && !isLowercase(body.nome)) throw new ValidationError('Nome do grupo deve ser minusculo!', {campo: 'nome', motivo: 'invalido'})

    if(body.obrigatorio && (typeof body.obrigatorio) != 'boolean') throw new ValidationError('Campo obrigatorio deve ser um booleano')

    if(body.tipo_selecao && !TIPO_SELECAO_VALIDOS.includes(body.tipo_selecao)) throw new ValidationError('Tipo de selecao do grupo deve ser: unica ou multipla', {campo: 'tipo_selecao', motivo: 'invalido'})

    if(body.tipo_preco && !TIPO_PRECO_VALIDOS.includes(body.tipo_preco)) throw new ValidationError('Tipo de preco do grupo deve ser: soma ou nao_aplica', {campo: 'tipo_preco', motivo: 'invalido'})
}

exports.validateUpdateInsumos = (body) => {
    let camposBody = body ? Object.keys(body) : []

    if(camposBody.length === 0 || !body.insumos || body.insumos.length == 0) throw new ValidationError('Sem insumos para atualizar!')

    let camposInvalid = camposBody.filter((c) => c !== 'insumos')

    if(camposInvalid.length > 0) throw new ValidationError('So e possivel atualizar insumos')

    if(!Array.isArray(body.insumos)) throw new ValidationError('Insumos precisa ser um array')

    let insumos = body.insumos

    for(let insumo of insumos){
        if((typeof insumo.quantidade) != 'number') throw new ValidationError('Quantidade deve ser do tipo number', {campo: `insumo: ${insumo.insumo_id}`, motivo: 'invalido'})
    }
}

exports.validateUpdateStatusCampos = (body) => {
    if(!body) throw new ValidationError('Nenhum campo para atualizar!', {campo: 'body', motivo: 'invalido'})

    if(!body.status) throw new ValidationError('Status faltando!', {campo: 'status', motivo: 'obrigatorio'})

    let camposInvalid = Object.keys(body).filter((c) => c != 'status')
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})
    
    if(!['ativo', 'inativo'].includes(body.status)) throw new ValidationError('Status deve ser: ativo ou inativo', {campo: 'status', motivo: 'invalido'})
}

exports.validateUpdatePrecoItem = (body) => {
    let camposBody = Object.keys(body)
    let camposInvalid = camposBody.filter((c) => c != 'preco')

    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if(!body.preco) throw new ValidationError('Preco faltando!')
    if((typeof body.preco) != 'number') throw new ValidationError('Preco deve ser do tipo number!', {campo: 'preco', motivo: 'invalido'})
}

exports.validateGrupo = (grupo) => {
    if(!grupo.nome || grupo.nome == '') throw new ValidationError('Nome do grupo faltando!', {campo: 'nome', motivo: 'obrigatorio'})

    if(!isLowercase(grupo.nome)) throw new ValidationError('Nome do grupo deve ser minusculo!', {campo: 'nome', motivo: 'invalido'})

    if(!grupo.tipo_selecao || !TIPO_SELECAO_VALIDOS.includes(grupo.tipo_selecao)) throw new ValidationError('Tipo de selecao do grupo deve ser: unica ou multipla', {campo: 'tipo_selecao', motivo: 'invalido'})
    if(!grupo.tipo_preco || !TIPO_PRECO_VALIDOS.includes(grupo.tipo_preco)) throw new ValidationError('Tipo de preco do grupo deve ser: soma ou nao_aplica', {campo: 'tipo_preco', motivo: 'invalido'})

    if(grupo.itens.length == 0) throw new ValidationError('Grupo sem itens', {campo: 'itens grupo', motivo: 'obrigatorio'})
}

exports.validateItem = (item) => {
    if(!item.opcao_id) throw new ValidationError('Id da opcao faltando', {campo: 'opcao_id', motivo: 'obrigatorio'})

    if(!item.preco) throw new ValidationError('Preco da opcao faltando', {campo: 'preco_opcao', motivo: 'obrigatorio'})

    if((typeof item.preco) != 'number') throw new ValidationError('Preco da opcao deve ser do tipo number!', {campo: 'preco_opcao', motivo: 'invalido'})

    if(item.insumos && !Array.isArray(item.insumos)) throw new ValidationError('Insumos deve ser um array!', {campo: 'insumos', motivo: 'invalido'})
}

exports.validateQueryStatus = (queryStatus) => {
    let statusList = queryStatus ? queryStatus.split(',') : ['ativo']    

    let statusInvalid = statusList.filter((s) => !STATUS_VALIDOS_QUERY.includes(s))
    if(statusInvalid.length > 0) throw new ValidationError(`Status invalido: ${statusInvalid.join(', ')}`, {campo: 'status', motivo: 'invalido'})
    
    return statusList
}