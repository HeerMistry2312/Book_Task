export class PipelineBuilder {
    private pipeline: any[];

    constructor() {
        this.pipeline = [];
    }

    match(criteria: object): PipelineBuilder {
        this.pipeline.push({ $match: criteria });
        return this;
    }

    lookup(from: string, localField: string, foreignField: string, as: string): PipelineBuilder {
        this.pipeline.push({
            $lookup: { from, localField, foreignField, as }
        });
        return this;
    }

    unwind(path: string): PipelineBuilder {
        this.pipeline.push({ $unwind: path });
        return this;
    }

    project(projection: object): PipelineBuilder {
        this.pipeline.push({ $project: projection });
        return this;
    }

    group(grouping: object): PipelineBuilder {
        this.pipeline.push({ $group: grouping });
        return this;
    }

    sort(sortBy: string|undefined): PipelineBuilder {
        const sortField = sortBy!.startsWith("-") ? sortBy!.substring(1) : sortBy;
        const sortOrder = sortBy!.startsWith("-") ? -1 : 1;
        this.pipeline.push({ $sort: { [sortField!]: sortOrder } });
        return this;
    }

    paginate(page: number, pageSize: number): PipelineBuilder {
        const skip = (page - 1) * pageSize;
        this.pipeline.push({ $skip: skip }, { $limit: pageSize });
        return this;
    }

    build(): any[] {
        return this.pipeline;
    }
}