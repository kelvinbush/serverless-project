import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from "../models/TodoUpdate";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import * as uuid from 'uuid'
import {TodosAccess} from "../dataLayer/todosAccess";

const todoAccess = new TodosAccess()

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => todoAccess.getTodos(userId);

export const deleteTodo = async (userId: string, todoId: string): Promise<void> => todoAccess.deleteTodo(userId, todoId);

export const updateTodo = async (userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> => {
  return todoAccess.updateTodo(todoUpdate, userId, todoId);
}

export const createTodo = (userId: string, todoRequest: CreateTodoRequest): Promise<TodoItem> => {
  const todoId = uuid.v4()
  const bucketName = process.env.ATTACHMENT_S3_BUCKET;
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

