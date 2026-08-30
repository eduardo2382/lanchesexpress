
export const up = (pgm) => {
    pgm.createTable('pedidos', {
        id: 'id',
        valor_total: {type: 'decimal(10,2)', notNull: true},
        criado_em: {type: 'timestamp', default: pgm.func('current_timestamp')},
        status: {type: 'varchar(15)', check: "status IN ('recebido', 'cancelado') ", notNull: true, default: 'recebido'}
    })

    pgm.createTable('pedido_itens', {
        id: 'id',
        pedido_id: {type: 'integer', references: 'pedidos'},
        produto_id: {type: 'integer', references: 'produtos'},
        quantidade: {type: 'integer', notNull: true, default: 1},
        preco_unitario: {type: 'decimal(10,2)', notNull: true},
        observacao: {type: 'varchar(100)'}
    })

    pgm.createTable('pedido_item_opcoes', {
        id: 'id',
        pedido_item_id: {type: 'integer', references: 'pedido_itens', notNull: true},
        grupo_opcao_item_id: {type: 'integer', references: 'grupo_opcao_itens', notNull: true},
        preco_aplicado: {type: 'decimal(10,2)'},
        quantidade: {type: 'integer', notNull: true, default: 1}
    })

    pgm.createTable('formas_pagamento', {
        id: 'id',
        nome: {type: 'varchar(50)', notNull: true},
        status: {tytpe: 'varchar(10)', check: "status IN ('ativo', 'excluido') ", default: 'ativo'}
    })

    pgm.addConstraint('formas_pagamento', 'constraint_unica_nome', 'UNIQUE(nome)');

    pgm.createTable('pedido_pagamentos', {
        id: 'id',
        pedido_id: {type: 'integer', references: 'pedidos', notNull: true},
        forma_pagamento_id: {type: 'integer', references: 'formas_pagamento'},
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
