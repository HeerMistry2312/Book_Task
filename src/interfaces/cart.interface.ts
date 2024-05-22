import { Optional } from "sequelize";

interface CartAttributes {
    id: number;
    userId: number;
  }
  interface CartCreationAttributes extends Optional<CartAttributes, 'id'> {}

  export {CartAttributes, CartCreationAttributes}