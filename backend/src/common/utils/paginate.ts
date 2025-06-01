export async function paginate<T>(
  prismaModel: any,
  args: {
    page: number;
    limit: number;
    where?: any;
    orderBy?: any;
    include?: any;
    select?: any;
  }
): Promise<{
  results: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}> {
  const { page, limit, where, orderBy, include, select } = args;

  const [total, results] = await Promise.all([
    prismaModel.count({ where }),
    prismaModel.findMany({
      where,
      orderBy,
      include,
      select,
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    results,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit,
    },
  };
}