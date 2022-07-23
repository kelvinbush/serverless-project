import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from '../utils/logger'
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {TodoItem} from "../models/TodoItem";
import {TodoUpdate} from "../models/TodoUpdate";

// @ts-ignore
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

export class TodosAccess {
  constructor(
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly s3 = new XAWS.S3({signatureVersion: "v4"})
  ) {
  }
  
  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('Creating todo')
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todoItem
    }).promise()
    return todoItem
  }
  
  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('getting todos')
    const queryParams = {
      TableName: this.todoTable,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    }
    
    const result = await this.docClient.query(queryParams).promise()
    return result.Items as TodoItem[]
  }
  
  async updateTodo(todoUpdate: TodoUpdate, userId: string, todoId: string): Promise<TodoUpdate> {
    logger.info('Updating todo')
    const updateParams = {
      TableName: this.todoTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      },
      UpdateExpression: "set #name = :name, #date = :date, #done = :done",
      ExpressionAttributeNames: {
        "#name": "name",
        "#date": "dueDate",
        "#done": "done"
      },
      ExpressionAttributeValues: {
        ":name": todoUpdate['name'],
        ":date": todoUpdate['dueDate'],
        ":done": todoUpdate['done']
      },
      ReturnValues: "ALL_NEW"
    };
    const result = await this.docClient.update(updateParams).promise();
    return result.Attributes as TodoUpdate
  }
  
  async deleteTodo(userId: string, todoId: string): Promise<void> {
    logger.info('deleting todo')
    await this.docClient.delete({
      TableName: this.todoTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      }
    }).promise()
  }
  
  async generateUploadUrl(todoId: string): Promise<string> {
    logger.info('generating upload url')
    return this.s3.getSignedUrl("putObject", {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: 500,
    });
  }
}

