import { AwsS3Service } from '../aws-s3.service';
import { NotFoundException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn().mockImplementation(() => ({
      upload: jest.fn().mockReturnThis(),
      promise: jest.fn(),
      getObject: jest.fn().mockReturnThis(),
    })),
  };
});

describe('AwsS3Service', () => {
  let service: AwsS3Service;
  let s3Mock: jest.Mocked<S3>;
  let configServiceMock: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configServiceMock = {
      get: jest.fn().mockReturnValue('test-bucket'),
    } as any;

    service = new AwsS3Service(configServiceMock);
    s3Mock = (service as any).s3;
  });

  describe('uploadBookContent', () => {
    it('should upload content and return the key', async () => {
      const bookId = '123';
      const content = 'Sample content';
      (s3Mock.upload as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Key: `${bookId}.txt` }),
      });

      const result = await service.uploadBookContent(bookId, content);
      expect(result).toBe('123.txt');
      expect(s3Mock.upload).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Body: content,
        Key: '123.txt',
      });
    });
  });

  describe('getFileContent', () => {
    it('should return file content', async () => {
      (s3Mock.getObject as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Body: Buffer.from('File content') }),
      });

      const content = await service.getFileContent('test-bucket', 'file.txt');
      expect(content).toBe('File content');
      expect(s3Mock.getObject).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: 'file.txt',
      });
    });

    it('should throw NotFoundException if file body is empty', async () => {
      (s3Mock.getObject as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      await expect(service.getFileContent('test-bucket', 'file.txt'))
        .rejects.toThrow(NotFoundException);
    });
  });
});
