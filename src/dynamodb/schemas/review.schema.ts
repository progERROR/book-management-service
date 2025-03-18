import { Schema } from 'dynamoose';

export const ReviewSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  bookId: {
    type: String,
  },
  userName: {
    type: String,
  },
  content: {
    type: String,
  },
});