import { ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
 
export const graphqlConfig: ApolloDriverConfig = {
  debug: false,
  playground: true,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  sortSchema: true,
};