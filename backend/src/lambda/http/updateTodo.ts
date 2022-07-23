import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'

import {updateTodo} from '../../businessLogic/todos'
import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {getUserId} from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const updatedItem = await updateTodo(getUserId(event), todoId, updatedTodo)
    
    return {
      statusCode: 201,
      body: JSON.stringify({updatedItem})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
