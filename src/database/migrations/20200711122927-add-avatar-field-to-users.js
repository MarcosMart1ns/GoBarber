
module.exports = {
  up: async (queryInterface, Sequelize) => {
   return queryInterface.addColumn('users','avatar_id',{
     type: Sequelize.INTEGER,
     references: {model: 'files', key: 'key'},
     onUpdate: 'CASCADE',
     onDelete: 'SET NULL',
     allowNull: true,
   })
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('users', 'avatar_id');
  }
};