import {TodoItem} from '../models/TodoItem'
import {TodosAccess} from "./todosAcess";
import {parseUserId} from "../auth/utils";
import {TodoUpdate} from "../models/TodoUpdate";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import * as uuid from 'uuid'

const todoAccess = new TodosAccess()

export const getTodos = async (jwtToken: string): Promise<TodoItem[]> => todoAccess.getTodos(parseUserId(jwtToken));

export const deleteTodo = async (jwtToken: string, todoId: string): Promise<void> => todoAccess.deleteTodo(parseUserId(jwtToken), todoId);

export const updateTodo = async (jwtToken: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> => {
  return todoAccess.updateTodo(todoUpdate, parseUserId(jwtToken), todoId);
}

export const createTodo = (jwtToken: string, todoRequest: CreateTodoRequest): Promise<TodoItem> => {
  const userId = parseUserId(jwtToken)
  const todoId = uuid.v4()
  const bucketName = process.env.S3_BUCKET_NAME;
  return todoAccess.createTodo({
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
    done: false,
    ...todoRequest
  })
};

export const generateUploadUrl = async (todoId: string): Promise<string> => todoAccess.generateUploadUrl(todoId);

