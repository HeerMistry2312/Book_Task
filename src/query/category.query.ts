import { PipelineBuilder } from "../utils/pipelineBuilder";

export class CategoryPipelineBuilder{
    static allCategoryPipeline(page: number, pageSize: number,searchQuery?: string, sortBy?: string): any[]{
        const builder = new PipelineBuilder()
            .match({})
            .paginate(page, pageSize)
            .project({
                _id:0,
                name: 1
            })

            if (searchQuery) {
                builder.match({
                    $or: [
                        { name: { $regex: searchQuery, $options: "i" } },
                    ],
                });
            }

            if (sortBy) {
                builder.sort(sortBy);
            }

            return builder.build();
    }


    static categoryPipeline(id: string): any[]{
        const builder = new PipelineBuilder()
            .match({_id: id})
            .project({
                _id:0,
                name: 1
            })
            return builder.build();
    }

}
