
export const up = (pgm) => {
    pgm.createTable('notas_fiscais', {
        id: 'id',
        pedido_id: {type: 'integer', references: 'pedidos'},
        numero: {type: 'integer', notNull: true},
        chave_acesso: {type: 'integer', notNull: true},
        status: {type: 'varchar(20)', check: "status IN ('emitida', 'cancelada', 'erro')"}
    })

    pgm.createTable('movimentacoes_estoque', {
        id: 'id',
        insumo_id: {type: 'integer', references: 'insumos'},
        tipo: {type: 'varchar(20)', check: "tipo IN ('entrada', 'saida', 'ajuste')", notNull: true},
        quantidade: {type: 'integer', notNull: true},
        motiivo: {type: 'varchar(20)', check: "tipo IN ('venda', 'compra', 'perda')", notNull: true},
        pedido_id: {type: 'integer', references: 'pedidos', default: null}
    })

};

export const down = (pgm) => {
    pgm.dropTable('movimentacoes_estoque')
    pgm.dropTable('notas_fiscais')
};
