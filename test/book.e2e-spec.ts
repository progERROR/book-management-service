import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('BookResolver (e2e)', () => {
  const request = require('supertest');
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const gql = '/graphql';

  it('should create a book', async () => {
    const createBookMutation = `
      mutation {
        createBook(data: { author: "John Doe", title: "Test Book", content: "This is a test book." }) {
          id
          author
          title
          contentReference
          content
          reviews {
            id
            bookId
            userName
            content
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(gql)
      .send({ query: createBookMutation });

    expect(response.status).toBe(200);
    expect(response.body.data.createBook).toMatchObject({
      author: "John Doe",
      title: "Test Book",
      content: "This is a test book.",
      reviews: [],
    });
  });

  it('should fetch all books', async () => {
    const getAllBooksQuery = `
      query {
        getAllOrFilteredBooks {
          id
          author
          title
          contentReference
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(gql)
      .send({ query: getAllBooksQuery });

    expect(response.status).toBe(200);
    expect(response.body.data.getAllOrFilteredBooks).toBeInstanceOf(Array);
  });

  it('should fetch a book by ID', async () => {
    //ID should exist in db
    const getBookByIdQuery = `
      query {
        getBookById(id: "99b4601b-1c5a-45b7-b716-fc2df1b3cd54") {
          id
          author
          title
          contentReference
          content
          reviews {
            id
            bookId
            userName
            content
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(gql)
      .send({ query: getBookByIdQuery });

    expect(response.status).toBe(200);
    expect(response.body.data.getBookById).toHaveProperty('id', '99b4601b-1c5a-45b7-b716-fc2df1b3cd54');
  });

  it('should return an error if book not found', async () => {
    const getBookByIdQuery = `
      query {
        getBookById(id: "99b4601b-1c5a-45b7-b716-fc2df1b3cd00") {
          id
          author
          title
          contentReference
          content
          reviews {
            id
            bookId
            userName
            content
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(gql)
      .send({ query: getBookByIdQuery });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain('There is no book under 99b4601b-1c5a-45b7-b716-fc2df1b3cd00 id');
  });
});
