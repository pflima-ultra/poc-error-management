import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { BasicDataServiceHealthModule } from '@ultraos/runtime/dist/public/healthcheck/dataservice/basic.dataservice.health.module';

@Module({
    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            context: ({ req }) => ({ req }),
            playground: JSON.parse(process.env.graphqlPlayground!),
            debug: JSON.parse(process.env.graphqlDebug!),
        }),
        BasicDataServiceHealthModule,
    ],
})
export class AppModule {}
