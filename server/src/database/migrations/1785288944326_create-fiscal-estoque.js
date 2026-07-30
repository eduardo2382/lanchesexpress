
export const up = (pgm) => {
    pgm.createTable('notas_fiscais', {
        id: 'id',
        pedido_id: {type: 'integer', references: 'pedidos', notNull: true},
        numero: {type: 'varchar(50)'},
        chave_acesso: {type: 'integer'},
        status: {type: 'varchar(20)', check: "status IN ('emitida', 'cancelada', 'erro')", notNull: true, default: 'emitida'},
        emitida_em: {type: 'timestamp', default: pgm.func('current_timestamp')}
    })

    pgm.addConstraint('notas_fiscais', 'constraint_unica_pedidoId', 'UNIQUE(pedido_id)');

    pgm.createTable('movimentacoes_estoque', {
        id: 'id',
        insumo_id: {type: 'integer', references: 'insumos', notNull: true},
        tipo: {type: 'varchar(20)', check: "tipo IN ('entrada', 'saida', 'ajuste')", notNull: true},
        quantidade: {type: 'decimal(10,3)', notNull: true},
        motivo: {type: 'varchar(30)', check: "tipo IN ('venda', 'compra', 'perda', 'ajuste_manual')"},
        pedido_id: {type: 'integer', references: 'pedidos', default: null},
        criado_em: {type: 'timestamp', default: pgm.func('current_timestamp')}
    })

};

export const down = (pgm) => {
    pgm.dropTable('movimentacoes_estoque')
    pgm.dropTable('notas_fiscais')
};
