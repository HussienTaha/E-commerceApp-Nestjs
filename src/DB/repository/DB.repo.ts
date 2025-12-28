import { DeleteResult, Model, PopulateOptions } from "mongoose";
import { HydratedDocument, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { PaginatedResult } from "src/common/interfaces";


      export class DBRepo< TDocument> {
        constructor( protected readonly model: Model<TDocument>) {}

  async create(data: Partial<TDocument>): Promise<HydratedDocument<TDocument>> {
    return this.model.create(data);
  }
  async findOne(
    filter: RootFilterQuery<TDocument>,
    select?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.model.findOne(filter, select, options).populate(options?.populate as any);
  }

async findOneQ(
  filter: RootFilterQuery<TDocument>,
  select?: ProjectionType<TDocument>,
  options?: QueryOptions<TDocument>
) {
  let query = this.model.findOne(filter, select, options);

  if (options?.populate) {
    query = query.populate(options.populate as any);
  }

  return query;
}





  async find(
  filter: RootFilterQuery<TDocument>,
  select?: ProjectionType<TDocument>,
  options?: QueryOptions<TDocument>
): Promise<HydratedDocument<TDocument>[]> {
  return await this.model.find(filter, select, options);
}
async Find({
  filter,
  select,
  options,
}: {
  filter: RootFilterQuery<TDocument>;
  select?: ProjectionType<TDocument>;
  options?: QueryOptions<TDocument>;
}): Promise<HydratedDocument<TDocument>[]> {
  return this.model.find(filter, select, options);
}
async paginate({
  filter,
  query,
  select,
  options,
  populate,
}: {
  filter: RootFilterQuery<TDocument>;
  query: {
    page: number;
    limit: number;
  };
  select?: ProjectionType<TDocument>;
  options?: QueryOptions<TDocument>;
  populate?: PopulateOptions | PopulateOptions[];
}): Promise<PaginatedResult<TDocument>> {
  let { page, limit } = query;

  page = Math.max(1, Number(page) || 1);
  limit = Math.min(50, Math.max(1, Number(limit) || 10));

  const skip = (page - 1) * limit;

  const finalOptions: QueryOptions<TDocument> = {
    ...options,
    skip,
    limit,
  };

  const count = await this.model.countDocuments(filter);
  const numberOfPages = Math.ceil(count / limit);

  const docs = await this.model
    .find(filter, select, finalOptions)
    .populate(populate ?? [])
    .lean<TDocument[]>();

  return {
    docs,
    currentPage: page,
    count,
    numberOfPages,
  };
}


async updateOne(
    filter: RootFilterQuery<TDocument>,
    update: UpdateQuery<TDocument>
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filter, update);
  }
async findOneAndUpdate(
  filter: RootFilterQuery<TDocument>,
  update: UpdateQuery<TDocument>,
  options: QueryOptions<TDocument> | null = { new: true }
): Promise<TDocument | null> {
  return await this.model.findOneAndUpdate(filter, update, options);
}



async deleteOne(
    filter: RootFilterQuery<TDocument>,

  ): Promise<DeleteResult> {
    return this.model.deleteOne(filter);
  }


      }