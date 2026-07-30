export const up = (pgm) => {
    pgm.createTable('categorias', {
        id: 'id',
        nome: { type: 'varchar(100)', notNull: true }
    });

    pgm.createTable('insumos', {
        id: 'id',
        nome: { type: 'varchar(50)', notNull: true }
    });

    pgm.createTable('atributos', {
        id: 'id',
        nome: { type: 'varchar(100)', notNull: true },
        tipo_medida: { type: 'varchar(20)', check: "tipo_medida IN ('unidade', 'peso', 'volume')", notNull: true },
        quantidade_atual: {type: 'integer', notNull: true, default: 0},
        quantidade_minima: {type: 'integer', notNull: true, default: 0}
    });

    pgm.createTable('produtos', {
        id: 'id',
        produto_pai_id: {type: 'integer', references: 'produtos', default: null},
        categoria_id: { type: 'integer', references: 'categorias', onDelete: 'SET NULL' },
        nome: { type: 'varchar(150)', notNull: true },
        tipo: { type: 'varchar(20)', check: "tipo IN ('simples', 'montavel', 'variavel')", notNull: true },
        preco_base: { type: 'decimal(10,2)', notNull: true, default: 0 },
        vai_para_cozinha: { type: 'boolean', notNull: true, default: true },
        ativo: { type: 'boolean', notNull: true, default: true },
    });
   
    pgm.createTable('produto_insumos', {
        produto_id: {type: 'integer', references: 'produtos'},
        insumo_id: {type: 'integer', references: 'insumos'},
        quantidade: {type: 'integer', check: "quantidade > 0", notNull: true}
    });
    
    pgm.createTable('produto_atributos', {
        produto_id: {type: 'integer', references: 'produtos'},
        atributo_id: {type: 'integer', references: 'atributos'},
        quantidade: {type: 'integer', check: "quantidade > 0", notNull: true}
    });

    pgm.createTable('opcoes', {
        id: 'id',
        nome: {type: 'varchar(100)', notNull: true},
        tipo: {type: 'varchar(20)', check: "tipo IN ('escolha', 'porcao')", notNull: true}
    })

    pgm.createTable('grupos_opcoes', {
        id: 'id',
        produto_id: {type: 'integer', references: 'produtos'},
        nome: {type: 'varchar(100)', notNull: true},
        obrigatorio: {type: 'boolean', default: true},
        tipo_selecao: {type: 'varchar(20)', check: "tipo_selecao IN ('unica', 'multipla')", notNull: true},
        tipo_preco: {type: 'varchar(20)', check: "tipo_preco IN ('soma', 'nao_aplica')", notNull: true}
    })

    pgm.createTable('grupo_opcao_itens', {
        id: 'id',
        grupo_id: {type: 'integer', references: 'grupos_opcoes'},
        opcao_id: {type: 'integer', references: 'opcoes'},
        preco: {type: "decimal(10,2)"}
    })

    pgm.createTable('grupo_opcao_item_insumos', {
        grupo_opcao_item_id: {type: 'integer', references: 'grupo_opcao_itens'},
        insumo_id: {type: 'integer', references: 'insumos'},
        quantidade: {type: 'integer', notNull: true}
    });
};

exports.down = (pgm) => {
  // ordem inversa, senão o Postgres reclama de FK
  pgm.dropTable('grupo_opcao_item_insumos');
  pgm.dropTable('grupo_opcao_itens');
  pgm.dropTable('grupos_opcoes');
  pgm.dropTable('opcoes');
  pgm.dropTable('produto_atributos');
  pgm.dropTable('produto_insumos');
  pgm.dropTable('produtos');
  pgm.dropTable('insumos');
  pgm.dropTable('atributos');
  pgm.dropTable('categorias');
};