
export const up = (pgm) => {
    pgm.createTable('pedidos', {
        id: 'id',
        produto_id: {type: 'integer', references: 'produtos'},
        criado_em: {type: 'timestamp', default: 'now'}
    })

    pgm.createTable('pedido_itens', {
        id: 'id',
        pedido_id: {type: 'integer', references: 'pedidos'},
        produto_id: {type: 'integer', references: 'produtos'},
        quantidade: {type: 'integer', notNull: true},
        preco_unitario: {type: 'decimal(10,2)', notNull: true},
        observacao: {type: 'varchar(100)'}
    })

    pgm.createTable('pedido_item_opcoes', {
        id: 'id',
        pedido_item_id: {type: 'integer', references: 'pedido_itens'},
        grupo_opcao_item_id: {type: 'integer', references: 'grupo_opcao_itens'},
        preco_aplicado: {type: 'decimal(10,2)', notNull: true},
        quantidade: {type: 'integer'}
    })

    pgm.createTable('formas_pagamento', {
        id: 'id',
        nome: {type: 'varchar(20)'}
    })

    pgm.createTable('pedido_pagamentos', {
        pedido_id: {type: 'integer', references: 'pedidos'},
        forma_pagamento: {type: 'integer', references: 'formas_pagamento'},
        valor: {type: 'decimal(10,2)', notNull: true}
    })

};

export const down = (pgm) => {
    pgm.dropTable('pedido_pagamentos')
    pgm.dropTable('formas_pagamento')
    pgm.dropTable('pedido_item_opcoes')
    pgm.dropTable('pedido_itens')
    pgm.dropTable('pedidos')
};
