import { Optional } from "sequelize";

interface CategoryAttributes {
    id: number;
    name: string;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, "id"> {}

export { CategoryAttributes, CategoryCreationAttributes }