import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors} from 'middy/middlewares'

import {getTodosForUser as getTodosForUser} from '../../businessLogic/todos'
import {getUserId} from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const items = await getTodosForUser(getUserId(event))
    
    return {
      statusCode: 200,
      body: JSON.stringify({items})
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
