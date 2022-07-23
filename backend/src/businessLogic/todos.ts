import {TodoItem} from '../models/TodoItem'
import {parseUserId} from "../auth/utils";
import {TodoUpdate} from "../models/TodoUpdate";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import * as uuid from 'uuid'
import {TodosAccess} from "../helpers/todosAcess";

const todoAccess = new TodosAccess()

export const getTodos = async (userId: string): Promise<TodoItem[]> => todoAccess.getTodos(userId);

export const deleteTodo = async (userId: string, todoId: string): Promise<void> => todoAccess.deleteTodo(userId, todoId);

export const updateTodo = async (userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> => {
  return todoAccess.updateTodo(todoUpdate, userId, todoId);
}

export const createTodo = (userId: string, todoRequest: CreateTodoRequest): Promise<TodoItem> => {
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

export const createAttachmentPresignedUrl = async (todoId: string): Promise<string> => todoAccess.generateUploadUrl(todoId);

