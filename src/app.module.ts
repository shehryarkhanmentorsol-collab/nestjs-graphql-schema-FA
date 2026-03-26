import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo"
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorModule } from './modules/author/author.module';
import { BookModule } from './modules/book/book.module';


@Module({
  imports: [
    // Graphql (code-frist)
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true
    }),

    //mongodb local viqa compass 

     MongooseModule.forRoot('mongodb://localhost:27017/nest-graphql', {
  connectionFactory: (connection) => {
    connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully — nest-graphql');
    });
    connection.on('error', (err: Error) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    return connection;
  },
}),
 
    //Feature Modules 
    AuthorModule,
    BookModule,
  ],
})
export class AppModule {}
