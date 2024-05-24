import { Optional } from "sequelize";

interface CartAttributes {
    id: number;
    userId: number;
    totalAmount: number;
  }
  interface CartCreationAttributes extends Optional<CartAttributes, 'id'|'totalAmount'> {}

  export {CartAttributes, CartCreationAttributes}